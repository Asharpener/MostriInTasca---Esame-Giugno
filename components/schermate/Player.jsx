import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as NewAlert from '../Common/Alert.jsx';

import { UserContext } from '../../models/UserContext';

import CommunicationController from "../../CommunicationController";

export default function Player({ route }) {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [playerData, setPlayerData] = useState(null);
    const playerKnown = route.params.player;

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let thisplayer = await loadUserDetails(user, playerKnown.uid, navigation);
                setPlayerData(thisplayer);
            })();
        }, [user])
    );
    return (
        <View style={playerscreen.playerContainer}>
            <View style={playerscreen.topCont}>
                {/*  playerData è null > immagine di default, altrimenti mostra immagine in playerData.picture */}
                <Image source={playerData == null || playerData.picture == null || playerData.picture == "" ? require('../../assets/images/default_user_propic.png') : { uri: 'data:image/jpeg;base64,' + playerData.picture }} style={playerscreen.profilePic} />
                {/* se playerData è null mostra "loading" */}
                <Text style={playerscreen.username}>{playerData == null ? "Loading..." : playerData.name}</Text>
            </View>

            <View style={playerscreen.statCont}>
                <View style={playerscreen.statContElem}>
                    <Text style={playerscreen.statContElemNumber}>{playerKnown == null ? "N.A" : playerKnown.experience}</Text>
                    <Text style={playerscreen.statContElemText}>esperienza</Text>
                </View>
                <View style={playerscreen.statContElem}>
                    <Text style={playerscreen.statContElemNumber}>{playerKnown == null ? "N.A" : playerKnown.life}</Text>
                    <Text style={playerscreen.statContElemText}>vita</Text>
                </View>
            </View>

            <View style={playerscreen.objCont}>
                <PlayerMap playerKnown={playerKnown} style={playerscreen.mapCont}></PlayerMap>
            </View>

        </View>
    );
}


async function loadUserDetails(user, id, navigation) {
    const response = await CommunicationController.getUserById(user.sid, id)
        .catch((error) => {
            console.log("Player - loaduserdetails " + error)
            NewAlert.createAlert("Errore", "Impossibile caricare le informazioni per questo utente. Verifica la connessione o riprova più tardi.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            return false;
        });

    return response;
}

function PlayerMap(props) {
    data = props.playerKnown;

    if (data == null) {
        return (
            <View>
                <Text>Caricamento...</Text>
            </View>
        )
    }

    if (data.lon && data.lat) {
        let region = {
            latitude: data.lat,
            longitude: data.lon,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002,
        }
        return (
            <View>
                <MapView style={[playerscreen.map]} region={region}>
                    <Marker
                        key={data.uid}
                        coordinate={{ latitude: data.lat, longitude: data.lon }}
                    />
                </MapView>
            </View>
        )
    }
}

export const playerscreen = StyleSheet.create({
    playerContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    topCont: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#38b6ff'
    },
    statCont: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
    },
    statContElem: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    statContElemText: {
        fontSize: 18,
        textTransform: 'uppercase'
    },
    statContElemNumber: {
        fontSize: 45
    },
    objCont: {
        flex: 7,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    username: {
        fontSize: 30
    },
    vobjElem: {
        flex: 1,
        alignItems: 'center',
    },
    profilePic: {
        width: '50%',
        height: '50%',
        resizeMode: 'cover',
        aspectRatio: 1,
        borderRadius: 50
    },
    map: {
        zIndex: -1,
        height: '90%',
        aspectRatio: 1,
    },
    mapCont: {
        width: '100%',
    },
    maptext: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    }


});