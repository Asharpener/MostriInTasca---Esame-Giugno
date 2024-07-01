import React, { useState, useContext } from 'react';
import { View, Text, Image, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Alert from "../Common/Alert.jsx";

import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

import * as NearListRepo from "../RepoAssist/NearListRepo.jsx";

import CommunicationController from '../../CommunicationController.jsx';

export default function VirtualObject({ route }) {
    const { user } = useContext(UserContext);
    const [object, setObject] = useState(null);
    let item = route.params.vobj;

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let thisobject = await NearListRepo.loadVObjDetails(user.sid, item);
                setObject(thisobject);
            })();
        }, [user])
    );

    return (
        <View style={objscreen.playerContainer}>
            <View style={objscreen.topCont}>
                {object == null ? (
                    <Text>Loading...</Text>
                ) : (
                    <ObjectImage obj={object}></ObjectImage>
                )}
                <Text style={objscreen.objname}>{object == null ? "Loading..." : object.name}</Text>
                <Text style={{ textTransform: 'uppercase' }}>{object == null ? "Loading..." : object.type} - Livello {object == null ? "Loading..." : object.level}</Text>
            </View>

            <View style={objscreen.objCont}>
                <Text style={objscreen.objContTitle}>cosa fa questo oggetto?</Text>
                {object == null ? (
                    <Text></Text>
                ) : (
                    <ObjectAction obj={object} item={item}></ObjectAction>
                )}
            </View>
        </View>
    );
}

function ObjectAction(props) {
    const navigation = useNavigation();
    const { location, setLocation } = useContext(LocationContext);
    const { user } = useContext(UserContext);

    let obj = props.obj;
    let text = "";
    let btn = "";
    let event = null;



}

async function activation(sid, id) {
    let response = await CommunicationController.activateObject(sid, id)
        .catch((error) => {
            console.log("VObj Activation - " + error);
            return false;
        });
    return response;
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

export const objscreen = StyleSheet.create({
    playerContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    objContTitle:{
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    objdesc:{
        textAlign: 'center',
        marginBottom: 15
    },
    topCont: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#38b6ff'
    },
    objActiveBtn: {
        textTransform: 'uppercase',
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
    objname: {
        fontSize: 30,
        textTransform: 'uppercase'
    },
    vobjElem: {
        flex: 1,
        alignItems: 'center',
    },
    profilePic: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        aspectRatio: 1,
    },
    objNoPic: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        aspectRatio: 1,
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