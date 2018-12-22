import * as React from 'react';
import {
    Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
    ListRenderItem, NavigatorIOS, TouchableHighlight, TextInput, Button, AlertIOS
} from 'react-native';
import Tag from './Tag'

export type TodoProps = {
    id: string
}

export default class Todo extends React.Component<TodoProps> {
    // constructor(props: TodoProps){
    //     super(props);
    // }
    onChangeText = value => {
        this.props.onChange(this.props.todo.id, value)
    }
    onFinish = () => {
        // this.props.onFinish(this.props.todo.id)
    }
    onDelete = () => {
        AlertIOS.alert('确定删除TODO？', '', [{
            text: '不',
            style: 'cancel'
        }, {
            text: '删除',
            onPress: () => this.props.onDelete(this.props.todo.id),
            style: 'destructive'
        }]);
    }
    render() {
        let todo = this.props.todo;
        if (todo) {
            return (
                <View>
                    <View style={styles.content}>
                        <Tag text="已完成" />
                        <TextInput
                            style={{
                                marginTop: 20
                            }}
                            onChangeText={this.onChangeText}
                            value={todo.text}
                        />
                        <View style={styles.descWrapper}>
                            <View style={styles.descItem}>
                                <Text style={[{ flex: 1 }, styles.descText]}>- writed by {' '} {todo.author}</Text>
                                <Text style={styles.descText}>{todo.update_at}</Text>
                            </View>
                            <View style={styles.descItem}>
                                <Text style={[{ flex: 1 }, styles.descText]}>- finished by {' '} {todo.author}</Text>
                                <Text style={styles.descText}>{todo.update_at}</Text>
                            </View>
                        </View>
                        {/* <Text>{todo.id}</Text> */}
                    </View>
                    <View style={{
                        marginTop: 20
                    }}>
                        <View style={{
                            borderTopWidth: 1,
                            borderTopColor: '#f2f2f2',
                            padding: 10
                        }}>
                            <Button
                                onPress={this.onFinish}
                                title="完成"
                            />
                        </View>
                        <View style={{
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#f2f2f2',
                            padding: 10
                        }}>
                            <Button
                                onPress={this.onDelete}
                                color="red"
                                title="删除"
                            />
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <Text>! TODO 不存在</Text>
            )
        }
    }
}

const styles = StyleSheet.create({
    content: {
        padding: 20
    },
    descWrapper: {
        marginTop: 60,
    },
    descItem: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingLeft: 10
    },
    descText: {
        color: '#333'
    }
});

