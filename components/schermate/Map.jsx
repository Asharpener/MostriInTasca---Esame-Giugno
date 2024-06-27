import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

import Player from './Player.jsx';

const Stack = createNativeStackNavigator();

export default function Map({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="Map" >

            <Stack.Screen name="Player" component={Player} options={{ title: '' }} />
        </Stack.Navigator>
    );
}

/*
<Stack.Screen name="Map" component={ShowMap} options={{ headerShown: false }} />
            <Stack.Screen name="NearList" component={NearListScreen} options={{ title: 'Oggetti vicini' }} />
            <Stack.Screen name="VObj" component={VirtualObjectScreen} options={{ title: '' }} />
            */