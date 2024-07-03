import React, { useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import * as NewAlert from '../Common/Alert.jsx';

// Context
import { LocationContext } from '../../models/LocationContext';
import { UserContext } from '../../models/UserContext';

// Components
import { NearList } from "../sezioni/NearList";

// Services
import * as NearListRepo from "../RepoAssist/NearListRepo.jsx";

export default function NearObjectList() {

    const { navigation } = useNavigation();
    const { location } = useContext(LocationContext);
    const { user } = useContext(UserContext);
    const [nearlist, setNL] = useState();
    const [isLoading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            if (location != null) {
                (async () => {
                    setLoading(true);
                    let row = await NearListRepo.loadNearList(user.sid, location.coords.latitude, location.coords.longitude).catch((error) => {
                        console.log("NearListScreen - Error: " + error);
                        NewAlert.createAlert("Errore", "Impossibile caricare il gli oggetti vicini. Verifica la connessione o riprova più tardi.", [{ text: "OK", onPress: () => { navigation.navigate('Map') } }]);
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
                <NearList nearlist={nearlist}></NearList>}
        </View>
    );

}