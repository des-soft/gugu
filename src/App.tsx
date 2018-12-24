import React, { Component } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Text, View, SafeAreaView, NavigatorIOS } from 'react-native';
import { Pool, TodoType } from "./TodoPool";
import { initTodo, initSetting, initUID } from "./actions";
import List from "./containers/List";
import store from "./store";

//device polyfill
(function(){
	const groups = [];
	const hr = '-'.repeat(80); // 80 dashes row line
	if (!console.group || !console.groupCollapsed) {
	  console.group = console.groupCollapsed = function logGroupStart(label) {
		groups.push(label);
		console.log('%c \nBEGIN GROUP: %c', hr, label);
	  };
	}
	if (!console.groupEnd) {
	  console.groupEnd = function logGroupEnd() {
		console.log('END GROUP: %c\n%c', groups.pop(), hr);
	  };
	}
})();

async function initAPP(){
	// await store.dispatch(initUID())

	let { setting } = await store.dispatch(initSetting())

	//init todo from local storage
	let { list } = await store.dispatch(initTodo())

	console.log('LOCAL_TODO_LIST', list)

	Pool.onPull((list: TodoType[]) => {
		//init todo after remote sync
		store.dispatch(initTodo(list))
	});

	Pool.init(setting);
	
	console.log('INIT_STATE', store.getState())
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
