import { Pool, TodoType } from "../TodoPool";

export function addTodo(text) {
    Pool.push({
        text
    });
    return {
        type: 'CHANGE_TODO_LIST',
        todoList: Pool.getAll().slice()
    }
}

export function viewTodo(id) {
    return {
        type: 'VIEW_TODO',
        id
    }
}