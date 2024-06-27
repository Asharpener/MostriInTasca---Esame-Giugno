export default class CommunicationController {
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/mostri/";

    static async genericRequest(endpoint, verb, queryParams, bodyParams) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
        console.log("sending " + verb + " request to: " + url);
        let fatchData = {
            method: verb,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (verb != 'GET') {
            fatchData.body = JSON.stringify(bodyParams);
        }
        let httpResponse = await fetch(url, fatchData);

        const status = httpResponse.status;
        if (status == 200) {
            let deserializedObject = await httpResponse.json();
            return deserializedObject;
        } else {
            //console.log(httpResponse);
            const message = await httpResponse.text();
            let error = new Error("Error message from the server. HTTP status: " + status + " " + message);
            throw error;
        }
    }

    static async register() {
        const endPoint = "users";
        const verb = 'POST';
        const queryParams = {};
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getUsers(sid, lat, lon) {
        const endPoint = "users/";
        const verb = 'GET';
        const queryParams = { sid: sid, lat: lat, lon: lon };
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }
    
    static async getUserById(id, sid) {
        const endPoint = "users/"+id;
        const verb = 'GET';
        const queryParams = { sid: sid};
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async patchUser(id, sid, name, picture, positionshare) {
        const endPoint = "users/"+id;
        const verb = 'PATCH';
        const queryParams = {};
        const bodyParams = {sid: sid, name: name, picture: picture, positionshare: positionshare};  //check se sono uguali (se hai voglia o tempo)
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getRanking(sid) {
        const endPoint = "ranking/";
        const verb = 'GET';
        const queryParams = { sid: sid };
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async getObjectById(id, sid) {
        const endPoint = "objects/"+id;
        const verb = 'GET';
        const queryParams = { sid: sid };
        const bodyParams = {};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

    static async activateObject(id, sid) {
        const endPoint = "objects/"+id+"/activate";	
        const verb = 'POST';
        const queryParams = {};
        const bodyParams = {sid: sid};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }
    
    static async getObjects(id, sid) {
        const endPoint = "objects/"+id;
        const verb = 'POST';
        const queryParams = {};
        const bodyParams = {sid: sid};
        return await CommunicationController.genericRequest(endPoint, verb, queryParams, bodyParams);
    }

}