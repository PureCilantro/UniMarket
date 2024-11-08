import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper} from './ScreenWrapper';
import { Button, TextInput, HelperText } from 'react-native-paper';
import Icon from '@expo/vector-icons/Feather';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(true);

    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    
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
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Ingresa</Text>
                <TextInput
                    label="Correo"
                    style={styles.input}
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
                    label="Contraseña"
                    style={styles.input}
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
                <Text style={[styles.text, {color: activeColors.outline, padding:15}]}>¿No tienes cuenta? <Text style={{color: activeColors.primary}} onPress={() => navigation.navigate('Register')}>Regístrate</Text></Text>
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