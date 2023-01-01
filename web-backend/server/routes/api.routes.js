import {API_SETTINGS} from "../config/constants/app.constants";
import MessageRoutes from "./apis/message.routes";
import UserRoutes from "./apis/user.routes";

function ApiRoutes(App){
    const api_registers = {
        users: UserRoutes,
        messages: MessageRoutes
    }

    for(let [url] of Object.entries(API_SETTINGS.urls)){
        if(api_registers[url]){
            App.use(`${API_SETTINGS.route_url}/${url}`, api_registers[url]);
        }
    }
}

export default ApiRoutes;