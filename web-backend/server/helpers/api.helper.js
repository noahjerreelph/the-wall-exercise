import e from "express";
import {API_SETTINGS} from "../config/constants/app.constants";

class ApiHelper{
    constructor(request_url) {
        this.api_url = request_url;
    }

    validateFields = (params) => {
        let response_data = {status:false, result: {}, error: null};

        try {
            let {route_url, validations} = API_SETTINGS;
            
            let [url, action] = this.api_url.replace(`${route_url}/`, "").split("/");

            if(API_SETTINGS.urls?.[url]?.[action]){
                response_data.result.fields ??= {};
                response_data.result.error_fields ??= [];
                response_data.result.missing_fields ??= [];

                for(let index in API_SETTINGS.urls[url][action]){
                    let required_field = API_SETTINGS.urls[url][action][index];

                    if(params[required_field] && params[required_field].trim() !== ""){
                        let is_valid = true;

                        if(validations[required_field] && required_field === "email_address"){
                            is_valid = validations[required_field].test(params[required_field].trim());
                        }

                        if(is_valid){
                            response_data.result.fields[required_field] = params[required_field].trim();
                        }
                        else{
                            response_data.result.error_fields.push(`${params[required_field]} is not a valid email address!`)
                        }
                    }
                    else{
                        response_data.result.missing_fields.push(required_field);
                    }
                }

                if(response_data.result.missing_fields.length || response_data.result.error_fields.length){
                    let error_message = response_data.result.missing_fields.length && `Required fields are missing: ${response_data.result.missing_fields.join(",")}. ` || "";

                    throw new Error(`${error_message}${response_data.result.error_fields.length && response_data.result.error_fields.join(",") || ""}`); 
                }
                else{
                    response_data.status = true;
                }
            }
            else{
                throw new Error("Set API and Fields in App Constants to enable API Route validation");
            }
        } 
        catch (error) {
            response_data.error = error.toString();
        }

        return response_data;
    }
}

export default ApiHelper;