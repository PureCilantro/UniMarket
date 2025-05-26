import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Card, Button, Portal, Modal, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';

import { api, getToken } from '../config/api';

export default function Settings({ navigation }) {
    // Theme
    const { colors } = useTheme();
    // State variables
    const [loading, setLoading] = useState(false);
    const [logLoading, setLogLoading] = useState(false);
    const [avatarPicker, setAvatarPicker] = useState(false);
    //Funciones de acceso a datos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [auth, setAuth] = useState('');
    const getInfo = async () => { 
        setLoading(true);
        const userID = await AsyncStorage.getItem('userID');
        try {
            const token = await getToken();
            const config = { 
                headers: { authorization: `Bearer ${token}`, userid: userID }
            };
            const response = await axios.get(api + 'user/getUserInfo', { headers: config.headers });
            const fName = String(response.data.info.name).charAt(0).toUpperCase() + String(response.data.info.name).slice(1);
            const lName = String(response.data.info.lastname).charAt(0).toUpperCase() + String(response.data.info.lastname).slice(1);
            setName( fName + ' ' + lName);
            setEmail(response.data.info.email);
            response.data.info.avatar === '' ? setAvatar(require('../assets/blank-profile.webp')) : setAvatar({ uri: response.data.info.avatar });
            response.data.info.auth === '' ? setAuth(require('../assets/blank-auth.webp')) : setAuth({ uri: response.data.info.auth });
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const renderLoading = () => {
        return (
            <View>
                <ActivityIndicator color={colors.tertiary} />
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
        await AsyncStorage.removeItem('userKey');
        setLogLoading(false);
        navigation.replace('Login');
    }

    const uploadImage = async (uri) => {
        const userID = await AsyncStorage.getItem('userID');
        const fileName = userID.substring(0, 16);
        const formData = new FormData();
        formData.append('avatar', {
            uri: uri,
            type: 'image/webp',
            name: fileName,
        });
        try {
            const token = await getToken();
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${token}`
                }
            };
            const upload = await axios.post(api + 'user/updateAvatar', formData, config);
            if (upload.status === 200) {
                setAvatarPicker(false);
                getInfo();
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
                const context = ImageManipulator.manipulate(result.uri);
                context.resize({ width: 250, height: 250 });
                const image = await context.renderAsync();
                const resized = await image.saveAsync({ format: SaveFormat.WEBP });
                uploadImage(resized.uri);
            }
        } catch (error) {
            alert('Error al cargar la imagen' + error);
            setAvatarPicker(false);
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.rowContainer}>
                <Icon
                    name={'arrow-left'}
                    size={24}
                    color={colors.tertiary}
                    padding={10}
                    onPress={() => { navigation.goBack() }}
                />                
                <Text style={[styles.title, { color: colors.tertiary }]}>Configuración</Text>
            </View>
            <View style={styles.container}>
                <View style={styles.avatarPicker}>
                    <Image style={styles.avatar} source={avatar} />
                    <Icon
                        name="camera"
                        size={24}
                        color={colors.tertiary}
                        style={[styles.cameraIcon, {backgroundColor: colors.surfaceVariant}]}
                        onPress={() => {
                            setAvatarPicker(true);
                        }}
                    />
                </View>
                <Card style={{backgroundColor: colors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: colors.tertiaryContainer}]}>
                            <Text style={{color: colors.tertiary, fontSize:11}}>Nombre</Text>
                            <View style={styles.innerRowInfo}>
                                <Text style={{color: colors.tertiary, fontSize:11}}>{loading ? renderLoading() : name}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: colors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: colors.tertiaryContainer}]}>
                            <Text style={{color: colors.tertiary, fontSize:11}}>Correo institucional</Text>
                            <View style={styles.innerRowInfo}>
                                <Text style={{color: colors.tertiary, fontSize:11}}>{loading ? renderLoading() : email}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: colors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: colors.tertiaryContainer}]}>
                            <Text style={{color: colors.tertiary, fontSize:11}}>Credencial</Text>
                            <View style={styles.innerRow}>
                                <Icon name={'camera'} size={15} color={colors.tertiary} onPress={showAuth}/>
                                <Icon name={'edit'} size={15} color={colors.tertiary} onPress={editAuth}/>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Button
                    mode="elevated"
                    style={[styles.button,{backgroundColor: colors.tertiary}]}
                    onPress={handleLogout} 
                    disabled={logLoading}
                >
                    {logLoading ? <ActivityIndicator size={'small'} color={colors.onTertiary} /> : <Text style={[styles.text, {color: colors.onTertiary}]}>Cerrar sesión</Text>}
                </Button>
                <Portal>
                    <Modal 
                        visible={avatarPicker} 
                        onDismiss={() => {setAvatarPicker(false)}}
                        contentContainerStyle={[styles.modal, {backgroundColor: colors.background}]}
                    >
                            <Text style={[styles.text, { color: colors.tertiary }]}>Foto de perfil</Text>
                            <View style={styles.row}>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: colors.surfaceVariant}]}
                                    onPress={() => {takeCameraImage()}}
                                >
                                    <View>
                                        <Icon name={'camera'} size={24} color={colors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: colors.tertiary}]}>Camara</Text>
                                    </View>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: colors.surfaceVariant}]}
                                    onPress={() => {setAvatarPicker(false)}}
                                >
                                    <View>
                                        <Icon name={'image'} size={24} color={colors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: colors.tertiary}]}>Galería</Text>
                                    </View>
                                </Button>
                                <Button
                                    mode="contained"
                                    style={[styles.avatarButton, {backgroundColor: colors.surfaceVariant}]}
                                    onPress={() => {setAvatarPicker(false)}}
                                >
                                    <View>
                                        <Icon name={'trash'} size={24} color={colors.tertiary} style={{alignSelf:'center'}}/>
                                        <Text style={[styles.avatarText, {color: colors.tertiary}]}>Remover</Text>
                                    </View>
                                </Button>
                            </View>
                    </Modal>
                </Portal>
            </View>
        </View>
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