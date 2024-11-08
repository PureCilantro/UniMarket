import React, {useContext} from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

export function ScreenWrapper({
    children,
    style
}) {
    const {theme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    
    const insets = useSafeAreaInsets();

    const containerStyle = [
        styles.container,
        {
            backgroundColor: activeColors.background,
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