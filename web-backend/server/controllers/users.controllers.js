import ApiHelper from "../helpers/api.helper";
import globalHelper from "../helpers/global.helper";
import UsersModel from "../models/users.model";

class UserControllers{
    constructor() {}

    createUser = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {first_name, last_name, email_address, password, confirm_password} = validate_fields_response.result.fields;

                if(password === confirm_password){
                    let usersModel = new UsersModel();
    
                    response_data = await  usersModel.insertUser({first_name, last_name, email_address, password});
                }
                else{
                    response_data.error = "Password and Confirm Password does not match!";
                }
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your account!";
        }

        res.json(response_data);
    }

    loginUser = async(req, res) => {
        let response_data = {status: false, result: {}, error: null};

        try {
            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {email_address, password} = validate_fields_response.result.fields;

                let usersModel = new UsersModel();
                let {result:[user_data]} = await usersModel.getUsers({email_address: email_address});

                if(user_data && user_data.password === globalHelper.generatePassword(password, user_data.created_at)){
                    globalHelper.generateSessionData(req, user_data);

                    response_data.result.redirect_url = "/dashboard";
                    response_data.status = true;
                }
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong!";
        }

        res.json(response_data);
    }
}

/* automatically initialize User Controller */
export default (function userFunctions(){
    return new UserControllers();
})();