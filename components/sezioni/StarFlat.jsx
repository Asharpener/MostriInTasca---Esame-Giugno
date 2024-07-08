import { React, useContext, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { NearListRow } from './NearListRow.jsx';

import { LocationContext } from '../../models/LocationContext';

export function StarFlat(props) {
    const { location } = useContext(LocationContext);
    let counter = 0;

    // per ogni elemento di props.nearlist, se la distanza è minore di 100 metri, lo aggiungo a filteredList
    if (Object.keys(props.nearlist).length === 0) { //qqui come prendere lngth
        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{textAlign: 'center', marginTop: 10, fontSize: 20, fontWeight: 'bold'}}>Nessun oggetto vicino trovato.</Text>
                <Text style={{textAlign: 'center', marginTop: 10 }}>Spostati per trovare oggetti con cui interagire.</Text>
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