import React from 'react';
import { TextInput, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function UniText(props) {
    const { colors } = useTheme();
    return (
        <TextInput
            style={styles.input}
            placeholderTextColor={colors.outline}
            activeUnderlineColor={colors.tertiary || colors.primary}
            textColor={colors.onBackground}
            {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        fontSize: 16,
    },
});