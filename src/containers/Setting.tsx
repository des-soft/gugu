import { connect } from 'react-redux'
import { changeSetting } from '../actions'
import Setting from '../components/Setting'
import { SettingType}  from '../TodoPool/types'

const mapStateToProps = state => ({ 
    setting: state.setting
});

const mapDispatchToProps = dispatch => ({
    onChange: (setting: SettingType) => dispatch(changeSetting(setting)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setting)