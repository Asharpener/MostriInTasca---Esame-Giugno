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
    const [userData, setUserData] = useState(null);
    const [playableDistance, setPlayableDistance] = useState(100);
    let item = route.params.vobj;

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let thisobject = await NearListRepo.loadVObjDetails(user.sid, item);
                setObject(thisobject);
            })();
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
    switch (obj.type) {
        case "monster":
            text = "Combatti contro questo mostro per ottenere punti esperienza. Potresti perdere fino a " + obj.level * 2 + " punti vita";
            btn = "Combatti!";
            event = () => {
                (async () => {
                    let action = await activation(user.sid, obj.id);
                    console.log(action.died);
                    if (action == false) {
                        alertMex = "Errore";
                        alertText = "Si è verificato un errore. Verifica la tua connessione";
                    } else {
                        if (action.died) {
                            alertMex = "Hai perso!";
                            alertText = "Hai perso tutti i tuoi punti esperienza e gli artefatti";
                        } else {
                            alertMex = "Hai vinto!";
                            alertText = "Ora hai " + action.experience + " punti esperienza e " + action.life + " punti vita";
                        }
                    }
                    Alert.createAlert(alertMex, alertText, [{
                        text: "OK", onPress: () => {
                            navigation.navigate('Map');
                        }
                    }]);
                })();
            };
            break;
        case "candy":
            text = "Mangia questa caramella per acquisire punti vita.";
            btn = "Mangia";
            event = () => {
                (async () => {
                    let action = await activation(user.sid, obj.id);
                    console.log(action.died);
                    if (action == false) {
                        alertMex = "Errore";
                        alertText = "Si è verificato un errore. Verifica la tua connessione";
                    } else {
                        alertMex = "Caramella mangiata!";
                        alertText = "Ora hai " + action.life + " punti vita e " + action.experience + " punti esperienza";
                    }
                    Alert.createAlert(alertMex, alertText, [{
                        text: "OK", onPress: () => {
                            navigation.navigate('Map');
                        }
                    }]);

                })();
            };
            break;
        case "armor":
            text = "Equipaggiati con un'armatura. Con questa armatura aumenterai il numero massimo di punti vita a " + (100 + obj.level) + ".";
            btn = "Equipaggia";
            event = () => {
                (async () => {
                    let action = await activation(user.sid, obj.id);
                    console.log(action.died);
                    if (action == false) {
                        alertMex = "Errore";
                        alertText = "Si è verificato un errore. Verifica la tua connessione";
                    } else {
                        alertMex = "Armatura equipaggiata!";
                        alertText = "Ora hai " + action.life + " punti vita!" + action.experience + " punti esperienza";
                    }
                    Alert.createAlert(alertMex, alertText, [{
                        text: "OK", onPress: () => {
                            navigation.navigate('Map');
                        }
                    }]);

                })();
            };
            break;
        case "weapon":
            text = "Equipaggiati con un'arma.Con quest'arma potrai subire il " + obj.level + "% in meno di danni.";
            btn = "Equipaggia";
            event = () => {
                (async () => {
                    let action = await activation(user.sid, obj.id);
                    console.log(action.died);
                    if (action == false) {
                        alertMex = "Errore";
                        alertText = "Si è verificato un errore. Verifica la tua connessione";
                    } else {
                        alertMex = "Arma equipaggiata!";
                        alertText = "Ora hai " + action.life + " punti vita!" + action.experience + " punti esperienza";
                    }
                    Alert.createAlert(alertMex, alertText, [{
                        text: "OK", onPress: () => {
                            navigation.navigate('Map');
                        }
                    }]);

                })();
            };
            break;
        case "amulet":
            text = "Equipaggiati con un amuleto. Con questa amuleto aumenterai la distanza di visione sulla mappa fino a " + (100 + obj.level) + " metri.";
            btn = "Equipaggia";
            event = () => {
                (async () => {
                    let action = await activation(user.sid, obj.id);
                    console.log(action.died);
                    if (action == false) {
                        alertMex = "Errore";
                        alertText = "Si è verificato un errore. Verifica la tua connessione";
                    } else {
                        alertMex = "Amuleto equipaggiato!";
                        alertText = "Ora hai " + action.life + " punti vita!" + action.experience + " punti esperienza";
                    }
                    Alert.createAlert(alertMex, alertText, [{
                        text: "OK", onPress: () => {
                            navigation.navigate('Map');
                        }
                    }]);

                })();
            };
            break;
        default:
            text = "Attiva questo oggetto per sfruttare le sue potenzialità."
            btn = "Attiva";
            event = () => {
                activation(user.sid, obj.id);
                Alert.createAlert("Oggetto attivato", "Hai attivato correttamente questo oggetto.", [{
                    text: "Ok", onPress: () => {
                        navigation.navigate('Map');
                    }
                }], false);
            };
            break;


    }

    //se la distanza è maggiore di 100 metri, disabilita il bottone
    if (getDistanceInMeters(location.coords.latitude, location.coords.longitude, props.item.lat, props.item.lon) > props.playableDistance) {
        return (
            <View>
                <Text style={objscreen.objdesc}>{text}</Text>
                <Text>Questo oggetto è troppo lontano. Avvicinati per attivaarlo</Text>
            </View>
        );
    } else {
        return (
            <View>
                <Text style={objscreen.objdesc}>{text}</Text>
                <TouchableOpacity style={def.button1} onPress={event}>
                    <Text style={def.button1Text}>{btn}</Text>
                </TouchableOpacity>
            </View>
        );
    }
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
    objContTitle: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    objdesc: {
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