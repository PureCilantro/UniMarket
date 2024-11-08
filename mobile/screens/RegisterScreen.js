import React, { useState, useContext} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper} from './ScreenWrapper';
import { Button, TextInput, HelperText } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

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

    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

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
                    name={theme.mode === 'light' ? 'sun' : 'moon'}
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => {
                        toggleTheme();
                    }}
                />
            </View>
            <View style={styles.container}>
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Registro</Text>
                <TextInput
                    style={styles.input}
                    label="Correo"
                    placeholder="Ingresa tu correo institucional"
                    placeholderTextColor={activeColors.outline}
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setEmailError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                />
                <HelperText type='error' padding='none' visible={emailError}>
                    Ingresa un correo
                </HelperText>
                <TextInput
                    style={styles.input}
                    label="Nombre"
                    placeholder="Ingresa tu nombre/s"
                    placeholderTextColor={activeColors.outline}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        setNameError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                />
                <HelperText type='error' padding='none' visible={nameError}>
                    Ingresa tu nombre
                </HelperText>
                <TextInput
                    style={styles.input}
                    label="Apellidos"
                    placeholder="Ingresa tu apellido/s"
                    placeholderTextColor={activeColors.outline}
                    value={lastName}
                    onChangeText={(text) => {
                        setLastName(text);
                        setLastNameError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                />
                <HelperText type='error' padding='none' visible={lastNameError}>
                    Ingresa tu apellido
                </HelperText>
                <TextInput
                    style={styles.input}
                    label="Contraseña"
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={activeColors.outline}
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        setPasswordError(false);
                    }}
                    secureTextEntry={passwordVisible}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    autoCapitalize='none'
                    right={
                        <TextInput.Icon
                            icon={passwordVisible ? 'eye-off' : 'eye'}
                            color={activeColors.tertiary}
                            onPress={() => setPasswordVisible(!passwordVisible)}
                        />
                    }
                />
                <HelperText type='error' padding='none' visible={passwordError}>
                    Ingresa una contraseña
                </HelperText>
                <Button 
                    mode="elevated"
                    style={[styles.button,{backgroundColor: activeColors.tertiary}]}
                    onPress={handleLogin} 
                ><Text style={[styles.text, {color: activeColors.onTertiary}]}>Sign in</Text></Button>
                <Text style={[styles.text, {color: activeColors.outline, padding:15}]}>¿Ya tienes cuenta? <Text style={{color: activeColors.primary}} onPress={() => navigation.navigate('Login')}>Ingresa</Text></Text>
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