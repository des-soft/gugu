import { connect } from 'react-redux'
import { addTodo, viewTodo, deleteTodo } from '../actions'
import TodoList from '../components/List'

const mapStateToProps = state => ({ 
    todoList: state.todoList
});

const mapDispatchToProps = dispatch => ({
    onAdd: (text: string) => dispatch(addTodo(text)),
    onViewDetail: (id: string) => dispatch(viewTodo(id)),
    onDelete: (id: string) => dispatch(deleteTodo(id)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)