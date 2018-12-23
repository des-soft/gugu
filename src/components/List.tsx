import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItem, NavigatorIOS, TouchableOpacity, AlertIOS,
	Modal, Image
} from 'react-native';

import * as React from 'react';
import Todo from "../containers/Todo";
import { Pool, TodoType } from "../TodoPool";
import AddModal from "./AddModal";
import Setting from "../containers/Setting";


type ListProps = {
	navigator: NavigatorIOS
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
			settingOpened: false
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
					<Text>{item.text}</Text>
					<View style={styles.listDesc}>
						<Text style={styles.listAuthor}>- by {item.author}</Text>
						<Text style={styles.listDate}>{item.update_at}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	setRef(ref: AddModal) {
		this.popUp = ref
	}

	onShowModal = () => {
		this.popUp && this.popUp.show();
	}

	renderSetting = () => {
		return this.state.settingOpened && (
			<Setting
				visible={this.state.settingVisible}
				onClose={() => this.setState({ settingVisible: false })}
				onDismiss={() => this.setState({ settingOpened: false })}
			/>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				{ this.renderSetting() }
				<AddModal
					onAdd={this.props.onAdd}
					ref={this.setRef.bind(this)}
				></AddModal>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text style={styles.header}>Todos</Text>
					<TouchableOpacity onPress={() => this.setState({ settingVisible: true, settingOpened: true })}>
						<Image source={require('../assets/setting.png')} style={{
							width: 25,
							height: 25,
							marginRight: 20
						}} />
					</TouchableOpacity>
				</View>
				<FlatList
					style={styles.list}		    // 样式
					renderItem={this.renderList}  // 组件 
					data={this.props.todoList}	// 数据
					keyExtractor={d => d.id}		// 使用 id 字段作为 key
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
						backgroundColor: '#68a0cf',
					}} onPress={this.onShowModal}>
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
		flex: 1,
		fontSize: 24,
		padding: 20,
		fontWeight: 'bold'
	},
	list: {
		flex: 1,
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
