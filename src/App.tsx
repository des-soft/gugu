import React, { Component } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';
import { Text, View,SafeAreaView, NavigatorIOS } from 'react-native';

import List from "./containers/List"; 

const store = createStore(reducers);

export default function App() {
	return (
		<ReduxProvider store={store}>
			<View style={{ flex: 1 }}>
				<SafeAreaView></SafeAreaView>
				<NavigatorIOS
					initialRoute={{
						component: List, title: 'Todo List Choose'
					}}
					translucent={ true }
					navigationBarHidden={ true }
					style={{ flex: 1 }}
					interactivePopGestureEnabled={ true }
				/>
			</View>
		</ReduxProvider>
	)
}
