import * as React from 'react';
import {
    StyleSheet, Text, View, SafeAreaView, TextInput, Button, AlertIOS, NavigatorIOS, ScrollView
} from 'react-native';
import Tag from './Tag'
import {TodoType} from '../TodoPool/types'
import { formatTime } from "../utils";

export type TodoProps = {
    navigator: NavigatorIOS,
    todo: TodoType,
    author: string,
    onChange: Function,
    onFinish: Function,
    onDelete: Function,
}

export type TodoState = {
    text: string
}

export default class Todo extends React.Component<TodoProps, TodoState> {
    constructor(props: TodoProps){
        super(props);
        this.state = {
            text: props.todo.data.text
        }
    }
    onChangeText = (value: string) => {
        this.setState({text: value})
    }
    
    onChange = () => {
        this.props.onChange(this.props.todo.id, this.state.text.trim())
    }

    onFinish = () => {
        this.props.onFinish(this.props.todo.id).then(() => {
            this.props.navigator.pop()
        })
    }
    onDelete = () => {
        AlertIOS.alert('确定删除TODO？', '', [{
            text: '不',
            style: 'cancel'
        }, {
            text: '删除',
            onPress: () => {
                this.props.onDelete(this.props.todo.id).then(() => {
		            this.props.navigator.pop()
                })
            },
            style: 'destructive'
        }]);
    }
    onClean = () => {
        this.props.onDelete(this.props.todo.id).then(() => {
            this.props.navigator.pop()
        })
    }
    render() {
        let todo = this.props.todo;
        if (todo) {
            return (
                <SafeAreaView style={{flex: 1}}>
                    <ScrollView style={{flex: 1}}>
                        <View style={styles.content}>
                            {
                                todo.data.finishedBy && <Tag text="已完成" />
                            }
                            <TextInput
                                style={{
                                    marginTop: todo.data.finishedBy ? 20 : 0,
                                    height: 300
                                }}
                                onChangeText={this.onChangeText}
                                value={this.state.text}
                                multiline={true}
                                editable={this.props.author === todo.data.author && !todo.data.finishedBy}
                                returnKeyType="done"
                                onSubmitEditing={this.onChange}
                                placeholder="写点东西嘛= ="
                                blurOnSubmit={true}
                            />
                            <View style={styles.descWrapper}>
                                <View style={styles.descItem}>
                                    <Text style={[{ flex: 1 }, styles.descText]}>writed by {todo.data.author}</Text>
                                    <Text style={styles.descText}>{formatTime(todo.data.update_at)}</Text>
                                </View>
                                {
                                    todo.data.finishedBy && todo.data.finishTime && <View style={styles.descItem}>
                                        <Text style={[{ flex: 1 }, styles.descText]}>finished by {todo.data.finishedBy}</Text>
                                        <Text style={styles.descText}>{formatTime(todo.data.finishTime)}</Text>
                                    </View>
                                }
                            </View>
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
                                    disabled={!!todo.data.finishedBy}
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
                                {
                                    todo.data.finishedBy ? 
                                    <Button
                                        onPress={this.onClean}
                                        color="red"
                                        title="清除"
                                    /> 
                                    :
                                    <Button
                                        disabled={this.props.author !== todo.data.author}
                                        onPress={this.onDelete}
                                        color="red"
                                        title="删除"
                                    />
                                }
                            </View>
                        </View>
                        {/* <SafeAreaView><Text>{todo.id}</Text></SafeAreaView> */}
                    </ScrollView>
                </SafeAreaView>
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
    },
    descText: {
        color: '#333'
    }
});

