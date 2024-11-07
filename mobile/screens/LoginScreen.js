import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toggleTheme, ScreenWrapper} from './ScreenWrapper';
import { MD3DarkTheme, MD3LightTheme, Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

const darkTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors } };
const lightTheme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors } };

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isDark, setIsDark] = useState(true);

    let theme = isDark ? darkTheme : lightTheme;
    
    const handleLogin = () => {
        
    };

    return (
        <ScreenWrapper>
            <View style={styles.iconContainer}>
                <Icon
                    name={isDark ? 'sun' : 'moon'}
                    size={24}
                    color={theme.colors.tertiary}
                    padding={10}
                    onPress={() => {
                        setIsDark(!isDark);
                        toggleTheme(isDark);
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.tertiary }]}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu correo institucional"
                    value={email}
                    onChangeText={setEmail}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                    right={
                        <TextInput.Icon
                            name={passwordVisible ? 'eye-off' : 'eye'}
                            color={theme.colors.tertiary}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    }
                />
                <Button 
                    mode="elevated"
                    style={[styles.button,{backgroundColor: theme.colors.tertiary}]}
                    onPress={handleLogin} 
                ><Text style={[styles.text, {color: theme.colors.onTertiary}]}>Sign in</Text></Button>
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 30,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        marginTop: 10,
        fontSize: 16,
    },
    button: {
        fontSize: 16,
        marginTop: 30,
        alignSelf: 'center',
        width: '90%',
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
});