import * as React from 'react';
import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableHighlight
} from 'react-native';
import { Pool, TodoType } from "../TodoPool";

export type TodoProps = {
    id: string
}

export default class Todo extends React.Component<TodoProps> {
    render() {
        const todo = Pool.find(this.props.id); 
        if (todo) {
            return (
                <View>
                    <Text>{ todo.text }</Text>
                    <Text>{ this.props.id }</Text>
                </View>
            )
        } else {
            return (
                <Text>无效的 id: { this.props.id }</Text>
            )
        }
    }
}
