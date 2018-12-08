import * as React from 'react';
import {
    Modal, StyleSheet, Text, View, SafeAreaView, FlatList,
    ListRenderItem, NavigatorIOS, TouchableHighlight
} from 'react-native';
import PopUp from './popup';

export type AddModalProps = {
}

export default class AddModal extends React.Component<AddModalProps> {
    popUp: React.RefObject<PopUp> | null = null
    constructor(props: AddModalProps){
        super(props);
    }
    show(){
        this.popUp && this.popUp.show();
    }
    setRef(ref: React.Ref<PopUp>){
        this.popUp = ref
    }
    render() {
        return (
            <PopUp 
            ref={this.setRef.bind(this)}
            modalBoxHeight={300}
            modalBoxWidth={300}
            modalBoxRadius={5}
            modalBoxBg='#fff'
            transparentIsClick={true}
            duration={200}
            offsetTop={100}
            >
                <Text>123</Text>
            </PopUp>
        )
    }
}
