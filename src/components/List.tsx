import {
	StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableOpacity, AlertIOS, Image, Animated, Easing
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
	settingRender: boolean,
	forceSyncRotation: Animated.Value
}

export default class List extends React.Component<ListProps, ListState> {
	forceSyncing: boolean = false;

	constructor(props: ListProps) {
		super(props);
		this.state = {
			addModalVisible: false,
			settingVisible: false,
			settingRender: false,
			forceSyncRotation: new Animated.Value(0),
		}
	}

	onViewDetail = (id: string) => {
		this.props.onViewDetail(id);
		this.props.navigator.push({ component: Todo })
	}

	onAdd = (text: string) => {
		this.setState({ addModalVisible: false })
		this.props.onAdd(text);
	}

	onShowADD = () => {
		if (Pool.valid) {
			this.setState({
				addModalVisible: true
			})
		} else {
			AlertIOS.alert(
				'请完善配置',
				'COS与昵称都需要啦'
			);
		}
	}

	forceSync = () => {
		if(!this.forceSyncing) {
			this.forceSyncing = true;

			Pool.forceSync();

			Animated.timing(
				this.state.forceSyncRotation,
				{
					duration: 500,
					toValue: 180
				}
			).start(() => {
				this.forceSyncing = false;
				this.setState({
					forceSyncRotation: new Animated.Value(0),
				})
			})
		}
	}

	// cleanFinished = () => {
	// 	this.props.todoList.forEach(item => {
	// 		if(item.data.finishedBy){
	// 			this.props.onDelete(item.id);
	// 		}
	// 	})
	// }

	renderList: ListRenderItem<TodoType> = ({ item, index }) => {
		return (
			<TouchableOpacity onPress={e => this.onViewDetail(item.id)}>
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

	render() {
		return (
			<View style={styles.container}>
				{
					this.state.settingRender && 
					<Setting
						visible={this.state.settingVisible}
						onClose={() => this.setState({ settingVisible: false })}	//触发关闭回调
						onDismiss={() => this.setState({ settingRender: false })}
					/>
				}
				<AddModal
					visible={this.state.addModalVisible}
					onClose={() => this.setState({ addModalVisible: false })}	//触发关闭回调
					onAdd={this.onAdd}
				></AddModal>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.header}>Todos</Text>
					<TouchableOpacity onPress={this.forceSync}>
						<Animated.Image source={require('../assets/sync.png')} style={{
							width: 25,
							height: 25,
							marginRight: 20,
							transform: [{
								rotateZ: this.state.forceSyncRotation.interpolate({
									inputRange: [0, 180],
                  					outputRange: ['0deg', '180deg']
								})
							}]
						}} />
					</TouchableOpacity>
					<TouchableOpacity onPress={() => this.setState({ settingVisible: true, settingRender: true })}>
						<Image source={require('../assets/setting.png')} style={{
							width: 25,
							height: 25,
							marginRight: 20
						}} />
					</TouchableOpacity>
				</View>
				{/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingRight: 20 }}>
					<TouchableOpacity onPress={this.cleanFinished}>
						<Text style={{
							color: '#666'
						}}>清除已完成</Text>
					</TouchableOpacity>
				</View> */}
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
					}} onPress={this.onShowADD}>
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
