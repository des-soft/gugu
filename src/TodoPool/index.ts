export * from "./types"; 

import { TodoType, TodoTypeRaw, SettingType } from "./types";
import { AsyncStorage } from "react-native"
import { ObjectStorage } from "../utils/ObjectStorage"

export const Pool = new (class {
    key: string = '@TODOList';
    setting: Partial<SettingType> = {};
    os: ObjectStorage | null = null;
    osRequiredKeys: (keyof SettingType)[] = ['Bucket', 'APPID', 'SecretId', 'SecretKey']

    private get(): Promise<TodoType[]>{
        return AsyncStorage.getItem(this.key).then(value => {
            return value ? JSON.parse(value) : [];
        });
    }

    private set(value: TodoType[]): Promise<any>{
        return AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

    init(setting: SettingType){
        this.setting = setting;
        if(this.osRequiredKeys.every(key => !!setting[key])){
            this.os = new ObjectStorage(
                setting.Bucket,
                setting.APPID,
                setting.SecretId,
                setting.SecretKey
            ); 
        }
    }

    setAuthor(author: string){
        this.setting.author = author;
    }

    getAll(): Promise<TodoType[]> {
        return this.get();
    }

    find(id: string): Promise<TodoType | null> {
        return this.get().then(list => {
            return list.filter(e => e.id === id).pop() || null;
        })
    }

    push(newOne: TodoTypeRaw) {
        return this.get().then(list => {
            list.push({
                id: Date.now() + "",
                author: this.author, 
                create_at: Date.now(),
                update_at: Date.now(),
                ...newOne
            });
            return this.set(list).then(_ => {
                return list
            })
        })
    }

    modify(id: string, newOne: TodoTypeRaw){
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if(~idx) list[idx] = {...list[idx], ...newOne, update_at: +new Date()}
            return this.set(list).then(_ => {
                return list
            })
        })
    }

    delete(id: string){
        return this.get().then(list => {
            let idx = list.findIndex(todo => todo.id === id);
            if(~idx) list.splice(idx, 1);
            return this.set(list).then(_ => {
                return list
            })
        })
    }
})(); 
