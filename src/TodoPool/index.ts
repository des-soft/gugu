export * from "./types"; 

import { TodoType, TodoTypeRaw } from "./types";
import Todo from "../containers/Todo";

const data: TodoType[] = [
	{
        id: '001',
		author: 'stephaniewang',
        create_at: 20181016,
        update_at: 20191016,
		text: '生日'
	},
	{
        id: '002',
		author: 'eczn',
        create_at: 20180213,
        update_at: 20190213,
		text: '生日'
	}
];

export const Pool = new (class {
    list: TodoType[] = []; 
    author: string; 

    constructor(author: string, initList: TodoType[]) {
        this.author = author; 
        this.list = initList; 
    }

    getAll(): TodoType[] {
        return this.list;
    }

    find(id: string): TodoType | null {
        return this.list.filter(e => e.id === id).pop() || null;
    }

    push(newOne: TodoTypeRaw) {
        return this.list.push({
            id: Date.now() + "",
            author: this.author, 
            create_at: Date.now(),
            update_at: Date.now(),
            ...newOne
        });
    }

    modify(id: string, newOne: TodoTypeRaw){
        let idx = this.list.findIndex(todo => todo.id === id);
        return !!~idx && (this.list[idx] = {...this.list[idx], ...newOne, update_at: +new Date()})
    }

    delete(id: string){
        let idx = this.list.findIndex(todo => todo.id === id);
        return !!~idx && this.list.splice(idx, 1)[0];
    }
})('王小姐', data); 

