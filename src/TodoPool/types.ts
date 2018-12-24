export type RemoveProperty<T, K extends keyof T> =
    Pick<T, Exclude<keyof T, K>>

export type TodoType = {
    id: string,
    ETag?: string,
    data: TodoData
}

export type TodoData = {
	author: string, 
    create_at: number, 
    update_at: number,
    text: string, 
    finishedBy?: string,
    finishTime?: number
}

export type SettingType = {
	Bucket: string, 
    APPID: number | string, 
    SecretId: string,
    SecretKey: string, 
    author: string
}

export type TodoTypeRaw = Pick<TodoData, "text">
