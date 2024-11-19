import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Switch, Card, Button, Portal, Modal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function SettingsScreen({ navigation }) {
    //Variables de estado
    const [loading, setLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);
    const [avatarPicker, setAvatarPicker] = useState(false);
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Funciones de acceso a datos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [auth, setAuth] = useState('');
    const getInfo = async () => { 
        setLoading(true);
        const userID = await AsyncStorage.getItem('userID');
        try {
            const token = await axios.post(api + 'login/getToken', { userID: userID });
            const config = { 
                headers: { authorization: `Bearer ${token.data.message}`},
                params: { userID: userID }
            };
            const response = await axios.get(api + 'user/getUserInfo', { headers: config.headers, params: config.params });
            const fName = String(response.data.message.name).charAt(0).toUpperCase() + String(response.data.message.name).slice(1);
            const lName = String(response.data.message.lastname).charAt(0).toUpperCase() + String(response.data.message.lastname).slice(1);
            setName( fName + ' ' + lName);
            setEmail(response.data.message.email);
            if (response.data.message.avatar === '') {
                setAvatar(require('../assets/blank-profile.webp'));
            } else setAvatar(api + 'users/' + response.data.message.avatar);
            if (response.data.message.auth === '') {
                setAuth(require('../assets/blank-auth.webp'));
            } else setAuth(api + 'users/' + response.data.message.auth);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const renderLoading = () => {
        return (
            <View>
                <ActivityIndicator color={activeColors.tertiary} />
            </View>
        );
    };
    useEffect(() => {
        getInfo();
    }, []);
    //Funciones de edición de datos
    const showAuth = () => {
        //TODO
    };
    const editAuth = () => {
        //TODO
    };
    //Función de cierre de sesión
    const handleLogout = async () => {
        setLogLoading(true);
        await AsyncStorage.removeItem('userID');
        setLogLoading(false);
        navigation.replace('Login');
    }

    const uploadImage = async (uri) => {
        const userID = await AsyncStorage.getItem('userID');
        const fileName = userID.substring(0, 16);
        const formData = new FormData();
        formData.append('file', {
            uri: uri,
            type: 'image/webp',
            name: fileName,
        });
        try {
            const token = await axios.post(api + 'login/getToken', { userID: userID });
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token.data.message}`
                }
            };
            const headers = { authorization: `Bearer ${token.data.message}` };
            const upload = await axios.post(api + 'upload/userImage', formData, config);
            if (upload.status === 201) {
                const register = await axios.post(api + 'user/registerUserPicture', { userID: userID, fileName: upload.data }, { headers: headers });
                if (register.status === 200) getInfo();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const takeCameraImage = async () => {
        try {
            await ImagePicker.requestCameraPermissionsAsync();
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.front,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            if (!result.cancelled) {
                uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            alert('Error al cargar la imagen' + error);
            setAvatarPicker(false);
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.rowContainer}>
                <Icon
                    name={'arrow-left'}
                    size={24}
                    color={activeColors.tertiary}
                    padding={10}
                    onPress={() => { navigation.goBack() }}
                />                
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Configuración</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.avatarPicker}>
                    <Image style={styles.avatar} source={avatar} />
                    <Icon
                        name="camera"
                        size={24}
                        color={activeColors.tertiary}
                        style={[styles.cameraIcon, {backgroundColor: activeColors.surfaceVariant}]}
                        onPress={() => {
                            setAvatarPicker(true);
                        }}
                    />
                </View>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Text style={{color: activeColors.tertiary, fontSize:11}}>Nombre</Text>
                            <View style={styles.innerRowInfo}>
                                <Text style={{color: activeColors.tertiary, fontSize:11}}>{loading ? renderLoading() : name}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Text style={{color: activeColors.tertiary, fontSize:11}}>Correo institucional</Text>
                            <View style={styles.innerRowInfo}>
                                <Text style={{color: activeColors.tertiary, fontSize:11}}>{loading ? renderLoading() : email}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Text style={{color: activeColors.tertiary, fontSize:11}}>Credencial</Text>
                            <View style={styles.innerRow}>
                                <Icon name={'camera'} size={15} color={activeColors.tertiary} onPress={showAuth}/>
                                <Icon name={'edit'} size={15} color={activeColors.tertiary} onPress={editAuth}/>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Text style={[styles.subtitle, { color: activeColors.tertiary}]}>Aplicación</Text>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3 }}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Icon
                                name={theme.mode === 'light' ? 'sun' : 'moon'}
                                size={22}
                                color={activeColors.tertiary}
                                padding={10}
                            />
                            <Text style={[styles.cardText,{color: activeColors.tertiary, marginLeft: -200}]}>Tema</Text>
                            <Switch value={theme.mode === 'dark'} onValueChange={toggleTheme}/>
                        </View>
                    </Card.Content>
                </Card>
                <Button                                                    //Botón para iniciar sesión
                    mode="elevated"
                    style={[styles.button,{backgroundColor: activeColors.tertiary}]}
                    onPress={handleLogout} 
                    disabled={logLoading}
                >
                    {logLoading ? <ActivityIndicator size={'small'} color={activeColors.onTertiary} /> : <Text style={[styles.text, {color: activeColors.onTertiary}]}>Cerrar sesión</Text>}
                </Button>
                <Portal>
                    <Modal 
                        visible={avatarPicker} 
                        onDismiss={() => {setAvatarPicker(false)}}
                        contentContainerStyle={[styles.modal, {backgroundColor: activeColors.background}]}
                    >
                            <Text style={[styles.text, { color: activeColors.tertiary }]}>Foto de perfil</Text>
                            <View style={styles.row}>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: activeColors.surfaceVariant}]}
                                    onPress={() => {takeCameraImage()}}
                                >
                                    <View>
                                        <Icon name={'camera'} size={24} color={activeColors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: activeColors.tertiary}]}>Camara</Text>
                                    </View>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: activeColors.surfaceVariant}]}
                                    onPress={() => {setAvatarPicker(false)}}
                                >
                                    <View>
                                        <Icon name={'image'} size={24} color={activeColors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: activeColors.tertiary}]}>Galería</Text>
                                    </View>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: activeColors.surfaceVariant}]}
                                    onPress={() => {setAvatarPicker(false)}}
                                >
                                    <View>
                                        <Icon name={'trash'} size={24} color={activeColors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: activeColors.tertiary}]}>Remover</Text>
                                    </View>
                                </Button>
                            </View>
                    </Modal>
                </Portal>
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginBottom: 100,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        marginTop: 16,
        textAlign: 'center',
        marginLeft: '20%',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
        marginTop: 16,
        marginLeft: 20,
        textAlign: 'left',
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardText: {
        fontSize: 16,
    },
    innerRow: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-between',
        marginRight:30
    },
    innerRowInfo: {
        flexDirection: 'row',
        width: '50%',
        marginRight:20
    },
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    button: {
        fontSize: 16,
        marginTop: 13,
        alignSelf: 'center',
        width: '90%',
    },
    text: {
        fontSize: 16,
        textAlign: 'center'
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 20,
        borderWidth: 1,
    },
    avatarPicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 25,
        right: 110,
        padding: 7,
        borderRadius: 20,
    },
    modal: {
        margin: 15,
        padding: 20,
        borderRadius: 20,
    },
    avatarButton: {
        width: '30%',
        height: 'auto',
        margin: 5,
    },
    avatarText: {
        fontSize: 11,
    },
});