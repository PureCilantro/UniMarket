import React from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function UniCard({ item, onPress }) {
    const { colors } = useTheme();

    const formatTime = (obj) => {
        let time = obj.toString();
        if (time.length === 3) time = '0' + time;
        const hour = parseInt(time.substring(0, 2));
        const minute = time.substring(2);
        const period = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${period}`;
    };

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Title title={item.title} />
            <Card.Content>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={{ color: colors.outline }}>Desde: </Text>
                        <Text>{formatTime(item.availableFrom)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ color: colors.outline }}>Precio: </Text>
                        <Text>{`$${item.price.toLocaleString()}`}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.row}>
                        <Text style={{ color: colors.outline }}>Hasta: </Text>
                        <Text>{formatTime(item.availableTo)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ color: colors.outline }}>Cantidad: </Text>
                        <Text>{item.quantity}</Text>
                    </View>
                </View>
            </Card.Content>
            <Card.Cover source={{ uri: item.images[0] }} style={styles.image} />
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        height: 400
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        width: '100%',
        height: '75%',
        marginTop: 10,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    }
});