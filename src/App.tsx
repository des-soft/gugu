import React, { Component } from 'react';
import { Text, View,SafeAreaView, NavigatorIOS } from 'react-native';

import List from "./components/List"; 

export default function App() {
	return (
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
		
	)
}
