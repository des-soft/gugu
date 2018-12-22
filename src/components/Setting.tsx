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
            form:{
                Bucket: '',
                APPID: '',
                SecretId: '',
                SecretKey: '',
            }
        }
    }
    render() {
        return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                >
                    <SafeAreaView>
                        <View style={styles.form}>
                        {
                            Object.keys(this.state.form).map(key => {
                                return (
                                    <View style={styles.formItem}>
                                        <Text style={styles.label}>{key}</Text>
                                        <TextInput 
                                            style={{
                                                borderBottomWidth: 1,
                                                borderColor: '#999',
                                                paddingTop: 15,
                                                paddingBottom: 10,
                                            }}
                                            editable = {true}    
                                        />
                                    </View>
                                )
                            })
                        }
                        </View>
                        <Button 
                        title="完成"
                        />
                    </SafeAreaView>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
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

