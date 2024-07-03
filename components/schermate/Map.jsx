import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

import Player from './Player.jsx';
import VirtualObject from './VirtualObject.jsx';
import * as MarkerElement from '../sezioni/Marker.jsx';

import * as NearListRepo from '../RepoAssist/NearListRepo.jsx';

const Stack = createNativeStackNavigator();

export default function Map({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="Map" >
            <Stack.Screen name="Map" component={ShowMap} options={{ headerShown: false }} />
            <Stack.Screen name="Player" component={Player} options={{ title: '' }} />
            <Stack.Screen name="VObj" component={VirtualObject} options={{ title: '' }} />
            
        </Stack.Navigator>
    );
}
/*<Stack.Screen name="NearList" component={NearList} options={{ title: 'Oggetti vicini' }} />
            <Stack.Screen name="VObj" component={VirtualObject} options={{ title: '' }} />*/

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
                    latitudeDelta: 0.0023,
                    longitudeDelta: 0.0023,
                });
            }
        }, [location, user])
    );

    return (
        <SafeAreaView style={{flex:1, justifyContent: 'flex-end', marginTop:40}}>
            <MapView style ={mapscreen.map} region={region} showsMyLocationButton={true}
          showsCompass={true} onRegionCHange={this.handleRegionChanged}>

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

                {vobjnearlist != [] && vobjnearlist != undefined ? vobjnearlist.map((item, index) => {
                    // calcola la distanza dalla posizione attuale location e l'oggetto item
                    let distance =  MarkerElement.getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon);
                    // se la distanza è minore di 100 metri, visualizza l'oggetto
                    if (distance > 100) {
                        return null;
                    }
                    return (
                        <MarkerElement.Virtualobj key={index} object={item} sid={user.sid} />
                    );
                }) : {}}

                {playernearlist != [] && playernearlist != undefined ? playernearlist.map((item, index) => {
                    // calcola la distanza dalla posizione attuale location e l'oggetto item
                    let distance =  MarkerElement.getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon);
                    // se la distanza è minore di 100 metri, visualizza l'oggetto
                    if (distance > 100 || item.positionshare == false) {
                        return null;
                    } 
                    return (
                        <MarkerElement.Player key={index} player={item} sid={user.sid} />
                    );
                }) : {}}
            </MapView>
            <View style={mapscreen.btnCont}>
                <TouchableOpacity style={[def.button1, mapscreen.nearobjbtn]} onPress={() => navigation.navigate('NearList')}>
                    <Text style={def.button1Text}>Oggetti vicini</Text>
                </TouchableOpacity>
            </View>
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

