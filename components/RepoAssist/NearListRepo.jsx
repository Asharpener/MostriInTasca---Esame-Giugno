import CommunicationController from "../../CommunicationController";
import StorageManager from "../../StorageManager";


export async function loadNearList(sid, lat, lon) {
    const response = await CommunicationController.getObjects(sid, lat, lon).catch((error) => {
        console.log(error);
    });
    //console.log(response);
    return response;
}

export async function loadCompleteNearList(sid, lat, lon) {
    const response = await CommunicationController.getObjects(sid, lat, lon).catch((error) => {
        console.log(error);
    });

    for (let i = 0; i < response.length; i++) {
        let object = response[i];
        let row = await loadVObjDetails(sid, object);
        response[i] = row;
    }
    return response;
}

export async function loadVObjDetails(sid, vobjInfo) {
    // check if the object is already in the db
    const storageManager = new StorageManager();
    let object = await storageManager.getObjectByID(vobjInfo.id)
        .catch((error) => {
            console.log("No object id found for " + vobjInfo.id + " - " + error);
        });

    if (object.length == 0) {
        // if not, get the object from the server and insert it in the db
        const response = await CommunicationController.getObject(sid, vobjInfo.id)
            .catch((error) => {
                console.log("NearListRepo - " + error);
            });

        let row = await storageManager.insertObject(response.id, response.type, response.image, response.name, response.level);

        if (row[0].error != null) {
            console.log("NearListRepo - " + row[0].error);
        } else {
            console.log("NearListRepo - Object inserted // " + row);
            return response;
        }
    } else {
        // if yes, return the object
        return object[0];
    }
}

export async function loadPlayers(sid, lat, lon) {
    const response = await CommunicationController.getUsers(sid, lat, lon).catch((error) => {
        console.log(error);
    });
    //console.log(response);
    return response;
}

export async function loadPlayerDetails(sid, playerInfo) {
    // check if the object is already in the db
    const storageManager = new StorageManager();
    let player = await storageManager.getUserByID(playerInfo.uid)
        .catch((error) => {
            console.log("No player id found for " + playerInfo.uid + " - " + error);
        });

    if (player.length == 0) {
        // if not, get the player from the server and insert it in the db
        const response = await CommunicationController.getUserById(sid, playerInfo.uid)
            .catch((error) => {
                console.log("NearListRepo - " + error);
            });

        let row = await storageManager.insertUser(response.uid, response.name, response.picture, response.profileversion)

        if (row[0].error != null) {
            console.log("NearListRepo - " + row[0].error);
        } else {
            console.log("NearListRepo - Player inserted // " + row);
            return response;
        }
    } else {
        // if yes, check the profile version for the user
        
        user = player[0];
        
        if (user.profileversion != playerInfo.profileversion) {
            // if the profile version is different from the one in the db, get the user from the server and update it in the db
            
            const response = await CommunicationController.getUserById(sid, playerInfo.uid)
            .catch((error) => {
                console.log("RankElem - " + error);
            });
            
            let row = await storageManager.updateUser(response.uid, response.name, response.picture, response.profileversion);

            if (row[0].error != null || row[0].rowsAffected == 0) {
                console.log("RankElem - " + row);
            } else {
                console.log("RankElem - User updated // " + row);
                return response;
            }
        } else {
            return user;
        }
    }
}