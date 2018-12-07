import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableOpacity, AlertIOS
} from 'react-native';

import * as React from 'react';
import Todo from "./Todo";
import { Pool, TodoType } from "../TodoPool"; 


type ListProps = {
	navigator: NavigatorIOS
};

type ListState = {
	todoList: TodoType[]
}

export default class List extends React.Component<ListProps, ListState> {
	constructor(props: ListProps) {
		super(props); 

		this.state = {
			todoList: Pool.getAll()
		}
	}

	onPress = (id: string) => {
		this.props.navigator.push({
			component: Todo, 
			passProps: { id }
		})
	}

	renderList: ListRenderItem<TodoType> = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={ e => this.onPress(item.id) }>
				<View style={styles.listItem}>
					<Text>{item.text}</Text>
					<View style={styles.listDesc}>
						<Text style={styles.listAuthor}>- by {item.author}</Text>
						<Text style={styles.listDate}>{item.update_at}</Text>
					</View>
				</View>
			</TouchableOpacity>
		); 
	}

	add = () => {
		AlertIOS.prompt(
			'写一个 todo 吧', '嗯, 随便写写嘛',
			// 值
			text => {
				Pool.push({ text }); 

				this.loadList(); 
			}
		);
	}

	loadList() {
		this.setState({
			todoList: Pool.getAll()
		})	
	}

	render() {
		return (
			<View style={ styles.container }>
				<Text style={ styles.header }>Todos</Text>
				<FlatList
					style={ styles.list }		    // 样式
					renderItem={ this.renderList }  // 组件 
					data={ this.state.todoList }	// 数据
					keyExtractor={ d => d.id }		// 使用 id 字段作为 key
				/>

				<SafeAreaView style={{
					justifyContent: 'center', 
					flexDirection: 'row',
					marginBottom: 16
				}}>
					<TouchableOpacity style={{
						borderRadius: 25,
						borderWidth: 1,
						borderColor: '#fff',
						backgroundColor:'#68a0cf',
					}} onPress={ this.add }>
						<Text style={{
							width: 50, lineHeight: 50, textAlign: 'center', 
							color: '#FFF'
						}}>添加</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5FCFF',
	},
	header: {
		fontSize: 24,
		padding: 20,
		fontWeight: 'bold'
	},
	list: {
		flex: 1,
	},
	listItem:{
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 30,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2'
	},
	listDesc:{
		flexDirection: 'row',
		marginTop: 20,
		marginLeft: 10,
	},
	listAuthor: {

	},
	listDate: {
		marginLeft: 15,
		flex: 1,
		textAlign: "right"
	},
});
