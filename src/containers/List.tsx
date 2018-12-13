import { connect } from 'react-redux'
import { addTodo, viewTodo } from '../actions'
import TodoList from '../components/List'

const mapStateToProps = state => ({ 
    todoList: state.todoList
});

const mapDispatchToProps = dispatch => ({
    onAdd: text => dispatch(addTodo(text)),
    onViewDetail: id => dispatch(viewTodo(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)