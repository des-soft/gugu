import * as React from 'react';
import {
    Text, StyleSheet, AlertIOS, View, Button, Modal, SafeAreaView, ScrollView
} from 'react-native';
import { SettingType } from '../TodoPool/types'
import FormItem from './FormItem'

export type SettingProps = {
    visible: boolean,
    onClose: Function,  //call on close request
    onDismiss?(): void,    //call after close animation finish
    setting: SettingType,
    onFinish: Function 
}

type FormState = {
    label?: string,
    key: keyof SettingType, // 等价于 "Bucket" | "APPID" | "SecretId" | "SecretKey" | "author"
    value: string | number
}[]

export type SettingState = {
    cos: FormState,
    others: FormState,
}

export type StrObj = {
    [key: string]: string | number
}

export default class Setting extends React.Component<SettingProps, SettingState> {
    constructor(props: SettingProps){
        super(props)
        this.state = {
            cos: [{
                key: 'Bucket',
                value: this.props.setting.Bucket || ''
            }, {
                key: 'APPID',
                value: this.props.setting.APPID || ''
            }, {
                key: 'SecretId',
                value: this.props.setting.SecretId || ''
            }, {
                key: 'SecretKey',
                value: this.props.setting.SecretKey || ''
            }],
            others: [{
                label: '您的昵称',
                key: 'author',
                value: this.props.setting.author || ''
            }]
        }
    }

    onFinish = () => {
        let items = this.state.cos.concat(this.state.others);
        this.props.onFinish(items.reduce((target, item) => {
            target[item.key] = item.value;
            return target;
        }, {} as StrObj));
        
        this.props.onClose();
    }

    onCancel = () => {
        this.props.onClose();
    }

    onChange = (field: 'cos' | 'others', key: string, value: string | number) => {
        this.setState(state => {
            let item = state[field].find(item => item.key === key);
            if(item) item.value = value;
            return state;
        })
    }
    
    openCOSJSON = () => {
        AlertIOS.prompt('导入 COS JSON 格式配置', '', val => {
            let config: {[prop: string]: any} = {};
            try{
                config = JSON.parse(val);
            }catch(err){
                AlertIOS.alert('JSON格式错误')
            }
            Object.prototype.toString.call(config) === '[object Object]' &&
            Object.keys(config).forEach(key => {
                let val = config[key];
                if(typeof val === 'number' || typeof val === 'string'){
                    this.onChange('cos', key, val);
                }
            })
        })
    }

    render() {
        console.log(this.props.setting);
        return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                    onDismiss={this.props.onDismiss}
                >
                    <SafeAreaView style={{flex: 1}}>
                        <ScrollView style={{flex: 1}}>
                            <View>
                                <Text style={styles.header}>腾讯云 COS 配置</Text>
                            </View>
                            <View style={styles.form}>
                            {
                                this.state.cos.map(formItem => {
                                    return (
                                        <FormItem
                                        key={formItem.key}
                                        label={formItem.label || formItem.key}
                                        value={formItem.value}
                                        onChange={val => this.onChange('cos', formItem.key, val)}
                                        />
                                    )
                                })
                            }
                            </View>

                            <View>
                                <Text style={styles.header}>其它</Text>
                            </View>
                            <View style={styles.form}>
                            {
                                this.state.others.map(formItem => {
                                    return (
                                        <FormItem
                                        key={formItem.key}
                                        label={formItem.label || formItem.key}
                                        value={formItem.value}
                                        onChange={val => this.onChange('others', formItem.key, val)}
                                        />
                                    )
                                })
                            }
                            </View>

                            <SafeAreaView style={{
                                marginTop: 20
                            }}>
                                <View style={{
                                    borderTopWidth: 1,
                                    borderTopColor: '#f2f2f2',
                                    padding: 10
                                }}>
                                    <Button 
                                    title="导入 COS JSON 格式配置"
                                    onPress={this.openCOSJSON}
                                    />
                                </View>
                                <View style={{
                                    borderTopWidth: 1,
                                    borderTopColor: '#f2f2f2',
                                    padding: 10
                                }}>
                                    <Button 
                                    title="完成"
                                    onPress={this.onFinish}
                                    />
                                </View>
                                <View style={{
                                    borderTopWidth: 1,
                                    borderBottomWidth: 1,
                                    borderColor: '#f2f2f2',
                                    padding: 10
                                }}>
                                    <Button 
                                    title="取消"
                                    onPress={this.onCancel}
                                    />
                                </View>
                            </SafeAreaView>
                        </ScrollView>
                    </SafeAreaView>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    header: {
		fontSize: 20,
		paddingLeft: 30,
		paddingTop: 30,
		fontWeight: 'bold'
	},
	form: {
        paddingTop: 30,
        paddingLeft: 30,
        paddingRight: 30,
    },
    formItem:{
        marginBottom: 30
    },
    label:{
        color: '#999'
    }
});

