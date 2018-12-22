import * as React from 'react';
import {
    Text, TextInput, View, TouchableOpacity, TouchableNativeFeedbackBase
} from 'react-native';
import PopUp from './popup';

export type TagProps = {
    text: string
}


export default class Tag extends React.Component<TagProps> {
    render() {
        return (
            <View style={{
                height: 18
            }}>
                <Text style={{
                    borderColor: 'grey',
                    borderWidth: 1,
                    position: 'absolute',
                    padding: 2,
                    fontSize: 12,
                    color: '#666',
                }}>已完成</Text>
            </View>
        )
    }
}
