export * from "./types"; 

import { TodoType, TodoTypeRaw } from "./types";
import { Alert } from "react-native";

const data: TodoType[] = [
	{
        id: '001',
		author: 'stephaniewang',
        create_at: '2018-10-16',
        update_at: '2019-10-16',
		text: '生日'
	},
	{
        id: '002',
		author: 'eczn',
        create_at: '2018-02-13',
        update_at: '2019-02-13',
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
            id: Date.now().toString(),
            author: this.author, 
            create_at: new Date().toString(),
            update_at: new Date().toString(),
            ...newOne
        });
    }
})('王小姐', data); 

