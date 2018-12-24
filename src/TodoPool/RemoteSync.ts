export * from "./types";

import { TodoType, TodoTypeRaw, SettingType } from "./types";
import { AsyncStorage, NetInfo } from "react-native"
import { ObjectStorage, ListBucketResult } from "../utils/ObjectStorage"
import { Pool } from "./index"

function isOnline(type) {
    return type !== 'none'
}

type pushType = 'ADD' | 'MODIFY' | 'FINISH' | 'DELETE';

export default class {
    key: string = '@remoteSyncPushStore'
    os: ObjectStorage;
    online: boolean | null = null;
    readyPromise: Promise<void> | null;
    noPushingPromise: Promise<any> = Promise.resolve();
    callback: Function | void = undefined;
    pollTimer = null;
    activeKey = 'active';
    finishedKey = 'finished';
    enableCache: boolean = true;

    constructor(os: ObjectStorage) {
        this.os = os;
        this.readyPromise = NetInfo.getConnectionInfo().then(this.setNetInfo)
        NetInfo.addEventListener('connectionChange', this.onConnectionChange)
        !this.enableCache && this.set([])
    }

    onConnectionChange = e => {
        this.setNetInfo(e);
        if (this.online) {
            this.sync()
        }
    }

    setNetInfo = ({ type }) => {
        this.online = isOnline(type)
        console.log('isOnline', this.online)
    }

    startPoll = (callback: Function, interval: number = 30 * 1000) => {
        this.callback = callback;

        let poll = async () => {
            return this.sync().catch(err => {
                console.log('poll error', err)
            })
        }

        //poll immediate
        poll();

        let startTimeout = () => {
            this.pollTimer = setTimeout(() => {
                poll().then(startTimeout)
            }, interval)
        }

        startTimeout()
    }

    destroy = () => {
        this.pollTimer && clearTimeout(this.pollTimer);
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange)
    }

    getList = (prefix: string) => {
        return this.os.list(`${prefix}/`).then(res => {
            return res.data.ListBucketResult.Contents.filter(({ Key }) => Key !== `${prefix}/`);
        })
    }

    sync = async (): Promise<any> => {
        return this.online && this.cleanLocalPushQueue().then(this.pull)
    }

    pull = async () => {
        await this.readyPromise;

        //make sure nothing is pushing
        await this.noPushingPromise;

        if (this.online) {
            let data = await Pool.getAll();
            let remotes = await this.getList(this.activeKey)

            remotes.forEach(remote => {
                remote._id = remote.Key.replace(/([^\/]*)\/(\d+)/, '$2');
                !data.find(item => item.id === remote._id) &&
                    data.push({ id: remote._id } as TodoType)
            })

            let promises = data.map(async item => {
                let remote;
                if (item.data && item.data.finishedBy) {
                    //finished so that nothing to change
                    return item;
                } else if (remote = remotes.find(({ _id }) => item.id === _id)) {
                    if (remote.ETag === item.ETag) {
                        return item;
                    } else {
                        //something to add or modify
                        let newItem = await this.os.download(`/${this.activeKey}/${item.id}`);
                        if (newItem.code === 200) {
                            return {
                                id: item.id,
                                ETag: newItem.headers.ETag,
                                data: newItem.data
                            }
                        } else {
                            return item;
                        }
                    }
                } else {
                    //something was deleted or finished
                    let newItem = await this.os.download(`/${this.finishedKey}/${item.id}`);
                    if (newItem.code === 404) {
                        //deleted
                        return { ...item, _deleted: true }
                    } else {
                        //finished
                        return {
                            id: item.id,
                            ETag: newItem.headers.ETag,
                            data: newItem.data
                        }
                    }
                }
            })
            let result = await Promise.all(promises);
            result = result.filter(item => !item._deleted)

            //set to local storage
            await Pool.set(result);
            console.log('pull Result', result);

            this.callback && this.callback(result);

            return result
        }
    }

    push = async (type: pushType, payload: Object) => {
        await this.readyPromise;
        if (this.online) {
            await this.noPushingPromise;
            let promise = new Promise((res, rej) => {
                this.assignPush({ type, payload }).then(_ => {
                    res();
                }).catch(err => {
                    console.log('push err', err);
                    this.storePush(type, payload);
                    res();
                })
            })
            this.noPushingPromise = this.noPushingPromise.then(_ => promise);
        } else {
            this.storePush(type, payload)
        }
    }

    async cleanLocalPushQueue() {
        await this.readyPromise;
        if (this.online) {
            let queue = await this.get();
            if (queue.length) {
                let toBreak = false;
                for (let { type, payload } of queue.slice()) {
                    await this.noPushingPromise;
                    if (toBreak) break;
                    let promise = new Promise((res, rej) => {
                        this.assignPush({ type, payload }).then(_ => {
                            queue.shift();
                            res();
                        }).catch(err => {
                            console.log('push err', err);
                            toBreak = true;
                            res();
                        })
                    })
                    this.noPushingPromise = this.noPushingPromise ?
                        this.noPushingPromise.then(_ => promise) :
                        promise
                }
                return this.noPushingPromise = this.noPushingPromise ?
                    this.noPushingPromise.then(_ => this.set(queue)) :
                    this.set(queue)
            }
        }
    }

    assignPush({ type, payload }: { type: pushType }) {
        let fn;
        switch (type) {
            case 'ADD': fn = this.pushAdd; break;
            case 'MODIFY': fn = this.pushModify; break;
            case 'FINISH': fn = this.pushFinish; break;
            case 'DELETE': fn = this.pushDelete; break;
        }
        return fn.call(this, payload)
    }

    storePush(type, payload) {
        return this.get().then(list => {
            list.push({ type, payload });
            return this.set(list);
        });
    }

    async pushAdd(obj) {
        let ret = await this.os.upload(`/${this.activeKey}/${obj.id}`, obj.data);
        console.log('pushAdd', ret);
        if (ret.code === 200) {
            ret.headers.ETag && await Pool.modifyMeta(obj.id, { ETag: ret.headers.ETag })
        } else {
            throw new Error('fail')
        }
        return ret;
    }

    async pushModify(obj) {
        let ret = await this.os.upload(`/${this.activeKey}/${obj.id}`, obj.data);
        console.log('pushModify', ret);
        if (ret.code === 200) {
            ret.headers.ETag && await Pool.modifyMeta(obj.id, { ETag: ret.headers.ETag })
        } else {
            throw new Error('fail')
        }
        return ret;
    }

    async pushFinish(obj) {
        let uploadRet = await this.os.upload(`/${this.finishedKey}/${obj.id}`, obj.data);
        let deleteRet = await this.os.delete(`/${this.activeKey}/${obj.id}`);
        console.log('pushFinish', uploadRet, deleteRet);
        if (uploadRet.code === 200) {
            uploadRet.headers.ETag && await Pool.modifyMeta(obj.id, { ETag: uploadRet.headers.ETag })
        }
        if (uploadRet.code !== 200 || ![200, 204].includes(deleteRet.code)) {
            throw new Error('fail')
        }
        return uploadRet;
    }

    async pushDelete(obj) {
        let deleteRet = await this.os.delete(`/${this.activeKey}/${obj.id}`);
        console.log('pushDelete', deleteRet);
        if (![200, 204].includes(deleteRet.code)) {
            throw new Error('fail')
        }
        return deleteRet;
    }

    private get(): Promise<any> {
        return AsyncStorage.getItem(this.key).then(value => {
            return value ? JSON.parse(value) : [];
        });
    }

    private set(value): Promise<any> {
        return AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

};
