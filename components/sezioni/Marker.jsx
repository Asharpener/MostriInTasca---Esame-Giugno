import { View, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import * as NearListRepo from '../RepoAssist/NearListRepo.jsx';

export function Virtualobj(props) {
    const navigation = useNavigation();
    const [object, setObject] = useState(props.object);
    const nlObjectInfo = props.object;
    const sid = props.sid;
    const distance = props.distance;

    useFocusEffect(
        React.useCallback(() =>{
            (async () => {console.log("Marker - " + nlObjectInfo.id);
                let thisobj = await NearListRepo.loadVObjDetails(sid, nlObjectInfo);
                setObject(thisobj)
                if (thisobj.type == "star") {
                    console.log("Star con id: " + thisobj.id);
                }
            })();
        }, [sid])
    );
    return (
        <Marker
            coordinate={{ latitude: nlObjectInfo.lat, longitude: nlObjectInfo.lon }}
            // Se l'immagine è null o vuota, metti l'icona di default altrimenti metti l'immagine. assegna uno stile all'immagine
            onPress={() => navigation.navigate('VObj', { vobj: nlObjectInfo })}
        >
            <ObjectImage obj={object}></ObjectImage>
        </Marker >
    )
}

export function Player(props) {
    const navigation = useNavigation();
    const [player, setPlayer] = useState(props.player);
    const nlPlayerInfo = props.player;
    const sid = props.sid;

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                console.log("MarkerElement - " + nlPlayerInfo.id);
                let thisplayer = await NearListRepo.loadPlayerDetails(sid, nlPlayerInfo)
                setPlayer(thisplayer);
            })();
        }, [sid])
    );

    return (
        <Marker
            coordinate={{ latitude: nlPlayerInfo.lat, longitude: nlPlayerInfo.lon }}
            title={nlPlayerInfo.name}
            onPress={() => navigation.navigate('Player', { player: nlPlayerInfo })}
        >
            <View style={{ width: 44, height: 44 }}>
                <Image
                    source={player.picture == null || player.picture == "" ? require('../../assets/images/default_user_propic.png') : { uri: 'data:image/jpeg;base64,' + player.picture }}
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                    }} // Set the size you want here
                />
            </View>
        </Marker >
    );
}


export function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const ri = 6371e3;
    const fi1 = lat1 * Math.PI / 180;
    const fi2 = lat2 * Math.PI / 180;
    const defi = (lat2 - lat1) * Math.PI / 180;
    const dela = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(defi / 2) * Math.sin(defi / 2) +
        Math.cos(fi1) * Math.cos(fi2) *
        Math.sin(dela / 2) * Math.sin(dela / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = ri * c;
    return distance;
}

function ObjectImage(props) {
    let obj = props.obj;
    if (obj == null || obj.image == null || obj.image == "") {
        switch (obj.type) {
            case "armor":
                pic = require("../../assets/images/default_armor.png");
                break;
            case "weapon":
                pic = require("../../assets/images/default_weapon.png");
                break;
            case "amulet":
                pic = require("../../assets/images/default_amulet.png");
                break;
            case "monster":
                pic = require("../../assets/images/default_monster.png");
                break;
            case "candy":
                pic = require("../../assets/images/default_candy.png");
                break;
            case "star":
                pic = require("../../assets/images/default_star.png");
                break;

            default:
                pic = require("../../assets/images/default_player.png");
                break;
        }
        return (
            <View style={{ width: 44, height: 44 }}>
                {/* show the image using the pic variable */}
                <Image source={pic} style={[{ width: '100%', height: '100%', resizeMode: 'contain' }]} />
            </View>
        );
    } else {
        return (
            <View style={{ width: 44, height: 44 }}>
                <Image source={{ uri: 'data:image/jpeg;base64,' + obj.image }} style={[{ width: '100%', height: '100%', resizeMode: 'contain' }]} />
            </View>
        );
    }
}
