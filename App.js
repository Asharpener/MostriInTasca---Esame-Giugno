import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import * as NewAlert from "./components/Common/Alert.jsx";
import NetInfo from '@react-native-community/netinfo';
import CommunicationController from './CommunicationController';
import { LocationContext } from './models/LocationContext';
import { UserContext } from './models/UserContext';


export default function App() {
  const [location, setCurrentLocation] = useState(null);
  const [user, setCurrentUser] = useState({
    uid: null,
    sid: null
  });

  const [useLocation, setCanUseLocation] = useState(false);

  useEffect(() => {
    console.log('Start up');

    const startUser = async () => {
      const user = await getSID();
      setCurrentUser({
        uid: user.uid,
        sid: user.sid
      });
      console.log('sid:', user.sid);
    }

    startUser();
    getLocation();
  }, []);

  async function getLocation() {
    const perm = await locationPermission();
    if (perm) {
      setCanUseLocation(true);
      console.log('Can use location');
      Location.watchPositionAsync({
        distanceInterval: 0,
        timeInterval: 5000,
        accuracy: Location.Accuracy.Highest
      },
        (newlocation) => {
          console.log('Location:', newlocation);
          setCurrentLocation(newlocation);
        }
      );

    } else {
      setCanUseLocation(false);
      console.log('Cannot use location');
      NewAlert.createAlert("Permessi necessari", "Per utilizzare l'app è necessario concedere i permessi di localizzazione", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
    }
  }

  useEffect(() => {
    console.log('Permessi')
    if (!useLocation) {
      NewAlert.createAlert("Permessi necessari", "Per utilizzare l'app è necessario concedere i permessi di localizzazione", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
    }
    NetInfo.fetch().then(state => {
      console.log('Internet raggingibile', state.isInternetReachable);
      if (!state.isInternetReachable) {
        NewAlert.createAlert("Connessione necessaria", "Per utilizzare l'app è necessaria una connessione ad internet", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
      }
    });
  });

  return (//todo
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

async function getSID() {
  const sid = await AsyncStorage.getItem('sid');
  const uid = await AsyncStorage.getItem('uid');
  
  console.log('SID:', sid, ' UID:', uid);

  if(sid != null && uid != null) {
    return { sid: sid, uid: uid };
  } else {
    console.log('No SID');
    let data = await register(); 
    await AsyncStorage.setItem('sid', data.sid);
    await AsyncStorage.setItem('uid', data.uid);
    return { sid: sid, uid: uid };
  }
}

async function register() {
  const response = await CommunicationController.register();
  console.log('Register:', response);
  return response;
}

async function locationPermission() {
  let canUseLocation = false;
  const grantedPerm = await Location.requestForegroundPermissionsAsync();

  if (grantedPerm.status === 'granted') {
    canUseLocation = true;
  } else {
    const permResponse = await Location.requestForegroundPermissionsAsync();
    if (permResponse.status === 'granted') {
      canUseLocation = true;
    } else {
      console.log('Permesso posizione negato');
    }
  }
  return canUseLocation;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
