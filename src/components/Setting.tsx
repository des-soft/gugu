import * as React from 'react';
import {
    Text, StyleSheet, TextInput, View, Button, Modal, SafeAreaView
} from 'react-native';
import PopUp from './popup';

export type SettingProps = {
    visible: boolean
}


export default class Setting extends React.Component<SettingProps> {
    constructor(props){
        super(props)
        this.state = {
            form: [{
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
            }, {
                label: '您的昵称',
                key: 'author',
                value: this.props.setting.author || ''
            }]
        }
    }

    onFinish = () => {
        this.props.onChange(this.state.form.reduce((target, item) => {
            target[item.key] = item.value;
            return target;
        }, {}));
        this.props.onClose();
    }

    onCancel = () => {
        this.props.onClose();
    }

    onChange = (key, value: string) => {
        this.setState(state => {
            let item = state.form.find(item => item.key === key);
            if(item) item.value = value;
            return state;
        })
    }

    render() {
        return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                    onDismiss={this.props.onDismiss}
                >
                    <SafeAreaView>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.header}>配置（基于腾讯云COS）</Text>
                        </View>
                        <View style={styles.form}>
                        {
                            this.state.form.map(formItem => {
                                return (
                                    <View style={styles.formItem} key={formItem.key}>
                                        <Text style={styles.label}>{formItem.label || formItem.key}</Text>
                                        <TextInput 
                                            style={{
                                                borderBottomWidth: 1,
                                                borderColor: '#999',
                                                paddingTop: 15,
                                                paddingBottom: 10,
                                            }}
                                            onChangeText={value => this.onChange(formItem.key, value)}
                                            value={formItem.value}
                                            editable = {true}    
                                        />
                                    </View>
                                )
                            })
                        }
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
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    header: {
		fontSize: 20,
		paddingLeft: 30,
		paddingTop: 20,
		fontWeight: 'bold'
	},
	form: {
        padding: 30
    },
    formItem:{
        marginBottom: 40
    },
    label:{
        color: '#999'
    }
});

