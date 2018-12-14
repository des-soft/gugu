import * as React from 'react';
import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableHighlight
} from 'react-native';

export type TodoProps = {
    id: string
}

export default class Todo extends React.Component<TodoProps> {
    render() {
        let todo = this.props.todo;
        if (todo) {
            return (
                <View>
                    <Text>{ todo.text }</Text>
                    <Text>{ todo.id }</Text>
                </View>
            )
        } else {
            return (
                <Text>! TODO 不存在</Text>
            )
        }
    }
}
