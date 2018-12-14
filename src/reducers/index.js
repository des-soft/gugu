import { Pool, TodoType } from "../TodoPool"; 
import { combineReducers } from 'redux'

export default combineReducers({
  todoList: function (state = Pool.getAll(), action) {
    if (action.type === 'CHANGE_TODO_LIST') {
      return action.todoList;
    }
    return state;
  },
  todoDetailId: function (state = null, action) {
    if (action.type === 'VIEW_TODO') {
      return action.id;
    }
    return state;
  }
})