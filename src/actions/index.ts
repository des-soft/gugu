import { Pool, SettingType, TodoType } from "../TodoPool";
import { SettingPool } from "../TodoPool/setting";
import { UserPool } from "../TodoPool/user";

export function initUID() {
    return UserPool.getUID().then(UID => {
        return {
            type: 'SET_UID',
            UID
        }
    });
}

export function initTodo(list?: TodoType[]) {
    if(list){
        return {
            type: 'CHANGE_TODO_LIST',
            list
        }
    }else{
        return Pool.getAll().then(list => {
            return {
                type: 'CHANGE_TODO_LIST',
                list
            }
        });
    }
}

export function addTodo(text: string) {
    return Pool.add({ text }).then(list => {
        return {
            type: 'CHANGE_TODO_LIST',
            list
        }
    });
}

export function modifyTodo(id: string, text: string) {
    return Pool.modify(id, { text }).then(list => {
        return {
            type: 'CHANGE_TODO_LIST',
            list
        }
    });
}

export function deleteTodo(id: string) {
    return Pool.delete(id).then(list => {
        return {
            type: 'CHANGE_TODO_LIST',
            list
        }
    });
}

export function finishTodo(id: string) {
    return Pool.finish(id).then(list => {
        return {
            type: 'CHANGE_TODO_LIST',
            list
        }
    });
}

export function viewTodo(id: string) {
    return Pool.find(id).then(todo => {
        return {
            type: 'VIEW_TODO',
            todo
        }
    }).catch(err => {

    });
}

export function changeSetting(setting: SettingType) {
    return SettingPool.set(setting).then(() => {
        return {
            type: 'CHANGE_SETTING',
            setting
        }
    }).catch(err => {

    });
}

export function initSetting() {
    return SettingPool.get().then(setting => {
        return {
            type: 'CHANGE_SETTING',
            setting
        }
    }).catch(err => {

    });
}
