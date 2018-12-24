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
                    backgroundColor: '#666',
                    borderWidth: 1,
                    borderColor: '#666',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'absolute',
                    padding: 2,
                    fontSize: 12,
                    color: '#fff',
                }, this.props.tagStyle || {}]}>{this.props.text}</Text>
            </View>
        )
    }
}
