import CommunicationController from "../../services/CommunicationController";
import StorageManager from "../../services/StorageManager";

export async function loadVObjDetails(sid, id) {
    // check if the object is already in the db
    const storageManager = new StorageManager();
    let object = await storageManager.getObjectByID(id)
        .catch((error) => {
            console.log("No object id found for " + id + " - " + error);
        });

    if (object.length == 0) {
        // if not, get the object from the server
        const response = await CommunicationController.getObject(sid, id)
            .catch((error) => {
                console.log("NearListRepo - " + error);
            });
        return response;
    } else {
        // if yes, return the object
        return object[0];
    }
}