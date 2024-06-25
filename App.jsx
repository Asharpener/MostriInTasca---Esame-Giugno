import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import * as NewAlert from "./components/Common/Alert.jsx";
import NetInfo from '@react-native-community/netinfo';
import CommunicationController from './CommunicationController.js';
import { LocationContext } from './models/LocationContext.jsx';
import { UserContext } from './models/UserContext.jsx';

import MapScreen from './components/schermate/Map.jsx';
import RankingScreen from './components/schermate/Ranking.jsx';
import ProfileScreen from './components/schermate/Profile.jsx';

const Tab = createBottomTabNavigator();

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
        timeInterval: 10000,
        accuracy: Location.Accuracy.Highest
      },
        (newlocation) => {
          console.log('Location:', newlocation);
          setCurrentLocation(newlocation);
        }
      );

    } else {
      setCanUseLocation(false);
      console.log('Cannot use location1');
      NewAlert.createAlert("Permessi necessari", "Per utilizzare l'app è necessario concedere i permessi di localizzazione", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
    }
  }

  useEffect(() => {
    console.log('Permessi')
    /*if (!useLocation) {
      NewAlert.createAlert("Permessi necessari", "Per utilizzare l'app è necessario concedere i permessi di localizzazione", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
    }*/
    NetInfo.fetch().then(state => {
      console.log('Internet raggingibile', state.isInternetReachable);
      if (!state.isInternetReachable) {
        NewAlert.createAlert("Connessione necessaria", "Per utilizzare l'app è necessaria una connessione ad internet", [{ text: "Chiudi", onPress: () => { BackHandler.exitApp(); } }]);
      }
    });
  });

  return (
    <LocationContext.Provider value={{ location, setCurrentLocation }}>
      <UserContext.Provider value={{ user, setCurrentUser }}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Tab.Navigator initialRouteName="Mappa" style={{ backgroundColor: '#88ff00', flex: 1 }}
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;

                  switch (route.name) {
                    case 'Classifica':
                      iconName = focused ? 'trophy' : 'trophy-outline';
                      break;
                    case 'Mappa':
                      iconName = focused ? 'map' : 'map-outline';
                      break;
                    case 'Profilo':
                      iconName = focused ? 'person' : 'person-outline';
                      break;
                  }
                  // You can return any component that you like here!
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#8E8DBE',
                inactiveTintColor: 'gray',
                tabBarStyle: {
                  paddingBottom: 10,
                  paddingTop: 5,
                  height: 60,
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: 'bold'
                },
              })}
            >
              <Tab.Screen name="Classifica" initialParams={{ user: user }} component={RankingScreen} options={{ title: 'Classifica', headerShown: false }} />
              <Tab.Screen name="Mappa" initialParams={{ user: user }} component={MapScreen} options={{ headerShown: false }} />
              <Tab.Screen name="Profilo" initialParams={{ user: user }} component={ProfileScreen} options={{ headerShown: false }} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </UserContext.Provider>
    </LocationContext.Provider>
  );
}

async function getSID() {
  const sid = await AsyncStorage.getItem('sid');
  const uid = await AsyncStorage.getItem('uid');

  console.log('SID:', sid, ' UID:', uid);

  if (sid != null && uid != null) {
    return { sid: sid, uid: uid };
  } else {
    console.log('No SID');
    let data = await register();
    await AsyncStorage.setItem('sid', data.sid);
    await AsyncStorage.setItem('uid', String(data.uid));
    return { sid: data.sid, uid: data.uid };
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
