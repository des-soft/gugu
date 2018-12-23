import { SettingType } from './types'
import { AsyncStorage } from "react-native"
export const SettingPool = new (class {
    key: string = '@Setting'

    get(): Promise<SettingType> {
        return AsyncStorage.getItem(this.key).then(value => {
            return value ? JSON.parse(value) : {};
        });
    }

    set(value: SettingType): Promise<any> {
        return AsyncStorage.setItem(this.key, JSON.stringify(value));
    }

})(); 