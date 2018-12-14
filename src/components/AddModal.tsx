import * as React from 'react';
import {
    Text, TextInput, View, TouchableOpacity, TouchableNativeFeedbackBase
} from 'react-native';
import PopUp from './popup';

export type AddModalProps = {
    onAdd?: (text: string) => any
}

export type AddModalState = {
    text: string
}

export default class AddModal extends React.Component<AddModalProps, AddModalState> {
    popUp: PopUp | null = null
    constructor(props: AddModalProps) {
        super(props);
        this.state = {
            text: ''
        }
    }
    show() {
        this.popUp && this.popUp.show();
    }
    setRef(ref: PopUp) {
        this.popUp = ref
    }
    onAdd(){
        if(this.state.text.trim()){
            this.props.onAdd && this.props.onAdd(this.state.text);
            this.popUp && this.popUp.hide();
        }
    }
    onClose = () => {
        this.setState({
            text: ''
        })
    }
    render() {
        return (
            <PopUp
                ref={this.setRef.bind(this)}
                modalBoxHeight={450}
                modalBoxWidth={300}
                modalBoxRadius={5}
                modalBoxBg='#fff'
                transparentIsClick={true}
                duration={200}
                offsetTop={100}
                onCloseTransitionEnd={this.onClose}
            >
                <View
                    style={{
                        padding: 20,
                        flex: 1
                    }}
                >
                    <TextInput
                        multiline = {true}
                        style={{height: 320}}
                        returnKeyType="done"
                        autoFocus={true}
                        onChangeText={(text) => this.setState({ text })}
                        value={this.state.text}
                        placeholder="写一个 todo 吧"
                    />
                    <TouchableOpacity style={{
						borderRadius: 25,
						borderWidth: 1,
						borderColor: '#fff',
                        backgroundColor:'#68a0cf',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        bottom: 20,
                        width: 200,
                        marginLeft: 50,
					}} onPress={ this.onAdd.bind(this) }>
						<Text style={{
							color: '#FFF'
						}}>添加</Text>
					</TouchableOpacity>
                </View>
            </PopUp>
        )
    }
}