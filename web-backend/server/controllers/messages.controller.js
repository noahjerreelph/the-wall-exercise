import ApiHelper from "../helpers/api.helper";
import globalHelper from "../helpers/global.helper";
import MessagesModel from "../models/messages.model";

class MessageController{
    constructor() {}

    createMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {content, message_type} = validate_fields_response.result.fields;
                let messagesModel = new MessagesModel();

                response_data = await messagesModel.createMessage({content, post_id: req.body?.post_id, user_id: req.session?.village_user?.id }, message_type);
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        res.json(response_data);
    }

    updateMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {id, content, message_type} = validate_fields_response.result.fields;
                let messagesModel = new MessagesModel();

                response_data = await messagesModel.updateMessage({id, content, user_id: req.session?.village_user?.id }, message_type);
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        res.json(response_data);
    }

    deleteMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {id, message_type} = validate_fields_response.result.fields;
                let messagesModel = new MessagesModel();

                response_data = await messagesModel.deleteMessage({id, user_id: req.session?.village_user?.id }, message_type);
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        res.json(response_data);
    }
}

/* automatically initialize User Controller */
export default (function messagesFunctions(){
    return new MessageController();
})();