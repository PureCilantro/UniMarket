import React, {useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper } from './ScreenWrapper';

export default function InboxScreen({ navigation }) {
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Inbox</Text>
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        marginTop: 16,
        textAlign: 'center',
    },
});