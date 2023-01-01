import { createPool } from "mysql2";
import { DATABASE }   from "./constants/app.constants";

class DatabaseConnection {
    constructor(){
        this.connect_started_at = new Date().getTime();
        this.createPoolConnection();
    }

    createPoolConnection = () => {
        this.connection = createPool(Object.assign({connectionLimit: 653 }, DATABASE));
    }
}

export default DatabaseConnection;