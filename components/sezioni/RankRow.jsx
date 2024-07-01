import React, { useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

// Context
import { UserContext } from '../../models/UserContext';

// Services
import CommunicationController from "../../CommunicationController";
import StorageManager from "../../StorageManager";

export function RankRow(props) {
    const navigation = useNavigation();
    const { user } = useContext(UserContext);
    const [position, setpos] = useState(props.index + 1);
    const [player, setplayer] = useState(props.player + 1);
    const rankPlayerInfo = props.player

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                let thisplayer = await loadPlayerDetails(user.sid, rankPlayerInfo);
                setplayer(thisplayer);
            })();
        }, [user]
        )
    )


    return (
        <TouchableOpacity onPress={() => navigation.navigate('Player', { player: rankPlayerInfo })}>
            <View style={rank.rankElemCont}>
                <View style={rank.rankElemPositionCont}>
                    <Text style={rank.position}>{position}°</Text>
                </View> 
                { <View style={rank.rankElemImgCont}>
                    {player.picture == null || player.picture == "" ? (
                        <Image source={require('../../assets/images/default_user_propic.png')} style={rank.playerPic} />
                    ) : (
                        <Image source={{ uri: 'data:image/jpeg;base64,' + player.picture }} style={rank.playerPic} />
                    )}
                </View> }
                
                <View style={rank.rankElemUsernameCont}>
                    {player.name == null ?
                        <Text style={rank.username}>Loading...</Text> 
                        :
                        <Text style={rank.username}>{player.name}</Text>}
                </View>
                <View style={rank.rankElemExpCont}>
                    <Text style={rank.expText}>{rankPlayerInfo.experience}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

}
async function loadPlayerDetails(sid, rankPlayerInfo) {
    const storageManager = new StorageManager();
    let user = await storageManager.getUserByID(rankPlayerInfo.uid)
        .catch((error) => {
            console.log("Nessun uid trovato per " + rankPlayerInfo.uid + " - " + error)
        });

    if (user.length == 0) { //se utente non nel db
        const response = await CommunicationController.getUserById(sid, rankPlayerInfo.uid)
            .catch((error) => {
                console.log(error)
                printAlert();
                return false;
            });

        let row = await storageManager.insertUser(response.uid, response.name, response.picture, response.profileversion);

        if (row[0].error != null) {
            console.log(row[0].error);
        } else {
            console.log("utente inserito " + row)
            return response;
        }
    } else { //se c'é controlla profile version
        user = user[0];

        if (user.profileversion != rankPlayerInfo.profileversion) {
            const response = await CommunicationController.getUserById(sid, rankPlayerInfo.uid)
                .catch((error) => {
                    console.log(error)
                    printAlert();
                    return false;
                });

            let row = await storageManager.updateUser(response.uid, response.name, response.picture, response.profileversion);

            if (row[0].error != null) {
                console.log(row[0].error);
            } else {
                console.log("utente aggiornato " + row)
                return response;
            }
        } else {
            return user;
        }
    }
}


function printAlert() {
    NewAlert.createAlert("Errore", "Impossibile caricare le informazioni richieste. Verifica la connessione o riprova più tardi.", [{ text: "OK" }]);
}

const rank = StyleSheet.create({
    rankRow: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#f488f0'
    },
    rankElemCont: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    rankElemPositionCont: {
        flex: 1,
        alignItems: 'center',
    },
    rankElemImgCont: {
        flex: 3,
        alignItems: 'center'
    },
    rankElemUsernameCont: {
        flex: 4,
    },
    rankElemExpCont: {
        flex: 2,
        alignItems: 'center',
    },
    playerPic: {
        height: 100,
        width: 100,
        borderRadius: 50
    },
    expText: {
        fontSize: 20
    },
    username: {
        fontSize: 20
    },
    position: {
        fontSize: 18,
        textAlign: 'center',
        marginStart: 10,
        fontWeight: 'bold'
    }
});