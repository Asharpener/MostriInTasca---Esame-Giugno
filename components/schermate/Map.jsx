import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

import Player from './Player.jsx';
//import MarkerElement from '../sezioni/Marker.jsx';

import * as NearListRepo from '../RepoAssist/NearListRepo.jsx';

const Stack = createNativeStackNavigator();

export default function Map({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="Map" >
            <Stack.Screen name="Map" component={ShowMap} options={{ headerShown: false }} />
            <Stack.Screen name="Player" component={Player} options={{ title: '' }} />
        </Stack.Navigator>
    );
}


/*
    
            <Stack.Screen name="NearList" component={NearListScreen} options={{ title: 'Oggetti vicini' }} />
            <Stack.Screen name="VObj" component={VirtualObjectScreen} options={{ title: '' }} />
 */


function ShowMap({navigation}) {
    const { location } = useContext(LocationContext);
    const { user } = useContext(UserContext);
    const [region, setRegion] = useState({
        latitude: 49.5,
        longitude: 0,
        latitudeDelta: 1,
        longitudeDelta: 1,
    });

    const [vobjnearlist, setNearList] = useState([]);
    const [playernearlist, setPlayerNearList] = useState([]);
    
    useFocusEffect(
        React.useCallback(() => {
            if (location != null && user.sid != null) {

                //Async oggetti
                (async () => {
                    let data = await  NearListRepo.loadNearList(user.sid, location.coords.latitude, location.coords.longitude);
                    setNearList(data);
                })();
                //Async player
                (async () => {
                    let data = await  NearListRepo.loadPlayers(user.sid, location.coords.latitude, location.coords.longitude);
                    setPlayerNearList(data);
                })();
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        }, [location, user])
    );

    return (
        <SafeAreaView style={{flex:1, justifyContent: 'flex-end'}}>
            <MapView style ={mapscreen.map} region={region} showMyLocationButton onRegionCHange={this.handleRegionChanged}>

                {location != null && 
                <View>
                    <Circle center={location.coords} 
                    radius={100}
                    strokeWidth={1}
                    strokeColor={'#1a66ff'}
                    fillColor={'rgba(230,238,255,0.5)'}
                    />
                    <Marker coordinate={location.coords} />
            
                </View>
}
            </MapView>
        </SafeAreaView>
    );

} 



export const mapscreen = StyleSheet.create({
    nearobjbtn: {
        width: '50%',
        zIndex: 9999,
    },
    btnCont: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    map:  {
        zIndex: -1,
        ...StyleSheet.absoluteFillObject,
    
    }
});


export const def = StyleSheet.create({
    button1: {
        backgroundColor: '#38b6ff',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    button1Text: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center'
    },
    button2: {
        backgroundColor: '#fff',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center'
    },
    button2Text: {
        color: '#000',
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

