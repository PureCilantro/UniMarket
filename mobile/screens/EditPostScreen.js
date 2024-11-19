import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, Button, HelperText, Portal, Dialog, FAB } from 'react-native-paper';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { colors } from '../theme/colors';
import { ThemeContext } from '../contexts/ThemeContext';
import { ScreenWrapper} from './ScreenWrapper';
import { api } from '../config/api';


export default function EditPostScreen({ navigation, route }) {
    //Variables de estado
    const {postID, pTitle, pDescription, pPrice, pQuantity, pAvailableTo, pAvailableFrom} = route.params;
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(pTitle);
    const [description, setDescription] = useState(pDescription);
    const [quantity, setQuantity] = useState(pQuantity.toString());
    const [price, setPrice] = useState(pPrice.toString());
    const [availableFrom, setAvailableFrom] = useState(() => {
        const from = pAvailableFrom.toString();
        const hours = parseInt(from.substring(0, 2), 10);
        const minutes = parseInt(from.substring(2, 4), 10);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    });
    const [availableTo, setAvailableTo] = useState(() => {
        const to = pAvailableTo.toString();
        const hours = parseInt(to.substring(0, 2), 10);
        const minutes = parseInt(to.substring(2, 4), 10);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    });
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const tittleMaxLength = 50;
    const descriptionMaxLength = 100;
    //Variables de error
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [timeErrorDialog, setTimeErrorDialog] = useState(false);
    const [postErrorDialog, setPostErrorDialog] = useState(false);
    const [postSuccessDialog, setPostSuccessDialog] = useState(false);
    //Contexto de tema
    const {theme, toggleTheme} = useContext(ThemeContext);
    let activeColors = colors[theme.mode];

    const formatDate = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const dbDate = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', '')
    };

    const goBack = () => {
        navigation.goBack();
    };

    const handleCreatePost = async () => {
        title === '' ? setTitleError(true) : setTitleError(false);
        description === '' ? setDescriptionError(true) : setDescriptionError(false);
        quantity === '' ? setQuantityError(true) : setQuantityError(false);
        price === '' ? setPriceError(true) : setPriceError(false);
        const dbFrom = dbDate(availableFrom);
        const dbTo = dbDate(availableTo);
        if (dbFrom < dbTo) {
            if (title && description && quantity && price) {
                setLoading(true);
                const userID = await AsyncStorage.getItem('userID');
                try {
                    const token = await axios.post(api + 'login/getToken', { userID: userID });
                    const config = { 
                        headers: { authorization: `Bearer ${token.data.message}`},
                        data: { 
                            title: title,
                            description: description,
                            quantity: quantity,
                            price: price,
                            availableFrom: dbFrom,
                            availableTo: dbTo,
                            userID: userID,
                            postID: postID
                        }
                    };
                    const response = await axios.post(api + 'content/editPost', config.data, { headers: config.headers });
                    if (response.status === 200) {
                        setPostSuccessDialog(true);
                    } else if (response.status === 500) {
                        setPostErrorDialog(true);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        } else setTimeErrorDialog(true);
    };

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
                <Text style={[styles.title, { color: activeColors.tertiary }]}>Editar Publicación</Text>
            </View>
            <View style={styles.container}>
                <TextInput
                    label="Título"
                    value={title}
                    placeholder="Ingresa un título"
                    placeholderTextColor={activeColors.outline}
                    onChangeText={(titulo) => {
                        setTitle(titulo)
                        setTitleError(false)
                    }}
                    style={styles.input}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    underlineColor={activeColors.onBackground}
                    maxLength={tittleMaxLength}
                />
                <View style={styles.helperRow}>
                    <HelperText type='error' padding='none' visible={titleError}>
                        Ingresa un título
                    </HelperText>
                    <HelperText type='info' padding='none' style={styles.counter}>
                        {title.length}/{tittleMaxLength}
                    </HelperText>
                </View>
                <TextInput
                    label="Descripción"
                    value={description}
                    placeholder="Ingresa una descripción"
                    placeholderTextColor={activeColors.outline}
                    onChangeText={(desc) => {
                        setDescription(desc)
                        setDescriptionError(false)
                    }}
                    style={styles.input}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    multiline={true}
                    maxLength={descriptionMaxLength}
                    underlineColor={activeColors.onBackground}
                />
                <View style={styles.helperRow}>
                    <HelperText type='error' padding='none' visible={descriptionError}>
                        Ingresa una descripción
                    </HelperText>
                    <HelperText type='info' padding='none' style={styles.counter}>
                        {description.length}/{descriptionMaxLength}
                    </HelperText>
                </View>
                <TextInput
                    label="Cantidad"
                    value={quantity}
                    placeholder="Ingresa la cantidad disponible"
                    placeholderTextColor={activeColors.outline}
                    onChangeText={(cant) => {
                        setQuantity(cant)
                        setQuantityError(false)
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    underlineColor={activeColors.onBackground}
                />
                <HelperText type='error' padding='none' visible={quantityError}>
                    Ingresa una cantidad
                </HelperText>
                <TextInput
                    label="Precio"
                    value={price}
                    placeholder="Ingresa el precio"
                    placeholderTextColor={activeColors.outline}
                    onChangeText={(precio) => {
                        setPrice(precio)
                        setPriceError(false)
                    }}
                    keyboardType="numeric"
                    style={styles.input}
                    activeUnderlineColor={activeColors.tertiary}
                    textColor={activeColors.onBackground}
                    underlineColor={activeColors.onBackground}
                    left={<TextInput.Affix text="$"/>}
                />
                <HelperText type='error' padding='none' visible={priceError}>
                    Ingresa un precio
                </HelperText>
                <View style={styles.rowTimeContainer}>
                    <Button 
                        onPress={() => setShowFromPicker(true)} 
                        style={[styles.timeButton,{backgroundColor:activeColors.tertiary}]}
                    >
                        <Text style={[styles.text, {color: activeColors.onTertiary}]}>{formatDate(availableFrom)}</Text>
                    </Button>
                    {showFromPicker && (
                        <DateTimePicker
                            value={availableFrom}
                            mode="time"
                            display="default"
                            onChange={(event, time) => {
                                setShowFromPicker(false);
                                if (time) setAvailableFrom(time);
                            }}
                        />
                    )}
                    <Icon
                        name={'arrow-right'}
                        size={24}
                        color={activeColors.tertiary}
                        padding={10}
                    />
                    <Button 
                        onPress={() => setShowToPicker(true)} 
                        style={[styles.timeButton,{backgroundColor:activeColors.tertiary}]}
                    >
                        <Text style={[styles.text, {color: activeColors.onTertiary}]}>{formatDate(availableTo)}</Text>
                    </Button>
                    {showToPicker && (
                        <DateTimePicker
                            value={availableTo}
                            mode="time"
                            display="default"
                            onChange={(event, time) => {
                                setShowToPicker(false);
                                if (time) setAvailableTo(time);
                            }}
                        />
                    )}
                </View>
                <Button 
                    mode="elevated"
                    onPress={handleCreatePost}
                    disabled={loading}
                    style={[styles.button,{backgroundColor: activeColors.tertiary}]}
                    >
                    {loading ? <ActivityIndicator size={'small'} color={activeColors.onTertiary} /> : <Text style={[styles.text, {color: activeColors.onTertiary}]}>Editar</Text>}
                </Button>
                <Portal>
                    <Dialog visible={timeErrorDialog} onDismiss={() => setTimeErrorDialog(false)}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text>La hora de inicio debe ser menor a la hora de fin</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setTimeErrorDialog(false)}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={postErrorDialog} onDismiss={() => setPostErrorDialog(false)}>
                        <Dialog.Title>Error</Dialog.Title>
                        <Dialog.Content>
                            <Text>No se pudo crear la publicación</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setPostErrorDialog(false)}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                    <Dialog visible={postSuccessDialog} onDismiss={() => setPostSuccessDialog(false)}>
                        <Dialog.Title>Éxito</Dialog.Title>
                        <Dialog.Content>
                            <Text>La publicación se editó correctamente</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={goBack}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </ScreenWrapper>
    );
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingHorizontal: 16,
        marginTop: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        marginTop: 16,
        textAlign: 'center',
        right: '25%',
        position: 'absolute',
    },
    button: {
        alignSelf: 'center',
        marginTop: 10,
        width: '60%',
    },
    rowTimeContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '70%',
    },
    rowContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    timeButton: {
        marginVertical: 10,
        width: '40%',
    },
    input: {
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        fontSize: 16,
    },
    helperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    counter: {
        textAlign: 'right',
    },
});