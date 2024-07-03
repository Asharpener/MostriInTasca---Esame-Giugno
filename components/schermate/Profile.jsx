import React, { useState, useEffect, useContext } from 'react';
import { Modal, TextInput, View, Text, Button, Image, TouchableOpacity, PermissionsAndroid, ToastAndroid, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

import * as NewAlert from '../Common/Alert.jsx';

// Context
import { UserContext } from '../../models/UserContext';

// Repos
import * as VObj from "../RepoAssist/VObjectRepo";

// Services
import CommunicationController from "../../CommunicationController";

export default function Profile() {
    const { user } = useContext(UserContext);
    const [userData, setUserData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [image, setImage] = useState(null);
    let positionBtnText = "";
    let error = null;
    const [isLoading, setLoading] = useState(false);

    if (userData != null && userData.positionshare == false) {
        positionBtnText = "Attiva posizione";
    } else {
        positionBtnText = "Disattiva posizione";
    }

    useFocusEffect(
        React.useCallback(() => {
            if (user != null) {
                (async () => {
                    setLoading(true);
                    let thisuser = await loadUserDetails(user);
                    setUserData(thisuser);
                    setLoading(false);
                }
                )();
            }
        }, [user])
    );

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            updateImage(user, result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
                updateImage(user, result.assets[0].uri);
            }
        } catch (error) {
            console.log('Errore durante lo scatto della foto', error);
        }
    };

    return (
        <SafeAreaView style={profilescreen.profileContainer}>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#38b6ff" />
                </View>
                :
                <View style={profilescreen.profileContainer}>
                    <View style={profilescreen.topCont}>
                        <Image source={
                            (userData == null || userData.picture == null || userData.picture == "") && (image == null)
                                ? require("../../assets/images/default_user_propic.png")
                                : (image == null ? { uri: 'data:image/jpeg;base64,' + userData.picture } : { uri: image })} style={profilescreen.profilePic} />

                        <Text style={profilescreen.username}>{userData == null ? "Loading..." : userData.name}</Text>
                        <PositionShare userdata={userData}></PositionShare>

                        <TouchableOpacity style={[def.button2, profilescreen.possharebtn]} onPress={() => {
                            (async () => {
                                let result = await updatePositionShare(user, !userData.positionshare);
                                if (result) {
                                    setUserData({ ...userData, positionshare: !userData.positionshare });

                                    if (userData.positionshare == false) {
                                        ToastAndroid.show("Stai condividendo la tua posizione", ToastAndroid.SHORT);
                                        positionBtnText = "Disattiva posizione";
                                    } else {
                                        ToastAndroid.show("Non stai più condividendo la tua posizione", ToastAndroid.SHORT);
                                        positionBtnText = "Attiva posizione";
                                    }
                                }
                            })();
                        }}>
                            <Text style={def.button2Text}>{positionBtnText}</Text>
                        </TouchableOpacity>
                        <View style={profilescreen.editImgLine}>
                            <TouchableOpacity style={[def.button2, profilescreen.imgEditBtn, profilescreen.editRowElem]} onPress={() => {
                                NewAlert.createAlert("Modifica foto profilo", "Scegli come cambiare la tua immagine.", [
                                    {
                                        text: "Annulla", onPress: () => { }
                                    },
                                    {
                                        text: "Galleria", onPress: () => {
                                            pickImage();
                                        }
                                    },
                                    {
                                        text: "Scatta foto", onPress: () => {
                                            takePhoto();
                                        }
                                    }
                                ]);

                            }}>
                                <Text style={def.button2Text}>Modifica foto</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[def.button2, profilescreen.imgEditBtn, profilescreen.editRowElem]} onPress={() => {
                                setModalVisible(true);
                            }}>
                                <Text style={def.button2Text}>Modifica username</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={profilescreen.statCont}>
                        <View style={profilescreen.statContElem}>
                            <Text style={profilescreen.statContElemNumber}>{userData == null ? "N.A" : userData.experience}</Text>
                            <Text style={profilescreen.statContElemText}>Esperienza</Text>
                        </View>
                        <View style={profilescreen.statContElem}>
                            <Text style={profilescreen.statContElemNumber}>{userData == null ? "N.A" : userData.life}</Text>
                            <Text style={profilescreen.statContElemText}>Vita</Text>
                        </View>
                    </View>

                    <View style={profilescreen.objCont}>
                        <Text style={profilescreen.objContTitle}>I tuoi artefatti</Text>
                        {/* 3 elementi in linea orizzontale */}
                        <View style={profilescreen.objContRow}>

                            <View style={profilescreen.objElemBox}>
                                <Text>Arma</Text>
                                <Artifact sid={user.sid} id={userData == null ? null : userData.weapon}></Artifact>
                            </View>

                            {/* edit the background image */}
                            <View style={profilescreen.objElemBox}>
                                <Text>Armatura</Text>
                                <Artifact sid={user.sid} id={userData == null ? null : userData.armor}></Artifact>
                            </View>

                            <View style={profilescreen.objElemBox}>
                                <Text>Amuleto</Text>
                                <Artifact sid={user.sid} id={userData == null ? null : userData.amulet}></Artifact>
                            </View>

                        </View>
                    </View>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ marginTop: 22, marginEnd: 15, marginStart: 15 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>Modifica Username</Text>
                                <Text style={{ marginBottom: 10, fontSize: 15 }}>Inserisci il tuo nuovo nome utente. Non superare i 15 caratteri.</Text>

                                <TextInput
                                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                                    onChangeText={text => {
                                        if (text.length > 15) {
                                            error = true;
                                            console.log("Il nome utente non può superare i 15 caratteri");
                                            //error = "Il nome utente non può superare i 15 caratteri";
                                        } else {
                                            setInputText(text);
                                            error = null;
                                        }
                                    }}
                                    value={inputText}
                                />
                                <Text style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', marginBottom: 10, marginTop: 10 }}>{error != null ? "Il nome utente non può superare i 15 caratteri." : ""}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={[def.button1, { flex: 1, marginEnd: 5 }]} onPress={() => {
                                        setModalVisible(!modalVisible);
                                    }}>
                                        <Text style={def.button1Text}>Annulla</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[def.button1, { flex: 1, marginStart: 5 }]} onPress={() => {
                                        (async () => {
                                            let result = await updateUsername(user, inputText);
                                            if (result) {
                                                setUserData({ ...userData, name: inputText });
                                                setModalVisible(!modalVisible);
                                                NewAlert.createAlert("Modifica completata", "Il tuo nome utente è stato modificato con successo.", [{
                                                    text: "OK", onPress: () => { }
                                                }]);
                                            }
                                        })();
                                    }}>
                                        <Text style={def.button1Text}>Conferma</Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            }
        </SafeAreaView>
    );

}


function Artifact(props) {
    const [obj, setObj] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                if (props.id != null) {
                    let thisobj = await VObj.loadVObjDetails(props.sid, props.id);
                    setObj(thisobj);
                }
            })();
        }, [props.id])
    );
    return (
        <View style={profilescreen.objElem}>
            <ObjectImage obj={obj}></ObjectImage>
            <Text>{obj == null ? "lv. N.A" : "lv. " + obj.level}</Text>
            <Text>{obj == null ? "N.A" : obj.name}</Text>
        </View>
    );
}

async function updateUsername(user, username) {
    let result = await CommunicationController.patchUser(user.sid, user.uid, username, null, null)
        .catch((error) => {
            console.log("ProfileScreen > updateUsername - " + error);
            return false;
        });
    return true;
}

async function updatePositionShare(user, posshare) {
    let result = await CommunicationController.patchUser(user.sid, user.uid, null, null, posshare)
        .catch((error) => {
            console.log("ProfileScreen > updatePosShare - " + error);
            return false;
        });
    return true;
}

async function updateImage(user, image) {
    // convert the image to base64
    let base64image = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
    // print the weight of the image in Kb

    console.log("ProfileScreen > updateImage - " + base64image.length / 1024 + " Kb");

    // if the weight is greater than 100Kb, compress the image
    if (base64image.length / 1024 > 100) {
        const manipResult = await ImageManipulator.manipulateAsync(
            image,
            [{ resize: { width: 500 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        base64image = await FileSystem.readAsStringAsync(manipResult.uri, { encoding: 'base64' });
        console.log("ProfileScreen > updateImage - " + base64image.length / 1024 + " Kb");
    }

    let result = await CommunicationController.patchUser(user.sid, user.uid, null, base64image, null)
        .catch((error) => {
            console.log("ProfileScreen > updateImage - " + error);
            return false;
        });
    return true;
}

function PositionShare(props) {
    if (props.userdata != null) {
        return (
            <View>
                <Text>{props.userdata.positionshare == false ? "Posizione non condivisa" : "Posizione condivisa"}</Text>
            </View>
        );
    }
}

async function loadUserDetails(user) {
    const response = await CommunicationController.getUserById(user.sid, user.uid)
        .catch((error) => {
            console.log("ProfileScreen 1- " + error);
            NewAlert.createAlert("Errore", "Impossibile caricare il profilo utente. Verifica la connessione o riprova più tardi.", [{
                text: "OK"
            }]);
        });

    return response;
}

function ObjectImage(props) {
    let obj = props.obj;
    if (obj == null) {
        return (
            <View>
                <Image source={require("../../assets/adaptive-icon.png")} style={profilescreen.objElemImg} />
            </View>
        );
    } else {
        if (obj.image == null || obj.image == "") {
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
                    pic = require("../../assets/images/default_user_propic.png");
                    break;
            }
            return (
                <View>
                    {/* show the image using the pic variable */}
                    <Image source={pic} style={profilescreen.objElemImg} />
                </View>
            );
        } else {
            return (
                <View>
                    <Image source={{ uri: 'data:image/jpeg;base64,' + obj.image }} style={profilescreen.objElemImg} />
                </View>
            );
        }
    }
}


export const profilescreen = StyleSheet.create({
    profileContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    topCont: {
        flex: 6,
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
        backgroundColor: '#fff'
    },
    objContTitle: {
        fontSize: 22,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        fontWeight: 'bold'
    },
    objContRow: {
        flex: 1,
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    },
    objElemBox: {
        width: '30%',
        aspectRatio: 0.67,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#76cdff',
        overflow: 'hidden',
        borderRadius: 10,
        padding: 10
    },
    objElem: {
        alignItems: 'center',
    },
    objElemImg: {
        height: '70%',
        aspectRatio: 1,
    },
    username: {
        fontSize: 35
    },
    vobjElem: {
        flex: 1,
        alignItems: 'center'
    },
    profilePic: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        borderRadius: 75
    },
    possharebtn: {
        marginTop: 10,
    },
    imgEditBtn: {
        marginEnd: 5,
        marginStart: 5,
    },
    editImgLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
        marginTop: 10
    },
    editRowElem: {
        flex: 1,
        alignItems: 'center',
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