import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContentScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>This is a label</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        color: '#000',
    },
});

export default ContentScreen;