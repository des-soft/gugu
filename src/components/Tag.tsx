import * as React from 'react';
import {
    Text, View
} from 'react-native';

export type TagProps = {
    text: string,
    tagStyle?: Object
}


export default class Tag extends React.Component<TagProps> {
    render() {
        return (
            <View style={{
                height: 18
            }}>
                <Text style={[{
                    borderColor: 'grey',
                    borderWidth: 1,
                    position: 'absolute',
                    padding: 2,
                    fontSize: 12,
                    color: '#666',
                }, this.props.tagStyle || {}]}>{this.props.text}</Text>
            </View>
        )
    }
}
