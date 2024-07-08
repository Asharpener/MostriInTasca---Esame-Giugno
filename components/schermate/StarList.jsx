import React, { useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import * as NewAlert from '../Common/Alert.jsx';

// Context
import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

// Components
import  { StarFlat  } from "../sezioni/StarFlat.jsx";

// Services
import * as NearListRepo from "../RepoAssist/NearListRepo.jsx";

export default function StarList() {

    const { navigation } = useNavigation();
    const { location } = useContext(LocationContext);
    const { user } = useContext(UserContext);
    const [nearlist, setNL] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (location != null) {
                (async () => {
                    setLoading(true);
                    let row = await NearListRepo.loadStarList().catch((error) => {
                        console.log("StarLIstScreen- Error: " + error);
                        NewAlert.createAlert("Errore", "Impossibile caricare le stelle. Verifica la connessione o riprova più tardi.", [{ text: "OK", onPress: () => { navigation.navigate('Map') } }]);
                    });

                    setNL(row);
                    setLoading(false);
                })();
            }
        }, [user])
    );

    return (
        <View style={{ flex: 1, flexDirection: 'columns' }}>
            {isLoading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
                :
                <View style={{ flex: 1 }}>
                    <Text style={rankscreen.title}>Lista Stelle</Text>
                    <StarFlat nearlist={nearlist}></StarFlat>
                </View>
            }
        </View>
    );

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