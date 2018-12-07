export type RemoveProperty<T, K extends keyof T> =
    Pick<T, Exclude<keyof T, K>>

export type TodoType = {
	author: string, 
    create_at: string, 
    update_at: string,
    text: string, 
	id: string
}

export type TodoTypeRaw = Pick<TodoType, "text">
