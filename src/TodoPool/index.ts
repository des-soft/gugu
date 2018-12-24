export * from "./types";

import { TodoType, TodoData, SettingType } from "./types";
import { AsyncStorage } from "react-native"
import { ObjectStorage } from "../utils/ObjectStorage"
import RemoteSync from "./RemoteSync"

export const Pool = new (class {
    key: string = '@TODOList';
    setting: Partial<SettingType> = {};
    remoteSync: RemoteSync | null = null;
    osRequiredKeys: (keyof SettingType)[] = ['Bucket', 'APPID', 'SecretId', 'SecretKey']
    handlers: Function[] = []   //pull event handlers

    get valid() {
        return !!this.remoteSync && this.setting.author;
    }
    
    init(setting: SettingType) {
        console.log('init', setting)
        //check if setting is completed and have changed
        if (this.osRequiredKeys.every(key => !!setting[key] && this.setting[key] !== setting[key])) {
            let os = new ObjectStorage(
                setting.Bucket,
                setting.APPID,
                setting.SecretId,
                setting.SecretKey
            );
            if (this.remoteSync) this.remoteSync.destroy();
            this.remoteSync = new RemoteSync(os)
            this.remoteSync.startPoll(this.emitPull)
        }
        this.setting = setting;
    }

    /**
     * get TODO list in local storage 
     */
    get(): Promise<TodoType[]> {
        return AsyncStorage.getItem(this.key).then(value => {
            return value ? JSON.parse(value) : [];
        });
    }


    /**
     * set TODO list in local storage 
     */
    set(value: TodoType[]): Promise<any> {
        return AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

    /**
     * find TODO by id in local storage 
     */
    find(id: string): Promise<TodoType | null> {
        return this.get().then(list => {
            return list.filter(e => e.id === id).pop() || null;
        })
    }

    /**
     * listen remote pull
     */
    onPull = (cb: (list?: TodoType[]) => any) => {
        this.handlers.push(cb);
    }

    /**
     * dispatch remote pull
     */
    emitPull = (list: TodoType[]) => {
        this.handlers.forEach(fn => fn(list))
    }

    forceSync = () => {
        this.remoteSync && this.remoteSync.sync();
    }

    modifyMeta(id: string, newOne: Partial<TodoType>) {
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if (~idx) {
                list[idx] = { ...list[idx], ...newOne }
                return this.set(list).then(_ => {
                    return list
                })
            }
            return list;
        })
    }

    /**
     * add todo && push to remote
     */
    add(newOne: Pick<TodoData, "text">) {
        return this.get().then(list => {
            let todo: TodoType = {
                id: Date.now() + "",
                data: {
                    author: this.setting.author as string,
                    create_at: Date.now(),
                    update_at: Date.now(),
                    ...newOne
                }
            }
            list.push(todo);
            return this.set(list).then(_ => {
                this.remoteSync && this.remoteSync.push('ADD', todo)
            }).then(_ => list)
        })
    }

    /**
    * modify todo && push to remote
    */
    modify(id: string, newOne: Pick<TodoData, "text">) {
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if (~idx) {
                list[idx].data = { ...list[idx].data, ...newOne, update_at: +new Date() }
                return this.set(list).then(_ => {
                    this.remoteSync && this.remoteSync.push('MODIFY', list[idx])
                }).then(_ => list)
            }
            return list;
        })
    }

    /**
    * finish todo && push to remote
    */
    finish(id: string) {
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if (~idx) {
                list[idx].data = {
                    ...list[idx].data, ...{
                        finishedBy: this.setting.author,
                        finishTime: +new Date()
                    }
                }
                return this.set(list).then(_ => {
                    this.remoteSync && this.remoteSync.push('FINISH', list[idx])
                }).then(_ => list)
            }
            return list;
        })
    }

    /**
    * delete todo && if not finished, push to remote
    */
    delete(id: string) {
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if (~idx) {
                let item = list.splice(idx, 1)[0];
                return this.set(list).then(_ => {
                    this.remoteSync && !item.data.finishedBy && this.remoteSync.push('DELETE', item)
                }).then(_ => list)
            }
            return list;
        })
    }
})(); 
