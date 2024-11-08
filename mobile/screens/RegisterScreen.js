import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { toggleTheme, globalLightTheme, ScreenWrapper} from './ScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import { MD3DarkTheme, MD3LightTheme, Button, TextInput, HelperText } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';

const darkTheme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors } };
const lightTheme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors } };
let theme = lightTheme;

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const [nameError, setNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);

    const [isDark, setIsDark] = useState(globalLightTheme);

    theme = isDark ? darkTheme : lightTheme;

    const handleLogin = () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        name === '' ? setNameError(true) : setNameError(false);
        lastName === '' ? setLastNameError(true) : setLastNameError(false);
        if (email && password && name && lastName) {
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
                        console.log('B' + isDark + ' ' + globalLightTheme);
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={[styles.title, { color: theme.colors.onTertiary }]}>Registro</Text>
                <TextInput
                    style={styles.input}
                    label="Correo"
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
                    style={styles.input}
                    label="Nombre"
                    placeholder="Ingresa tu nombre/s"
                    placeholderTextColor={theme.colors.onBackground}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setNameError(false);
                    }}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                />
                <HelperText type='error' padding='none' visible={nameError}>
                    Ingresa tu nombre
                </HelperText>
                <TextInput
                    style={styles.input}
                    label="Apellidos"
                    placeholder="Ingresa tu apellido/s"
                    placeholderTextColor={theme.colors.onBackground}
                    value={lastName}
                    onChangeText={(text) => {
                        setLastName(text);
                        setLastNameError(false);
                    }}
                    activeUnderlineColor={theme.colors.tertiary}
                    textColor={theme.colors.onTertiary}
                />
                <HelperText type='error' padding='none' visible={lastNameError}>
                    Ingresa tu apellido
                </HelperText>
                <TextInput
                    style={styles.input}
                    label="Contraseña"
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
                <Text style={[styles.text, {color: theme.colors.tertiary, padding:15}]}>¿Ya tienes cuenta? <Text style={{color: theme.colors.primary}} onPress={() => navigation.navigate('Login')}>Ingresa</Text></Text>
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
        marginTop: -10,
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