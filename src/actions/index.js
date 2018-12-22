import { Pool, TodoType } from "../TodoPool";

export function addTodo(text) {
    Pool.push({ text });
    return {
        type: 'CHANGE_TODO_LIST',
    }
}

export function modifyTodo(id, text) {
    Pool.modify(id, { text });
    return {
        type: 'CHANGE_TODO_LIST',
    }
}

export function deleteTodo(id, text) {
    Pool.delete(id);
    return {
        type: 'CHANGE_TODO_LIST',
    }
}

export function finishTodo(id, text) {
    Pool.delete(id);
    return {
        type: 'CHANGE_TODO_LIST',
    }
}

export function viewTodo(id) {
    return {
        type: 'VIEW_TODO',
        id
    }
}