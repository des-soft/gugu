import * as React from 'react';
import {
    Text, StyleSheet, TextInput, View
} from 'react-native';

export type FormItemProps = {
    label: string,
    value: string | number,
    onChange(value: string): void
}

export default function FormItem(props: FormItemProps) {
    return (
        <View style={styles.formItem}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                style={{
                    borderBottomWidth: 1,
                    borderColor: '#f2f2f2',
                    paddingTop: 15,
                    paddingBottom: 10,
                }}
                onChangeText={props.onChange}
                value={props.value + ''}
                editable={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formItem: {
        marginBottom: 30
    },
    label: {
        color: '#999'
    }
});

