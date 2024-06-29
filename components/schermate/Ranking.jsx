import React, { useState, useContext } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

import { RankList }  from '../sezioni/Rank';
import * as NewAlert from '../Common/Alert.jsx';


// Context
import { UserContext } from '../../models/UserContext';

// Services
import CommunicationController from "../../CommunicationController";
import Player from './Player.jsx';

console.log('MOSTRORankList:', RankList); // Debugging statement
console.log('MOSTROPlayer:', Player); // Debugging statement

const Stack = createNativeStackNavigator();

export default function Ranking() {
    return(
        <Stack.Navigator initialRouteName='Rank'>
            <Stack.Screen name="Rank" component={ShowRank} options={{ headerShown: false }} />
            <Stack.Screen name="Player" component={Player} options={{ title: 'Giocatore' }} />
        </Stack.Navigator>
    );
}


function ShowRank() {
    const { user } = useContext(UserContext);
    const [rank, setRank] = useState();
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                setLoading(true);
                let row = await loadRanking(user.sid);
                setRank(row);
                setLoading(false);
            })();
        }, [user.sid])
    );

    console.log("showrank till here")
    return (
        <SafeAreaView style={{ flex: 1 }}>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <Text style={rankscreen.title}>Classifica</Text>
                    <RankList rank={rank}></RankList>
                </View>}
        </SafeAreaView>
    );
}


async function loadRanking(sid) {
    const response = await CommunicationController.getRanking(sid).catch((error) => {
        console.log(error);
        NewAlert.createAlert("Errore", "Impossibile caricare la classifica. Assicurati di essere connesso a internet", [{
            text: "OK", onPress: () => {
                navigation.navigate('Map')
            }
        }]);
    });
    return response;
}

const rankscreen = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10
    }
  });