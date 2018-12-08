import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableOpacity, AlertIOS,
	Modal
} from 'react-native';

import * as React from 'react';
import Todo from "./Todo";
import { Pool, TodoType } from "../TodoPool"; 
import AddModal from "./AddModal"; 


type ListProps = {
	navigator: NavigatorIOS
};

type ListState = {
	todoList: TodoType[],
	addModalVisible: boolean
}

export default class List extends React.Component<ListProps, ListState> {
	popUp: AddModal | null = null
	constructor(props: ListProps) {
		super(props); 

		this.state = {
			todoList: Pool.getAll(),
			addModalVisible: false
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

	setRef(ref: AddModal){
        this.popUp = ref
    }

	add = () => {
		// this.setState({
		// 	addModalVisible: true
		// })
		this.popUp && this.popUp.show();
		// AlertIOS.prompt(
		// 	'写一个 todo 吧', '嗯, 随便写写嘛',
		// 	// 值
		// 	text => {
		// 		Pool.push({ text }); 

		// 		this.loadList(); 
		// 	}
		// );
	}

	loadList() {
		console.log('loadList')
		this.setState({
			todoList: Pool.getAll().slice()
		})	
	}

	render() {
		return (
			<View style={ styles.container }>
				<AddModal  
					ref={this.setRef.bind(this)}
				></AddModal>
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
