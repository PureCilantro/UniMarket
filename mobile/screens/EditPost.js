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

  // Convierte "1130" → objeto Date hoy con horas/minutos
  const parseHHMMToDate = (hhmm) => {
    const str = hhmm.toString().padStart(4, "0");
    const hours = parseInt(str.slice(0, 2), 10);
    const minutes = parseInt(str.slice(2), 10);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

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
