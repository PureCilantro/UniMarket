import React from 'react';
import { Card, Text, Button, Switch, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function UniUserCard({
    item,
    onEdit,
    onToggleActive,
    switchToggle,
    onPress
}) {
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
                <Text>{item.description}</Text>
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
            <Card.Actions>
                <Button
                    mode='elevated'
                    style={{ backgroundColor: colors.tertiary || colors.primary }}
                    onPress={onEdit}
                >
                    <Text style={{ color: colors.onTertiary || colors.onPrimary }}>Editar</Text>
                </Button>
                <Text style={{ color: colors.outline }}>  Activo</Text>
                <Switch
                    value={item.active === 1}
                    onValueChange={onToggleActive}
                    color={colors.tertiary || colors.primary}
                    disabled={switchToggle}
                />
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        height: 370,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    image: {
        width: '70%',
        height: '50%',
        marginTop: 10,
        alignSelf: 'center',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    }
});