import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

const darkTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors } };
const lightTheme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors } };

let theme = lightTheme;

export function toggleTheme(isDark) {
    theme = isDark ? darkTheme : lightTheme;
}

export function ScreenWrapper({
    children,
    style
}) {
    
    const insets = useSafeAreaInsets();

    const containerStyle = [
        styles.container,
        {
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.left,
        },
    ];

    return (
        <>
            <View style={[containerStyle, style]}>{children}</View>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});