import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Switch, Card } from 'react-native-paper';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';

export default function SettingsScreen({ navigation }) {
    const [loading, setLoading] = useState(false);
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Funciones de acceso a datos
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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
            setName(response.data.message.name + ' ' + response.data.message.lastname);
            setEmail(response.data.message.email);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    //Funciones de edición de datos
    const showAuth = () => {
        //TODO
    };
    const editAuth = () => {
        //TODO
    };

    const renderLoading = () => {
        return (
            <View>
                <ActivityIndicator color={activeColors.tertiary} />
            </View>
        );
    }

    useEffect(() => {
        getInfo();
    }, []);

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
                <Text style={[styles.subtitle, { color: activeColors.tertiary }]}>Usuario</Text>
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
                <Text style={[styles.subtitle, { color: activeColors.tertiary }]}>Aplicación</Text>
                <Card style={{backgroundColor: activeColors.surfaceVariant}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Icon
                                name={theme.mode === 'light' ? 'sun' : 'moon'}
                                size={22}
                                color={activeColors.tertiary}
                                padding={10}
                            />
                            <Text style={[styles.cardText,{color: activeColors.tertiary}]}>Tema</Text>
                            <Switch value={theme.mode === 'dark'} onValueChange={toggleTheme}/>
                        </View>
                    </Card.Content>
                </Card>
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
        marginLeft: -200,
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
});