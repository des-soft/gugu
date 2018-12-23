import { AsyncStorage } from "react-native"
export const UserPool = new (class {
    key: string = '@UID'

    private genUID(): string{
        return +new Date() + '';
    }

    getUID(): Promise<string> {
        return AsyncStorage.getItem(this.key).then(value => {
            if(value){
                return value;
            }else{
                let id = this.genUID();
                return AsyncStorage.setItem(this.key, id).then(_ => id);
            }
        });
    }
})(); 