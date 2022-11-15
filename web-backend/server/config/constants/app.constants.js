import { load }      from "js-yaml";
import { readFileSync }  from "fs";
import * as path from "path";

let AppConstants   = {};

try {
   let env_file = `${process.env.NODE_ENV || "development"}.env.yml`;

   let fileContents = readFileSync(path.join(__dirname, "..", `/${env_file}`), 'utf8');
   let data         = load(fileContents); 

    for(let key in data){
        AppConstants[key] = data[key];
    }

    AppConstants.API_SETTINGS = {
        route_url: "/api",
        urls: {
            users: {
                create: ["first_name", "last_name", "email_address", "password", "confirm_password"],
                login: ["email_address", "password"]
            },
            messages: {
                create: ["content", "message_type"],
                update: ["id", "content", "message_type"],
                delete: ["id", "message_type"]
            }
        },
        validations: {
            email_address: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
    };
}
catch (e) {
    console.log(`AppConstants: Error loading constants.`, e);
    process.exit(1);
}

module.exports = AppConstants;
    