import { format } from "mysql";
import globalHelper from "../helpers/global.helper";
import DatabaseModel from "./lib/database.model";

class UsersModel extends DatabaseModel{
    construct() {}

    getUsers = async(params, select_fields = "*") => {
        let response_data = {status: false, result: [], error: null};

        try {
            let generate_query_response = this.getQueryAndParams(params);

            if(generate_query_response.status){
                let {query_string, query_params} = generate_query_response.result;
                let get_users_query = format(`SELECT ${select_fields} FROM users WHERE ${query_string}`, query_params);

                response_data.result = await this.executeQuery(get_users_query);
                response_data.status = true;
            }
            else{
                response_data.error = generate_query_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
        }

        return response_data;
    }

    insertUser = async (params) => {
        let response_data = {status: false, result: [], error: null};

        try {
            let {result:[user_data]} = await this.getUsers({email_address: params.email_address}, "id");

            if(!user_data){
                let created_at = new Date();
                let encrypted_password = globalHelper.generatePassword(params.password, created_at);

                await this.executeQuery(format(`INSERT INTO users SET ?`, [{...params, password: encrypted_password, created_at}]));
                response_data.status = true;
            }
            else{
                throw new Error("User already exists!");
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your account!";
        }

        return response_data;
    }
}

export default UsersModel;