import { connect } from 'react-redux'
import Todo from '../components/Todo'
import { Pool, TodoType } from "../TodoPool";
import { modifyTodo, deleteTodo, finishTodo } from '../actions'


const mapStateToProps = state => { 
    let todoDetailId = state.todoDetailId;
    return {
        todo: todoDetailId ? Pool.find(todoDetailId) : null,
    }
};

const mapDispatchToProps = (dispatch: Function) => ({
    onChange: (id: string, content: string) => dispatch(modifyTodo(id, content)),
    onDelete: (id: string) => dispatch(deleteTodo(id)),
    onFinish: (id: string) => dispatch(finishTodo(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo)