import { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { TextInput, Button, useTheme, Checkbox, Dialog, Portal, ActivityIndicator } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from "expo-image-picker";
import Icon from '@expo/vector-icons/Feather';
import axios from "axios";
import { api, getToken } from "../config/api";
import UniText from '../components/UniText';

export default function EditPost({ navigation, route }) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const MAX_IMAGES = 4;

    const { postID, pTitle, pDescription, pQuantity, pPrice, pAvailableFrom, pAvailableTo } = route.params;

    const formatDate = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateToHHMM = (date) => {
        const h = date.getHours().toString().padStart(2, "0");
        const m = date.getMinutes().toString().padStart(2, "0");
        return `${h}${m}`;
    };

    const parseHHMMToDate = (hhmm) => {
        const str = hhmm.toString().padStart(4, "0");
        const hours = parseInt(str.slice(0, 2), 10);
        const minutes = parseInt(str.slice(2), 10);
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    const toggleCategory = (id) => {
        setSelectedCategories((prev) =>
        prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
        );
    };
    
    const pickImage = async () => {
        if (images.length >= MAX_IMAGES) {
        alert(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
        return;
        }

        const remainingSlots = MAX_IMAGES - images.length;
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        selectionLimit: remainingSlots,
        });

        if (!result.canceled && result.assets?.length > 0) {
        const newImages = [...images, ...result.assets].slice(0, MAX_IMAGES);
        setImages(newImages);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const [title, setTitle] = useState(pTitle);
    const [description, setDescription] = useState(pDescription);
    const [quantity, setQuantity] = useState(pQuantity.toString());
    const [price, setPrice] = useState(pPrice.toString());
    const [availableFrom, setAvailableFrom] = useState(parseHHMMToDate(pAvailableFrom));
    const [availableTo, setAvailableTo] = useState(parseHHMMToDate(pAvailableTo));

    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleEdit = async () => {
        if (!title || !description || !quantity || !price) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const token = await getToken();
        const body = {
            postID: postID.toString(),
            title,
            description,
            quantity: quantity.toString(),
            price: price.toString(),
            availableFrom: formatDateToHHMM(availableFrom), // e.g. "0830"
            availableTo: formatDateToHHMM(availableTo),
        };

        try {
            const response = await axios.post(`${api}create/editPost`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });

            console.log("Post actualizado:", response.data);
            navigation.goBack();
        } catch (error) {
            console.error(
            "Error al actualizar post:",
            error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
        try {
            const token = await getToken();
            const config = {
            headers: { authorization: `Bearer ${token}` },
            };
            const { data } = await axios.get(`${api}content/getCategories`, config);
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        };

        fetchCategories();
    }, []);

    const handleDelete = async () => {
        const token = await getToken();
        try {
            const response = await axios.post(
            `${api}create/deletePost`,
            { postID: postID.toString() },
            { headers: {Authorization: `Bearer ${token}`,"Content-Type": "application/json"} });
            console.log("Post eliminado:", response.data);
            navigation.goBack();
        } catch (error) {
            console.error(
                "Error al eliminar post:",
                error.response?.data || error.message
            );
        }
        };

    const confirmDelete = () => {
        Alert.alert(
            "Eliminar publicación",
            "¿Estás seguro de que deseas eliminar esta publicación?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: handleDelete,
                },
            ]
        );
    };
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContainer,
                        { paddingBottom: Math.max(insets.bottom, 20) + 80 } // Extra space for fixed button
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                <UniText
                    label="Título"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                <UniText
                    label="Descripción"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    style={[styles.input, styles.textArea]}
                />
                <UniText
                    label="Cantidad"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    style={styles.input}
                />
                <UniText
                    label="Precio"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={styles.input}
                    left={<TextInput.Affix text="$"/>}
                />
                <Button
                    mode="elevated"
                    onPress={() => setCategoryDialogVisible(true)}
                    style={[{ marginBottom: 16 }, { backgroundColor: colors.tertiary || colors.primary }]}
                >
                    <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>Seleccionar categorías</Text>
                </Button>

                <Portal>
                    <Dialog
                        visible={categoryDialogVisible}
                        onDismiss={() => setCategoryDialogVisible(false)}
                    >
                        <Dialog.Title>Categorías</Dialog.Title>
                        <Dialog.ScrollArea style={{ maxHeight: 300 }}>
                        <ScrollView>
                            {categories.map((category) => (
                            <View key={category.categoryID} style={styles.categoryRow}>
                                <Checkbox
                                status={
                                    selectedCategories.includes(category.categoryID)
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={() => toggleCategory(category.categoryID)}
                                />
                                <Text>{category.name}</Text>
                            </View>
                            ))}
                        </ScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                        <Button onPress={() => setCategoryDialogVisible(false)}>
                            Hecho
                        </Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

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

                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                    <Button
                        mode="elevated"
                        icon={() => (
                            <Icon name="camera" size={16} color={colors.onTertiary} />
                        )} 
                        style={{ backgroundColor: colors.tertiary || colors.onTertiary }}>
                        <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>Subir Imágenes ({images.length}/{MAX_IMAGES})</Text>
                    </Button>
                </TouchableOpacity>

                <View style={styles.imagesContainer}>
                    {images.map((img, index) => (
                        <View key={img.uri} style={styles.imageWrapper}>
                        <Image source={{ uri: img.uri }} style={styles.image} />
                        <Button 
                            mode="contained-tonal" 
                            onPress={() => removeImage(index)}
                            style={[styles.removeButton, { backgroundColor: colors.error }]}
                            compact
                        >
                            <Text style={[styles.text,{color: colors.onError}]}>Eliminar</Text>
                        </Button>
                        </View>
                    ))}
                    </View>
            </ScrollView>

            {/* Fixed button at the bottom */}
            <View style={[
                styles.fixedButtonContainer,
                { 
                    backgroundColor: colors.background,
                    paddingBottom: Math.max(insets.bottom, 16),
                    borderTopColor: colors.outline
                }
            ]}>
                <Button mode="contained" onPress={handleEdit} style={[styles.button, { backgroundColor: colors.tertiary || colors.primary }]}>
                {loading ? <ActivityIndicator size={'small'} color={colors.onTertiary || colors.onPrimary} /> : <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>Guardar cambios</Text>}
            </Button>

            <Button
            mode="outlined"
            onPress={confirmDelete}
            style={[styles.button, styles.deleteButton, { borderColor: colors.error }]}
            labelStyle={{ color: colors.error }}
            >
                {loading ? <ActivityIndicator size={'small'} color={colors.onTertiary || colors.onPrimary} /> : <Text style={[styles.text, {color: colors.onTertiary || colors.onPrimary}]}>Eliminar Publicación</Text>}
            </Button>
            </View>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexGrow: 1,
    },
    input: {
        marginBottom: 16,
    },
    textArea: {
        height: 100,
    },
    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    timeButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    button: {
        marginTop: 16,
    },
    deleteButton: {
        borderColor: "transparent",
        marginTop: 8,
    },
    rowTimeContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        width: '75%',
        marginBottom: 16,
    },
});