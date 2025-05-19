import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, TextInput, HelperText, Portal, Dialog, useTheme } from 'react-native-paper';
import axios from 'axios';

import { api } from '../config/api';
import UniText from '../components/UniText';

export default function Register({ navigation }) {
    // Theme
    const { colors, dark } = useTheme();
    // State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    // Error variables
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
    const goToLogin = () => {
        setDialogVisible(false);
        navigation.navigate('Login')    
    };
    const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$');

    // Registration handler
    const handleRegister = () => {
        email === '' ? setEmailError(true) : setEmailError(false);
        password === '' ? setPasswordError(true) : setPasswordError(false);
        confirmPassword === '' ? setConfirmPasswordError(true) : setConfirmPasswordError(false);
        name === '' ? setNameError(true) : setNameError(false);
        lastName === '' ? setLastNameError(true) : setLastNameError(false);
        if (email && name && lastName && password && confirmPassword) { 
            if (!emailRegex.test(email)) {
                setEmailDialogVisible(true);
                return;
            }
            if (password !== confirmPassword) {
                setPwDialogVisible(true);
                return;
            }
            setLoading(true);
            axios.post(api + 'login/register', { name: name.toLowerCase(), lastname: lastName.toLowerCase(), email: email.toLowerCase(), password: password})
                .then(async (response) => {
                    if (response.status === 201) {
                        setDialogVisible(true);
                    } else if (response.status === 500) {
                        setRegisterError(true);
                    }
                })
                .catch((error) => {
                    setRegisterError(true);
                    setLoading(false);
                    console.error(error);
                });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.tertiary || colors.primary }]}>Registro</Text>
            <UniText
                label="Correo"
                placeholder="Ingresa tu correo institucional"
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
                textContentType='emailAddress'
                autoCapitalize='none'
            />
            <HelperText type='error' padding='none' visible={emailError}>
                Ingresa un correo válido
            </HelperText>
            <UniText
                label="Nombre"
                placeholder="Ingresa tu nombre/s"
                value={name}
                onChangeText={(name) => {
                    setName(name);
                    setNameError(false);
                }}
                textContentType='name'
            />
            <HelperText type='error' padding='none' visible={nameError}>
                Ingresa tu nombre
            </HelperText>
            <UniText
                label="Apellidos"
                placeholder="Ingresa tu apellido/s"
                value={lastName}
                onChangeText={(lastname) => {
                    setLastName(lastname);
                    setLastNameError(false);
                }}
                textContentType='familyName'
            />
            <HelperText type='error' padding='none' visible={lastNameError}>
                Ingresa tu apellidos
            </HelperText>
            <UniText
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={(pass) => {
                    setPassword(pass);
                    setPasswordError(false);
                }}
                textContentType='password'
                autoCapitalize='none'
                secureTextEntry={passwordVisible}
                right={
                    <TextInput.Icon
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        color={colors.tertiary || colors.primary}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                }
            />
            <HelperText type='error' padding='none' visible={passwordError}>
                Ingresa una contraseña
            </HelperText>
            <UniText
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={confirmPassword}
                onChangeText={(pass) => {
                    setConfirmPassword(pass);
                    if (password !== pass) {
                        setConfirmPasswordError(true);
                    } else {
                        setConfirmPasswordError(false);
                    }
                }}
                textContentType='password'
                autoCapitalize='none'
                secureTextEntry={passwordVisible}
                right={
                    <TextInput.Icon
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        color={colors.tertiary || colors.primary}
                        onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    />
                }
            />
            <HelperText type='error' padding='none' visible={confirmPasswordError}>
                La contraseña no coincide
            </HelperText>
            <Button
                mode="elevated"
                style={[styles.button, { backgroundColor: colors.tertiary || colors.primary }]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? <ActivityIndicator size={'small'} color={colors.onTertiary || colors.onPrimary} /> : <Text style={[styles.text, { color: colors.onTertiary || colors.onPrimary }]}>Registrarse</Text>}
            </Button>
            <Text style={[styles.text, { color: colors.outline, padding: 15 }]}>
                ¿Ya tienes cuenta?{' '}
                <Text style={{ color: colors.primary }} onPress={() => navigation.navigate('Login')}>
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