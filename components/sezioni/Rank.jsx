import { Text, View, FlatList } from 'react-native';
import { RankElem } from './RankElem';
import { StyleSheet } from 'react-native';


export function RankList(props) {

    return (
        <FlatList data={props.rank}
            renderItem={({ item, index }) => <RankElem player={item} index={index} style={rank.nlRow}></RankElem>}
            keyExtractor={item => item.uid} />
    );
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