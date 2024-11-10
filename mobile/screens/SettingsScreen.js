import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Card, Divider } from 'react-native-paper';
import { ScreenWrapper} from './ScreenWrapper';
import Icon from '@expo/vector-icons/Feather';
import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';

export default function SettingsScreen({ navigation }) {
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];
    //Funciones de edición de datos
    const showAuth = () => {
        //TODO
    };
    const editAuth = () => {
        //TODO
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Configuración</Text>
                <Text style={[styles.subtitle, { color: activeColors.tertiary }]}>Usuario</Text>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Text style={{color: activeColors.tertiary, fontSize:11}}>Nombre</Text>
                            <View style={styles.innerRow}>
                                
                            </View>
                        </View>
                    </Card.Content>
                </Card>
                <Card style={{backgroundColor: activeColors.surfaceVariant, marginVertical: 3}}>
                    <Card.Content>
                        <View style={[styles.row, {color: activeColors.tertiaryContainer}]}>
                            <Text style={{color: activeColors.tertiary, fontSize:11}}>Correo institucional</Text>
                            <View style={styles.innerRow}>
                                
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
        textAlignVertical: 'top',
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
});