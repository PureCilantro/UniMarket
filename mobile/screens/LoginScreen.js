import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toggleTheme, globalLightTheme, ScreenWrapper} from './ScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, Button, TextInput, HelperText } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';

const darkTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors } };
const lightTheme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors } };
let theme = lightTheme;

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [isDark, setIsDark] = useState(globalLightTheme);

    useFocusEffect(
        React.useCallback(() => {
            setIsDark(globalLightTheme);
            console.log(isDark + ' ' + globalLightTheme);
        }, [])
    );

    theme = isDark ? darkTheme : lightTheme;
    
    const handleLogin = () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        if (email && password) {
            //TODO
        }
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
                <Text style={[styles.title, { color: theme.colors.onTertiary }]}>Ingresa</Text>
                <TextInput
                    label="Correo"
                    style={styles.input}
                    placeholder="Ingresa tu correo institucional"
                    placeholderTextColor={theme.colors.onBackground}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError(false);
                    }}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                />
                <HelperText type='error' padding='none' visible={emailError}>
                    Ingresa un correo
                </HelperText>
                <TextInput
                    label="Contraseña"
                    style={styles.input}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={theme.colors.onBackground}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError(false);
                    }}
                    secureTextEntry={passwordVisible}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                    autoCapitalize='none'
                    right={
                        <TextInput.Icon
                            icon={passwordVisible ? 'eye-off' : 'eye'}
                            color={theme.colors.tertiary}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    }
                />
                <HelperText type='error' padding='none' visible={passwordError}>
                    Ingresa una contraseña
                </HelperText>
                <Button 
                    mode="elevated"
                    style={[styles.button,{backgroundColor: theme.colors.tertiary}]}
                    onPress={handleLogin} 
                ><Text style={[styles.text, {color: theme.colors.onTertiary}]}>Sign in</Text></Button>
                <Text style={[styles.text, {color: theme.colors.onTertiary, padding:15}]}>¿No tienes cuenta? <Text style={{color: theme.colors.primary}} onPress={() => navigation.navigate('Register')}>Regístrate</Text></Text>
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