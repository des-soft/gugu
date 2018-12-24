import { connect } from 'react-redux'
import Todo from '../components/Todo'
import { modifyTodo, deleteTodo, finishTodo } from '../actions'


const mapStateToProps = state => { 
    return {
        todo: state.todoDetail,
        author: state.setting.author
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