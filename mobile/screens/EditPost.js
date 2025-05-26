<<<<<<< HEAD
import { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Button, HelperText, Portal, Dialog, useTheme, TextInput } from 'react-native-paper';
import axios from 'axios';
import Icon from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';

import { api, getToken } from '../config/api';
import UniText from '../components/UniText';
=======
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { TextInput, Button, useTheme } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { api, getToken } from "../config/api";
>>>>>>> 524c9a71bed8f22b86c68246340e53877c2c4758

export default function EditPost({ navigation, route }) {
  const { colors } = useTheme();
  const {
    postID,
    pTitle,
    pDescription,
    pQuantity,
    pPrice,
    pAvailableFrom,
    pAvailableTo,
  } = route.params;

<<<<<<< HEAD
    const { colors } = useTheme();
=======
  // Convierte "1130" → objeto Date hoy con horas/minutos
  const parseHHMMToDate = (hhmm) => {
    const str = hhmm.toString().padStart(4, "0");
    const hours = parseInt(str.slice(0, 2), 10);
    const minutes = parseInt(str.slice(2), 10);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };
>>>>>>> 524c9a71bed8f22b86c68246340e53877c2c4758

  const formatDateToHHMM = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}${m}`;
  };

  // Estados iniciales desde route.params
  const [title, setTitle] = useState(pTitle);
  const [description, setDescription] = useState(pDescription);
  const [quantity, setQuantity] = useState(pQuantity.toString());
  const [price, setPrice] = useState(pPrice.toString());
  const [availableFrom, setAvailableFrom] = useState(
    parseHHMMToDate(pAvailableFrom)
  );
  const [availableTo, setAvailableTo] = useState(parseHHMMToDate(pAvailableTo));

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

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

<<<<<<< HEAD
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
=======
  const handleDelete = async () => {
    const token = await getToken();
    try {
      const response = await axios.post(
        `${api}create/deletePost`,
        { postID: postID.toString() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
>>>>>>> 524c9a71bed8f22b86c68246340e53877c2c4758
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <TextInput
        label="Cantidad"
        value={quantity}
        onChangeText={setQuantity}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Precio"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Hora disponible desde */}
      <View style={styles.timeRow}>
        <Button
          mode="outlined"
          onPress={() => setShowFromPicker(true)}
          style={styles.timeButton}
        >
          Desde:{" "}
          {`${availableFrom
            .getHours()
            .toString()
            .padStart(2, "0")}:${availableFrom
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}
        </Button>
        {showFromPicker && (
          <DateTimePicker
            mode="time"
            value={availableFrom}
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowFromPicker(Platform.OS === "ios");
              if (selectedDate) {
                setAvailableFrom(selectedDate);
              }
            }}
          />
        )}
      </View>

      {/* Hora disponible hasta */}
      <View style={styles.timeRow}>
        <Button
          mode="outlined"
          onPress={() => setShowToPicker(true)}
          style={styles.timeButton}
        >
          Hasta:{" "}
          {`${availableTo
            .getHours()
            .toString()
            .padStart(2, "0")}:${availableTo
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}
        </Button>
        {showToPicker && (
          <DateTimePicker
            mode="time"
            value={availableTo}
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowToPicker(Platform.OS === "ios");
              if (selectedDate) {
                setAvailableTo(selectedDate);
              }
            }}
          />
        )}
      </View>

      <Button mode="contained" onPress={handleEdit} style={styles.button}>
        Guardar cambios
      </Button>

      <Button
        mode="outlined"
        onPress={confirmDelete}
        style={[styles.button, styles.deleteButton]}
        labelStyle={{ color: colors.error }}
      >
        Eliminar publicación
      </Button>
    </ScrollView>
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
});
