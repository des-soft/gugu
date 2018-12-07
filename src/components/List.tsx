import React, { Component } from 'react';
import {
	Platform, StyleSheet, Text, View, SafeAreaView, FlatList,
	ListRenderItemInfo
} from 'react-native';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
	android:
		'Double tap R on your keyboard to reload,\n' +
		'Shake or press menu button for dev menu',
});

export type Todo = {
	author: string, 
	date: string | Date, 
	text: string, 
	key: string
}

const data: Todo[] = [
	{
		author: 'stephaniewang',
		date: '2018-10-16',
		text: '买衣服',
		key: 'dddd', 
	},
	{
		author: 'eczn',
		date: '2018-02-13',
		text: '买衣服', 
		key: 'asdas'
	}
];

type Props = {};
export default class App extends Component<Props> {

	renderList = ({ item, index }: ListRenderItemInfo<Todo>) => {
		return (
			<View style={index ? styles.listItem : [styles.listItem, {marginTop: 20}]}>
				<Text>{item.text}</Text>
				<View style={styles.listDesc}>
					<Text style={styles.listAuthor}>- by {item.author}</Text>
					<Text style={styles.listDate}>{item.date}</Text>
				</View>
			</View>
		); 
	}

	render() {
		return (
			<SafeAreaView style={ styles.container }>
				<Text style={ styles.header }>Our TODO</Text>
				<FlatList
					style={ styles.list }
					data={ data }
					renderItem={ this.renderList }
				/>
			</SafeAreaView>
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
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});
