import React, { useState, useContext} from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, HelperText, Portal, Dialog } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';
import axios from 'axios';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function RegisterScreen({ navigation }) {
    //Variables de estado
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    //Variables de error
    const [nameError, setNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(true);
    const [emailDialogVisible, setEmailDialogVisible] = useState(false);
    const [pwDialogVisible, setPwDialogVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const toggleEmailDialog = () => setEmailDialogVisible(!emailDialogVisible);
    const togglePwDialog = () => setPwDialogVisible(!pwDialogVisible);
    const toggleDialog = () => setDialogVisible(!dialogVisible);
    const toggleRegisterError = () => setRegisterError(!registerError);
    const goToLogin = () => navigation.navigate('Login');
    const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$');
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Función para manejar el registro
    const handleRegister = () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        confirmPassword === '' ? setConfirmPasswordError(true) : setConfirmPasswordError(false);
        name === '' ? setNameError(true) : setNameError(false);
        lastName === '' ? setLastNameError(true) : setLastNameError(false);
        if (email && name && lastName && password && confirmPassword) { 
            if (!emailRegex.test(email)) {
                setEmailDialogVisible(true);
            }
            if (password != confirmPassword) {
                setPwDialogVisible(true);
            }
            axios.post(api + 'login/register', body = { name: name.toLowerCase(), lastname: lastName.toLowerCase(), email: email.toLowerCase(), password: password})
                .then(async (response) => {
                    if (response.status === 201) {
                        setDialogVisible(true);
                    } else if (response.status === 500) {
                        setRegisterError(true);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.iconContainer}>
                <Icon                                                      //Icono de sol o luna para cambiar el tema
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
                <TextInput                                                 //Input para correo
                    style={styles.input}
                    label="Correo"
                    placeholder="Ingresa tu correo institucional"
                    placeholderTextColor={activeColors.outline}
                    value={email}
                    onChangeText={(email) => {
                        setEmail(email);
                        setEmailError(false);
                    }}
                    onBlur={() => {
                        if (!emailRegex.test(email)) {
                            setEmailError(true);
                        }
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='emailAddress'
                />
                <HelperText type='error' padding='none' visible={emailError}>
                    Ingresa un correo válido
                </HelperText>
                <TextInput                                                 //Input para nombre
                    style={styles.input}
                    label="Nombre"
                    placeholder="Ingresa tu nombre/s"
                    placeholderTextColor={activeColors.outline}
                    value={name}
                    onChangeText={(name) => {
                        setName(name);
                        setNameError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='name'
                />
                <HelperText type='error' padding='none' visible={nameError}>
                    Ingresa tu nombre
                </HelperText>
                <TextInput                                                 //Input para apellidos
                    style={styles.input}
                    label="Apellidos"
                    placeholder="Ingresa tu apellido/s"
                    placeholderTextColor={activeColors.outline}
                    value={lastName}
                    onChangeText={(lastname) => {
                        setLastName(lastname);
                        setLastNameError(false);
                    }}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='familyName'
                />
                <HelperText type='error' padding='none' visible={lastNameError}>
                    Ingresa tu apellido
                </HelperText>
                <TextInput                                                 //Input para contraseña
                    style={styles.input}
                    label="Contraseña"
                    placeholder="Ingresa una contraseña"
                    placeholderTextColor={activeColors.outline}
                    value={password}
                    onChangeText={(pass) => {
                        setPassword(pass);
                        setPasswordError(false);
                    }}
                    secureTextEntry={passwordVisible}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='password'
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
                <TextInput                                                 //Input para confirmar contraseña
                    style={styles.input}
                    label="Confirma contraseña"
                    placeholder="Ingresa tu contraseña de nuevo"
                    placeholderTextColor={activeColors.outline}
                    value={confirmPassword}
                    onChangeText={(pass) => {
                        setConfirmPassword(pass);
                        if (password != pass) {
                            setConfirmPasswordError(true);
                        } else {
                            setConfirmPasswordError(false);
                        }
                    }}
                    secureTextEntry={confirmPasswordVisible}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    textContentType='password'
                    autoCapitalize='none'
                    right={
                        <TextInput.Icon
                            icon={confirmPasswordVisible ? 'eye-off' : 'eye'}
                            color={activeColors.tertiary}
                            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        />
                    }
                />
                <HelperText type='error' padding='none' visible={confirmPasswordError}>
                    La contraseña no coincide
                </HelperText>
                <Button                                                    //Botón para registrarse
                    mode="elevated"
                    style={[styles.button,{backgroundColor: activeColors.tertiary}]}
                    onPress={handleRegister} 
                ><Text style={[styles.text, {color: activeColors.onTertiary}]}>Sign in</Text></Button>
                <Text style={[styles.text, {color: activeColors.outline, padding:15}]}> 
                    ¿Ya tienes cuenta?{' '}
                    <Text style={{color: activeColors.primary}} onPress={() => navigation.navigate('Login')}>
                        Ingresa
                    </Text>
                </Text>
                <Portal>
                    <Dialog visible={emailDialogVisible} onDismiss={toggleEmailDialog}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Ingresa un correo válido</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleEmailDialog}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={pwDialogVisible} onDismiss={togglePwDialog}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Las contraseñas no coinciden</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={togglePwDialog}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={dialogVisible} onDismiss={toggleDialog}>
                        <Dialog.Title>Registro</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">Se registró la cuenta!</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={goToLogin}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={registerError} onDismiss={toggleRegisterError}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">No se pudo registrar la cuenta</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleRegisterError}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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