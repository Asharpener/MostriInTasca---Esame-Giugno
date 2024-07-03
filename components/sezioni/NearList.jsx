import { React, useContext, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { NearListRow } from './NearListRow.jsx';

import { LocationContext } from '../../models/LocationContext';

export function NearList(props) {
    const { location } = useContext(LocationContext);
    let counter = 0;

    // per ogni elemento di props.nearlist, se la distanza è minore di 100 metri, lo aggiungo a filteredList
    if (props.nearlist) {
        props.nearlist.forEach((item) => {
            if (getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon) <= 100) {
                counter++;
                console.log("Counter: " + counter);
            }
        });
    }

    // per ogni elemento di props.nearlist, se la distanza è minore di 100 metri, lo aggiungo a filteredList
    if (counter == 0) {
        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Nessun oggetto vicino trovato.</Text>
                <Text style={{ textAlign: 'center', marginTop: 10 }}>Spostati per trovare oggetti con cui interagire.</Text>
            </View>
        );
    } else {
        return (
            <FlatList data={props.nearlist}
                renderItem={({ item }) => (
                    // getDistanceInMeters(location.coords.latitude, location.coords.longitude, item.lat, item.lon) <= 100 ?
                        <NearListRow vobj={item} style={nearlist.nlRow}></NearListRow>
                )}
                keyExtractor={item => item.id} />
        );
    }
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