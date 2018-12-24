import {
	StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableOpacity, AlertIOS, Image, Button
} from 'react-native';

import * as React from 'react';
import Todo from "../containers/Todo";
import { Pool, TodoType } from "../TodoPool";
import AddModal from "./AddModal";
import Setting from "../containers/Setting";
import Tag from "./Tag";
import { formatTime } from "../utils";


type ListProps = {
	navigator: NavigatorIOS,
	onViewDetail: Function,
	onAdd: Function,
	onDelete: Function,
	todoList: TodoType[]
};

type ListState = {
	addModalVisible: boolean,
	settingVisible: boolean,
	settingOpened: boolean
}

export default class List extends React.Component<ListProps, ListState> {
	popUp: AddModal | null = null
	constructor(props: ListProps) {
		super(props);
		this.state = {
			addModalVisible: false,
			settingVisible: false,
			settingOpened: false	//is setting Modal render
		}
	}

	onPress = (id: string) => {
		this.props.onViewDetail(id);
		this.props.navigator.push({ component: Todo })
	}

	renderList: ListRenderItem<TodoType> = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={e => this.onPress(item.id)}>
				<View style={styles.listItem}>
					{
						item.data.finishedBy && <Tag text="已完成" />
					}
					<Text style={{
						paddingTop: item.data.finishedBy ? 20 : 0
					}}>{item.data.text}</Text>
					<View style={styles.listDesc}>
						<Text style={styles.listAuthor}>- by {item.data.author}</Text>
						<Text style={styles.listDate}>{formatTime(item.data.update_at)}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	setRef(ref: AddModal) {
		this.popUp = ref
	}

	onShowModal = () => {
		if (Pool.valid) {
			this.popUp && this.popUp.show();
		} else {
			AlertIOS.alert(
				'请完善配置',
				'COS与昵称都需要啦'
			);
		}
	}

	forceSync = () => {
		Pool.forceSync();
	}

	cleanFinished = () => {
		this.props.todoList.forEach(item => {
			if(item.data.finishedBy){
				this.props.onDelete(item.id);
			}
		})
	}

	render() {
		return (
			<View style={styles.container}>
				{
					this.state.settingOpened && (
						<Setting
							visible={this.state.settingVisible}
							onClose={() => this.setState({ settingVisible: false })}
							onDismiss={() => this.setState({ settingOpened: false })}
						/>
					)
				}
				<AddModal
					onAdd={this.props.onAdd}
					ref={this.setRef.bind(this)}
				></AddModal>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.header}>Todos</Text>
					<TouchableOpacity onPress={this.forceSync}>
						<Image source={require('../assets/sync.png')} style={{
							width: 25,
							height: 25,
							marginRight: 20
						}} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setState({ settingVisible: true, settingOpened: true })}>
						<Image source={require('../assets/setting.png')} style={{
							width: 25,
							height: 25,
							marginRight: 20
						}} />
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20 }}>
					<TouchableOpacity onPress={this.cleanFinished}>
						<Text style={{
							color: '#666'
						}}>清除已完成</Text>
					</TouchableOpacity>
				</View>
				{
					this.props.todoList.length ? 
					<FlatList
						style={styles.list}		    // 样式
						renderItem={this.renderList}  // 组件 
						data={this.props.todoList}	// 数据
						keyExtractor={d => d.id}		// 使用 id 字段作为 key
					/>
					:
					<View style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Text style={{
							color: '#999'
						}}>没有TODO哦 ~</Text>
					</View>
				}

				<SafeAreaView style={{
					flexDirection: 'row',
				}}>
					<TouchableOpacity style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
						height: 60,
						backgroundColor: '#68a0cf',
					}} onPress={this.onShowModal}>
						<Text style={{
							color: '#fff',
							fontSize: 14
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
		flex: 1,
		fontSize: 24,
		padding: 20,
		fontWeight: 'bold'
	},
	list: {
		flex: 1,
		marginTop: 10
	},
	listItem: {
		paddingTop: 20,
		paddingBottom: 20,
		paddingLeft: 20,
		paddingRight: 30,
		borderBottomWidth: 1,
		borderBottomColor: '#f2f2f2'
	},
	listDesc: {
		flexDirection: 'row',
		marginTop: 30,
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
