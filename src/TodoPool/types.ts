export type RemoveProperty<T, K extends keyof T> =
    Pick<T, Exclude<keyof T, K>>

export type TodoType = {
	author: string, 
    create_at: number, 
    update_at: number,
    text: string, 
	id: string
}

export type SettingType = {
	Bucket: string, 
    APPID: string, 
    SecretId: string,
    SecretKey: string, 
}

export type TodoTypeRaw = Pick<TodoType, "text">
