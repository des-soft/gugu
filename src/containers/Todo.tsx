import { connect } from 'react-redux'
import Todo from '../components/Todo'
import { Pool, TodoType } from "../TodoPool";

const mapStateToProps = state => { 
    console.log(state.todoDetailId)
    let todoDetailId = state.todoDetailId;
    return {
        todo: todoDetailId ? Pool.find(todoDetailId) : null 
    }
};

// const mapDispatchToProps = dispatch => ({
// })

export default connect(
  mapStateToProps,
//   mapDispatchToProps
)(Todo)