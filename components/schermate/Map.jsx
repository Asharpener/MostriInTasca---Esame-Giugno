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
import NearObjectList from './NearObjectList.jsx';
import * as VObj from "../RepoAssist/VObjectRepo";
import CommunicationController from "../../CommunicationController"
import * as NearListRepo from '../RepoAssist/NearListRepo.jsx';

const Stack = createNativeStackNavigator();

export default function Map({ navigation }) {
    return (
        <Stack.Navigator initialRouteName="Map" >
            <Stack.Screen name="Map" component={ShowMap} options={{ headerShown: false }} />
            <Stack.Screen name="Player" component={Player} options={{ title: '' }} />
            <Stack.Screen name="VObj" component={VirtualObject} options={{ title: '' }} />
            <Stack.Screen name="NearObjectList" component={NearObjectList} options={{ title: 'Oggetti vicini' }} />
        </Stack.Navigator>
    );
}

function ShowMap({ navigation }) {
    const { location } = useContext(LocationContext);
    const [userData, setUserData] = useState(null);
    const { user } = useContext(UserContext);
    const [playableDistance, setPlayableDistance] = useState(100);
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
                    let data = await NearListRepo.loadNearList(user.sid, location.coords.latitude, location.coords.longitude);
                    setNearList(data);
                })();
                //Async player
                (async () => {
                    let data = await NearListRepo.loadPlayers(user.sid, location.coords.latitude, location.coords.longitude);
                    setPlayerNearList(data);
                })();
                //Async user
                if (user != null) {
                    (async () => {
                        let thisuser = await loadUserDetails(user);
                        setUserData(thisuser);

                        console.log("ciao" + user.sid, userData?.amulet)
                        if (userData && userData.amulet != null) {
                            let thisobj = await VObj.loadVObjDetails(user.sid, userData.amulet);
                            setPlayableDistance(100+thisobj?.level)
                        } else {
                            setPlayableDistance(100)
                        }
                    }
                    )();

                } else {
                    setPlayableDistance(100)
                }
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
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', marginTop: 40 }}>
            <MapView style={mapscreen.map} region={region} showsMyLocationButton={true}
                showsCompass={true} onRegionCHange={this.handleRegionChanged}>

                {location != null &&
                    <View>
                        <Circle center={location.coords}
                            radius={playableDistance}
                            strokeWidth={1}
                            strokeColor={'#1a66ff'}
                            fillColor={'rgba(230,238,255,0.5)'}

                        />
                        <Marker coordinate={location.coords} zIndex={999} />

                    </View>
                }

                {vobjnearlist != [] && vobjnearlist != undefined ? vobjnearlist.map((item, index) => {
                    // calcola la distanza dalla posizione attuale location e l'oggetto item
                    let distance = MarkerElement.getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon);
                    // se la distanza è minore di 100 metri, visualizza l'oggetto
                    if (distance > playableDistance) {
                        return null;
                    }
                    return (
                        <MarkerElement.Virtualobj key={index} object={item} sid={user.sid} zIndex={999} />
                    );
                }) : {}}

                {playernearlist != [] && playernearlist != undefined ? playernearlist.map((item, index) => {
                    // calcola la distanza dalla posizione attuale location e l'oggetto item
                    let distance = MarkerElement.getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon);
                    // se la distanza è minore di 100 metri, visualizza l'oggetto
                    if (distance > playableDistance || item.positionshare == false) {
                        return null;
                    }
                    return (
                        <MarkerElement.Player key={index} player={item} sid={user.sid} zIndex={150} />
                    );
                }) : {}}
            </MapView>
            <View style={mapscreen.btnCont}>
                <TouchableOpacity style={[def.button1, mapscreen.nearobjbtn]} onPress={() => navigation.navigate('NearObjectList')}>
                    <Text style={def.button1Text}>Oggetti vicini</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );

}

async function loadUserDetails(user) {
    const response = await CommunicationController.getUserById(user.sid, user.uid)
        .catch((error) => {
            console.log("MapScreen - " + error);
            NewAlert.createAlert("Errore", "Impossibile caricare il profilo utente. Verifica la connessione o riprova più tardi.", [{
                text: "OK"
            }]);
        });

    return response;
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
    map: {
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

