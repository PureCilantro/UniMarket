import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Text, useTheme, Card, Button, Chip } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function PostDetail({ navigation, route }) {
    // Variables de estado
    const { postID, title, description, price, quantity, images, available } = route.params;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    console.log(route.params);
    
    // Usar el tema de react-native-paper y safe area insets
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    // Función para renderizar las imágenes con scroll horizontal
    const renderImageCarousel = () => {
        if (!images || images.length === 0) {
            return (
                <View style={[styles.noImageContainer, { backgroundColor: colors.surfaceVariant }]}>
                    <Icon name="image" size={60} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }}>No hay imágenes disponibles</Text>
                </View>
            );
        }

        return (
            <View style={styles.imageContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const index = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentImageIndex(index);
                    }}
                >
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ))}
                </ScrollView>
                {images.length > 1 && (
                    <View style={styles.imageIndicator}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        backgroundColor: index === currentImageIndex 
                                            ? colors.primary 
                                            : colors.outline
                                    }
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header con botón de regreso */}
            <View style={[styles.header, { borderBottomColor: colors.outline }]}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon
                        name={'arrow-left'}
                        size={24}
                        color={colors.tertiary || colors.primary}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.tertiary || colors.primary }]}>
                    Detalles del Producto
                </Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Carrusel de imágenes */}
                {renderImageCarousel()}

                {/* Contenido principal */}
                <View style={styles.contentContainer}>
                    {/* Título y estado de disponibilidad */}
                    <View style={styles.titleContainer}>
                        <Text style={[styles.title, { color: colors.onBackground }]}>
                            {title}
                        </Text>
                        <Chip 
                            icon={available ? "check-circle" : "alert-circle"}
                            style={{ 
                                backgroundColor: available ? colors.primary : colors.error,
                                marginTop: 8
                            }}
                            textStyle={{ color: available ? colors.onPrimary : colors.onError }}
                        >
                            {available ? 'Disponible' : 'No Disponible'}
                        </Chip>
                    </View>

                    {/* Información del precio y cantidad */}
                    <Card style={[styles.infoCard, { backgroundColor: colors.surface }]}>
                        <Card.Content>
                            <View style={styles.priceQuantityContainer}>
                                <View style={styles.priceContainer}>
                                    <Icon name="dollar-sign" size={20} color={colors.primary} />
                                    <Text style={[styles.price, { color: colors.primary }]}>
                                        {price}
                                    </Text>
                                </View>
                                <View style={styles.quantityContainer}>
                                    <Icon name="package" size={20} color={colors.onSurface} />
                                    <Text style={[styles.quantity, { color: colors.onSurface }]}>
                                        Stock: {quantity}
                                    </Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Descripción */}
                    <Card style={[styles.descriptionCard, { backgroundColor: colors.surface }]}>
                        <Card.Content>
                            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                                Descripción
                            </Text>
                            <Text style={[styles.description, { color: colors.onSurface }]}>
                                {description || 'No hay descripción disponible para este producto.'}
                            </Text>
                        </Card.Content>
                    </Card>

                    {/* Información adicional */}
                    <Card style={[styles.additionalInfoCard, { backgroundColor: colors.surface }]}>
                        <Card.Content>
                            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
                                Información Adicional
                            </Text>
                            <View style={styles.infoRow}>
                                
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.onSurfaceVariant }]}>
                                    Estado:
                                </Text>
                                <Text style={[styles.infoValue, { color: available ? colors.primary : colors.error }]}>
                                    {available ? 'En Stock' : 'Agotado'}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>

            {/* Botones de acción fijos en la parte inferior */}
            <View style={[
                styles.actionButtonsContainer, 
                { 
                    backgroundColor: colors.surface, 
                    borderTopColor: colors.outline,
                    paddingBottom: Math.max(insets.bottom, 16)
                }
            ]}>
                <Button
                    mode="outlined"
                    onPress={() => {
                        // Lógica para contactar vendedor
                        console.log('Contactar vendedor');
                    }}
                    style={[styles.actionButton, { borderColor: colors.primary }]}
                    labelStyle={{ color: colors.primary }}
                    icon="message-circle"
                >
                    Contactar
                </Button>
                <Button
                    mode="contained"
                    onPress={() => {
                        // Lógica para comprar/reservar
                        console.log('Comprar producto');
                    }}
                    style={[styles.actionButton, { backgroundColor: available ? colors.primary : colors.surfaceVariant }]}
                    labelStyle={{ color: available ? colors.onPrimary : colors.onSurfaceVariant }}
                    disabled={!available}
                    icon={available ? "shopping-cart" : "alert-circle"}
                >
                    {available ? 'Comprar' : 'No Disponible'}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    scrollViewContent: {
        paddingBottom: 20, // Extra padding to prevent content from being hidden behind buttons
    },
    imageContainer: {
        height: 300,
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
    },
    noImageContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageIndicator: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    contentContainer: {
        padding: 16,
    },
    titleContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
    },
    infoCard: {
        marginBottom: 16,
        elevation: 2,
    },
    priceQuantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 16,
        marginLeft: 8,
    },
    descriptionCard: {
        marginBottom: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    additionalInfoCard: {
        marginBottom: 16,
        elevation: 2,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        gap: 12,
    },
    actionButton: {
        flex: 1,
    },
});