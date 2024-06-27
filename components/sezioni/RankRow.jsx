import React, { useState, useContext } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';

// Context
import { UserContext } from '../../models/UserContext';

// Services
import CommunicationController from "../../CommunicationController";
import StorageManager from "../../StorageManager";



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