import * as React from 'react';
import {
    TextInput, View, TouchableOpacity, Text
} from 'react-native';
import PopUp from './popup';

export type AddModalProps = {
    onAdd(text: string): void,
    visible: boolean,
    onClose(): any
}

export type AddModalState = {
    text: string
}

export default class AddModal extends React.Component<AddModalProps, AddModalState> {
    constructor(props: AddModalProps) {
        super(props);
        this.state = {
            text: ''
        }
    }

    onAdd = () => {
        if (this.state.text.trim()) {
            this.props.onAdd && this.props.onAdd(this.state.text.trim());
        }
    }

    onCloseTransitionEnd = () => {
        this.setState({
            text: ''
        })
    }

    render() {
        return (
            <PopUp
                visible={this.props.visible}
                style={{
                    width: 300,
                    height: 300,
                    borderRadius: 5,
                    backgroundColor: '#fff',
                }}
                maskClosable={true}
                duration={200}
                slideDistance={100}
                onClose={this.props.onClose}
                onCloseTransitionEnd={this.onCloseTransitionEnd}
            >
                <View
                    style={{
                        padding: 20,
                        flex: 1
                    }}
                >
                    <TextInput
                        multiline={true}
                        style={{ flex: 1 }}
                        returnKeyType="done"
                        autoFocus={true}
                        onChangeText={(text) => this.setState({ text })}
                        onSubmitEditing={this.onAdd}
                        value={this.state.text}
                        placeholder="写一个 todo 吧"
                        blurOnSubmit={true}
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
					}} onPress={ this.onAdd }>
						<Text style={{
							color: '#FFF'
						}}>添加</Text>
					</TouchableOpacity>
                </View>
            </PopUp>
        )
    }
}
