import React from 'react';
import { Alert } from 'react-native';

export function createAlert(title, message, actions, cancelable) {
    Alert.alert(
        title,
        message,
        // per ogni elemento in actions, crea un pulsante
        actions.map((action) => {
            return {
                text: action.text,
                onPress: action.onPress,
                style: action.style
            }
        })
    );
}