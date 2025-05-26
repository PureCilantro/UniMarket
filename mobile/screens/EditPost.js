import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, HelperText, Portal, Dialog, useTheme, TextInput } from 'react-native-paper';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import { api, getToken } from '../config/api';
import UniText from '../components/UniText';

export default function EditPost({ navigation, route }) {
    const tittleMaxLength = 50;
    const descriptionMaxLength = 100;
    // State variables
    const { postID, pTitle, pDescription, pPrice, pQuantity, pAvailableTo, pAvailableFrom } = route.params;
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
    // Error variables
    const [titleError, setTitleError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [timeErrorDialog, setTimeErrorDialog] = useState(false);
    const [postErrorDialog, setPostErrorDialog] = useState(false);
    const [postSuccessDialog, setPostSuccessDialog] = useState(false);

    const { colors } = useTheme();

    const formatDate = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const dbDate = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', '')
    };

    const goBack = () => {
        navigation.goBack();
    };

    const handleEditPost = async () => {
        title === '' ? setTitleError(true) : setTitleError(false);
        description === '' ? setDescriptionError(true) : setDescriptionError(false);
        quantity === '' ? setQuantityError(true) : setQuantityError(false);
        price === '' ? setPriceError(true) : setPriceError(false);
        const dbFrom = dbDate(availableFrom);
        const dbTo = dbDate(availableTo);
        if (dbFrom < dbTo) {
            if (title && description && quantity && price) {
                setLoading(true);
                try {
                    const token = await getToken();
                    const config = { 
                        headers: { authorization: `Bearer ${token}` },
                        data: { 
                            title: title,
                            description: description,
                            quantity: quantity,
                            price: price,
                            availableFrom: dbFrom,
                            availableTo: dbTo,
                            postID: postID
                        }
                    };
                    const response = await axios.post(api + 'create/editPost', config.data, { headers: config.headers });
                    if (response.status === 200) {
                        setPostSuccessDialog(true);
                    } else if (response.status === 500) {
                        setPostErrorDialog(true);
                    }
                } catch (error) {
                    console.error(error);
                }
                setLoading(false);
            }
        } else setTimeErrorDialog(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View style={styles.rowContainer}>
                <Icon
                    name={'arrow-left'}
                    size={24}
                    color={colors.tertiary || colors.primary}
                    padding={10}
                    onPress={() => { navigation.goBack() }}
                />                
                <Text style={[styles.title, { color: colors.tertiary || colors.primary }]}>Editar Publicación</Text>
            </View>
            <View style={styles.container}>
                <UniText
                    label="Título"
                    value={title}
                    placeholder="Ingresa un título"
                    onChangeText={(titulo) => {
                        setTitle(titulo)
                        setTitleError(false)
                    }}
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
                <UniText
                    label="Descripción"
                    value={description}
                    placeholder="Ingresa una descripción"
                    onChangeText={(desc) => {
                        setDescription(desc)
                        setDescriptionError(false)
                    }}
                    multiline={true}
                    maxLength={descriptionMaxLength}
                />
                <View style={styles.helperRow}>
                    <HelperText type='error' padding='none' visible={descriptionError}>
                        Ingresa una descripción
                    </HelperText>
                    <HelperText type='info' padding='none' style={styles.counter}>
                        {description.length}/{descriptionMaxLength}
                    </HelperText>
                </View>
                <UniText
                    label="Cantidad"
                    value={quantity}
                    placeholder="Ingresa la cantidad disponible"
                    onChangeText={(cant) => {
                        setQuantity(cant)
                        setQuantityError(false)
                    }}
                    keyboardType="numeric"
                />
                <HelperText type='error' padding='none' visible={quantityError}>
                    Ingresa una cantidad
                </HelperText>
                <UniText
                    label="Precio"
                    value={price}
                    placeholder="Ingresa el precio"
                    onChangeText={(precio) => {
                        setPrice(precio)
                        setPriceError(false)
                    }}
                    keyboardType="numeric"
                    left={<TextInput.Affix text="$"/>}
                />
                <HelperText type='error' padding='none' visible={priceError}>
                    Ingresa un precio
                </HelperText>
                <View style={styles.rowTimeContainer}>
                    <Button 
                        onPress={() => setShowFromPicker(true)} 
                        style={[styles.timeButton,{backgroundColor:colors.tertiary || colors.primary}]}
                    >
                        <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>{formatDate(availableFrom)}</Text>
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
                        color={colors.tertiary || colors.primary}
                        padding={10}
                    />
                    <Button 
                        onPress={() => setShowToPicker(true)} 
                        style={[styles.timeButton,{backgroundColor:colors.tertiary || colors.primary}]}
                    >
                        <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>{formatDate(availableTo)}</Text>
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
                    onPress={handleEditPost}
                    disabled={loading}
                    style={[styles.button,{backgroundColor: colors.tertiary || colors.primary}]}
                    >
                    {loading ? <ActivityIndicator size={'small'} color={colors.onTertiary || colors.onPrimary} /> : <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>Editar</Text>}
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
        </View>
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
    helperRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    counter: {
        textAlign: 'right',
    },
});