import { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";
import {
  TextInput,
  Button,
  useTheme,
  Checkbox,
  Dialog,
  Portal,
} from "react-native-paper";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { api, getToken } from "../config/api";

const CreatePost = ({ navigation }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState(new Date());
  const [availableTo, setAvailableTo] = useState(new Date());

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);

  const [images, setImages] = useState([]);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const MAX_IMAGES = 4;

  const formatTimeHHMM = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
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

  const handlePost = async () => {
    if (!title || !description || !quantity || !price || !categories || !availableFrom || !availableTo) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    if (images.length === 0) {
      alert("Por favor, sube al menos una imagen.");
      return;
    }

    const token = await getToken();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("quantity", quantity.toString());
    formData.append("price", price.toString());
    formData.append("availableFrom", formatTimeHHMM(availableFrom).replace(":", ""));
    formData.append("availableTo", formatTimeHHMM(availableTo).replace(":", ""));
    formData.append("categories", selectedCategories.join(","));

    images.forEach((image, index) => {
      formData.append("files", {
        uri: image.uri,
        type: "image/jpeg",
        name: `photo_${index}.jpg`,
      });
    });

    try {
      const response = await axios.post(`${api}create/postPost`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post creado:", response.data);
      navigation.goBack();
    } catch (error) {
      console.error(
        "Error al crear post:",
        error.response?.data || error.message || error
      );
    }
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

        <Button
          mode="outlined"
          onPress={() => setCategoryDialogVisible(true)}
          style={{ marginBottom: 12 }}
        >
          Seleccionar categorías
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

        <View style={styles.timeRow}>
          <Button
            mode="outlined"
            onPress={() => setShowFromPicker(true)}
            style={styles.timeButton}
          >
            Desde: {formatTimeHHMM(availableFrom)}
          </Button>
          {showFromPicker && (
            <DateTimePicker
              mode="time"
              value={availableFrom}
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowFromPicker(Platform.OS === "ios");
                if (selectedDate) setAvailableFrom(selectedDate);
              }}
            />
          )}
        </View>

        <View style={styles.timeRow}>
          <Button
            mode="outlined"
            onPress={() => setShowToPicker(true)}
            style={styles.timeButton}
          >
            Hasta: {formatTimeHHMM(availableTo)}
          </Button>
          {showToPicker && (
            <DateTimePicker
              mode="time"
              value={availableTo}
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowToPicker(Platform.OS === "ios");
                if (selectedDate) setAvailableTo(selectedDate);
              }}
            />
          )}
        </View>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Button mode="outlined" icon="camera">
            Subir Imágenes ({images.length}/{MAX_IMAGES})
          </Button>
        </TouchableOpacity>

        <View style={styles.imagesContainer}>
          {images.map((img, index) => (
            <View key={img.uri} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.image} />
              <Button 
                mode="contained-tonal" 
                onPress={() => removeImage(index)}
                style={styles.removeButton}
                compact
              >
                Eliminar
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
        <Button 
          mode="contained" 
          onPress={handlePost} 
          style={styles.fixedButton}
        >
          Publicar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  imagePicker: {
    marginBottom: 16,
    alignItems: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 4,
  },
  removeButton: {
    width: "100%",
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
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  fixedButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  fixedButton: {
    marginBottom: 0,
  },
});

export default CreatePost;