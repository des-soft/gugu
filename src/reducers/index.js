import { Pool, TodoType } from "../TodoPool"; 
import { combineReducers } from 'redux'

export default combineReducers({
  todoList: function (state = [], action) {
    if (action.type === 'CHANGE_TODO_LIST') {
      return action.list;
    }
    return state;
  },
  todoDetail: function (state = null, action) {
    if (action.type === 'VIEW_TODO') {
      return action.todo;
    }
    return state;
  },
  setting: function (state = {}, action) {
    if (action.type === 'CHANGE_SETTING') {
      return action.setting;
    }
    return state;
  },
  UID: function (state = '', action) {
    if (action.type === 'SET_UID') {
      return action.UID;
    }
    return state;
  },

})