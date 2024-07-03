import React, { useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Context
import { LocationContext } from '../../models/LocationContext.jsx';
import { UserContext } from '../../models/UserContext.jsx';

// Services
import * as NearListRepo from "../RepoAssist/NearListRepo.jsx";

export function NearListRow(props) {
    let item = props.vobj;
    const navigation = useNavigation();
    const [object, setObject] = useState(null);
    const { user } = useContext(UserContext);
    const { location } = useContext(LocationContext);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                console.log("NearListElement - " + item.id);
                let thisobj = await NearListRepo.loadVObjDetails(user.sid, item)
                console.log("NearListElement - " + thisobj.name);
                setObject(thisobj);
            })();
        }, [user])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate('VObj', { vobj: item })}>
            <View style={nearlist.nlElemCont}>
                <View style={nearlist.nlElemImgCont}>
                    {object == null ? (
                        <Image source={require("../../assets/adaptive-icon.png")} style={nearlist.objpic} />
                    ) : (
                        <ObjectImage obj={object}></ObjectImage>
                    )}
                </View>
                <View style={nearlist.nlElemInfoCont}>
                    {object == null ? (
                        <Text style={nearlist.objname}>Loading...</Text>
                    ) : (
                        <ObjectInfo obj={object}></ObjectInfo>
                    )}
                </View>
                
            </View>
        </TouchableOpacity>
    );

}

export function getDistanceInMeters(lat1, lon1, lat2, lon2) {
    const ri = 6371e3; // radius of Earth in meters
    const fi1 = lat1 * Math.PI / 180; // fi, lambda in radians
    const fi2 = lat2 * Math.PI / 180;
    const defi = (lat2 - lat1) * Math.PI / 180;
    const dela = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(defi / 2) * Math.sin(defi / 2) +
        Math.cos(fi1) * Math.cos(fi2) *
        Math.sin(dela / 2) * Math.sin(dela / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = ri * c; // in meters
    return distance;
}

function ObjectInfo(props) {
    let obj = props.obj;
    if (obj.name == null) {
        obj.name = "Loading...";
    }
    if (obj.type == null) {
        obj.type = "Loading...";
    }
    if (obj.level == null) {
        obj.level = "Loading...";
    }

    let objtype = "";
    switch (obj.type) {
        case "armor":
            objtype = "Armatura";
            break;
        case "weapon":
            objtype = "Arma";
            break;
        case "amulet":
            objtype = "Amuleto";
            break;
        case "monster":
            objtype = "Mostro";
            break;
        case "candy":
            objtype = "Caramella";
            break;

        default:
            objtype = "Oggetto";
            break;
    }
    return (
        <View>
            <Text style={nearlist.objname}>{obj.name}</Text>
            <Text style={nearlist.objtype}>{objtype}</Text>
            <Text>Livello {obj.level}</Text>
        </View>
    );
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
                pic = require("../../assets/adaptive-icon.png");
                break;
        }
        return (
            <View>
                <Image source={pic} style={nearlist.objpic} />
            </View>
        );
    } else {
        return (
            <View>
                <Image source={{ uri: 'data:image/jpeg;base64,' + obj.image }} style={nearlist.objpic} />
            </View>
        );
    }
}


export const nearlist = StyleSheet.create({
    nlRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f488f0'
    },
    nlElemCont: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    nlElemPositionCont: {
        flex: 1,
        alignItems: 'center',
    },
    nlElemImgCont: {
        flex: 3,
        alignItems: 'center'
    },
    nlElemInfoCont: {
        flex: 4,
    },
    nlElemLocationCont: {
        flex: 2,
        alignItems: 'center',
    },
    objpic: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    expText: {
        fontSize: 20
    },
    objname: {
        fontSize: 22,
        textTransform: 'capitalize'
    },
    objtype: {
        fontSize: 15,
        textTransform: 'uppercase'
    },
    position: {
        fontSize: 18,
        textAlign: 'center',
        marginStart: 10,
        fontWeight: 'bold'
    }
});