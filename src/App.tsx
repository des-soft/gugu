import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Text, View, SafeAreaView, NavigatorIOS } from 'react-native';
import { Pool } from "./TodoPool";
import { initTodo, initSetting, initUID } from "./actions";
import List from "./containers/List";
import store from "./store";

async function initAPP(){
	await store.dispatch(initUID())
	let { setting } = await store.dispatch(initSetting())
	Pool.init(setting);
	await store.dispatch(initTodo())
	console.log(store.getState())
}

initAPP().catch(err => {throw err});

export default function App() {
	return (
		<ReduxProvider store={store}>
			<View style={{ flex: 1 }}>
				<SafeAreaView></SafeAreaView>
				<NavigatorIOS
					initialRoute={{
						component: List, title: 'Todo List Choose'
					}}
					translucent={true}
					navigationBarHidden={true}
					style={{ flex: 1 }}
					interactivePopGestureEnabled={true}
				/>
			</View>
		</ReduxProvider>
	)
}
