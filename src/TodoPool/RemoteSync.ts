export * from "./types";

import { TodoType, TodoTypeRaw, SettingType } from "./types";
import { AsyncStorage, NetInfo, ConnectionInfo, NetInfoStatic, ConnectionType } from "react-native"
import { ObjectStorage, ListBucketResult, ContentsType } from "../utils/ObjectStorage"
import { Pool } from "./index"
import Todo from "../components/Todo";

function isOnline(type: any) {
    return type !== 'none'
}

type pushType = 'ADD' | 'MODIFY' | 'FINISH' | 'DELETE';

type SyncCallback = (result: TodoType[]) => void

export type cacheQueueItem = {
    type: pushType,
    todo: TodoType
}


export default class {
    key: string = '@remoteSyncPushStore'
    os: ObjectStorage;
    online: boolean | null = null;
    readyPromise: Promise<void> | null;
    noPushingPromise: Promise<any> = Promise.resolve();
    callback: SyncCallback | void = undefined;
    pollTimer: NodeJS.Timeout | null = null;
    activeKey = 'active';
    finishedKey = 'finished';
    enableCache: boolean = true;

    constructor(os: ObjectStorage) {
        this.os = os;
        this.readyPromise = NetInfo.getConnectionInfo().then(this.setNetInfo)
        NetInfo.addEventListener('connectionChange', this.onConnectionChange)
        !this.enableCache && this.set([])
    }

    onConnectionChange = (e: ConnectionType | ConnectionInfo) => {
        this.setNetInfo(e);
        if (this.online) {
            this.sync()
        }
    }

    setNetInfo = (e: ConnectionType | ConnectionInfo) => {
        if(typeof e !== 'string') e = e.type;
        this.online = isOnline(e)
        console.log('isOnline', this.online)
    }

    /**
     * 开启定时轮询
     * @param {SyncCallback} callback 每次从远端拉取数据完成，写入本地存储后的回调
     * @return 移除定时轮询函数
     */
    startPoll = (callback: SyncCallback, interval: number = 30 * 1000): (() => void) => {
        this.callback = callback;

        let poll = async () => {
            return this.sync().catch(err => {
                //catch 防止报错中断 then 调用链
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

        return () => {
            this.pollTimer && clearTimeout(this.pollTimer);
        }
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
            let localList = await Pool.get();
            let remoteMeta: (ContentsType & {id?: string})[] = await this.getList(this.activeKey)

            remoteMeta.forEach(remote => {
                remote.id = remote.Key.replace(/([^\/]*)\/([^\/]*)/, '$2');
                if(!localList.find(item => item.id === remote.id)){
                    //新数据：添加到本地列表
                    localList.push({ id: remote.id } as TodoType)
                }
            })

            let promises = localList.map(async (item: TodoType & {_deleted?: true}) => {
                let remoteItem;
                if (item.data && item.data.finishedBy) {
                    //finished so that nothing to change
                    return item;
                } else if (remoteItem = remoteMeta.find(({ id }) => item.id === id)) {
                    if (remoteItem.ETag === item.ETag) {
                        //数据未改变，不作处理
                        return item;
                    } else {
                        //something to add or modify
                        let newItem = await this.os.download(`/${this.activeKey}/${item.id}`);
                        if (newItem.code === 200) {
                            return {
                                id: item.id,
                                ETag: newItem.headers.etag,
                                data: newItem.data
                            }
                        } else if (!item.data) {
                            //新数据获取失败，进行删除
                            return {_deleted: true};
                        } else {
                            //老数据获取失败，返回原数据
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
                            ETag: newItem.headers.etag,
                            data: newItem.data
                        }
                    }
                }
            })
            let result = (await Promise.all(promises)).filter(item => !item._deleted) as TodoType[]

            //set to local storage
            await Pool.set(result);
            console.log('pull Result', result);

            this.callback && this.callback(result);

            return result
        }
    }

    push = async (type: pushType, todo: TodoType) => {
        await this.readyPromise;
        if (this.online) {
            await this.noPushingPromise;
            this.noPushingPromise = this.assignPush({ type, todo }).catch((err: any) => {
                console.log('push err', err);
                //远程推送失败，本地保存待下一次推送
                this.storePush({type, todo});
            }).catch(() => {})
        } else {
            this.storePush({type, todo})
        }
    }

    async cleanLocalPushQueue() {
        await this.readyPromise;
        if (this.online) {
            let queue = await this.get();
            if (queue.length) {
                await this.noPushingPromise;
                for (let { type, todo } of queue.slice()) {
                    this.noPushingPromise = this.assignPush({ type, todo }).then(() => {
                        queue.shift();
                    }).catch((err: any) => {
                        console.log('push err', err);
                    })
                    await this.noPushingPromise;
                }
                return this.noPushingPromise = this.set(queue)
            }
        }
    }

    assignPush = ({ type, todo }: cacheQueueItem) => {
        let fn;
        switch (type) {
            case 'ADD': fn = this.pushAdd; break;
            case 'MODIFY': fn = this.pushModify; break;
            case 'FINISH': fn = this.pushFinish; break;
            case 'DELETE': fn = this.pushDelete; break;
        }
        return fn.call(this, todo)
    }

    storePush = (e: cacheQueueItem) => {
        return this.get().then(list => {
            list.push(e);
            return this.set(list);
        });
    }

    async pushAdd(todo: TodoType) {
        let ret = await this.os.upload(`/${this.activeKey}/${todo.id}`, todo.data);
        console.log('pushAdd', ret);
        if (ret.code === 200) {
            ret.headers.etag && await Pool.modifyMeta(todo.id, { ETag: ret.headers.etag })
        } else {
            throw new Error('fail')
        }
        return ret;
    }

    async pushModify(todo: TodoType) {
        let ret = await this.os.upload(`/${this.activeKey}/${todo.id}`, todo.data);
        console.log('pushModify', ret);
        if (ret.code === 200) {
            ret.headers.etag && await Pool.modifyMeta(todo.id, { ETag: ret.headers.etag })
        } else {
            throw new Error('fail')
        }
        return ret;
    }

    async pushFinish(todo: TodoType) {
        let uploadRet = await this.os.upload(`/${this.finishedKey}/${todo.id}`, todo.data);
        let deleteRet = await this.os.delete(`/${this.activeKey}/${todo.id}`);
        console.log('pushFinish', uploadRet, deleteRet);
        if (uploadRet.code === 200) {
            uploadRet.headers.etag && await Pool.modifyMeta(todo.id, { ETag: uploadRet.headers.etag })
        }
        if (uploadRet.code !== 200 || ![200, 204].includes(deleteRet.code)) {
            throw new Error('fail')
        }
        return uploadRet;
    }

    async pushDelete(todo: TodoType) {
        let deleteRet = await this.os.delete(`/${this.activeKey}/${todo.id}`);
        console.log('pushDelete', deleteRet);
        if (![200, 204].includes(deleteRet.code)) {
            throw new Error('fail')
        }
        return deleteRet;
    }

    private get(): Promise<cacheQueueItem[]> {
        return AsyncStorage.getItem(this.key).then(value => {
            return value ? JSON.parse(value) : [];
        });
    }

    private set(value: cacheQueueItem[]): Promise<any> {
        return AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

};
