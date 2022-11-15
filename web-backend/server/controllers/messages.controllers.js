import ApiHelper from "../helpers/api.helper";
import globalHelper from "../helpers/global.helper";
import MessageModel from "../models/messages.model";

class MessageControllers{
    constructor() {}

    createMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            /* check if user is logged in, throws error otherwise */
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {content, message_type} = validate_fields_response.result.fields;
                let messageModel = new MessageModel();
                let params = { content, user_id: req.session?.village_user?.id};

                if(message_type === "comments"){
                    params.post_id = req.body.post_id;
                }

                response_data = await messageModel.createMessage(params, message_type);
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
            /* check if user is logged in, throws error otherwise */
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {id, content, message_type} = validate_fields_response.result.fields;
                let messageModel = new MessageModel();

                response_data = await messageModel.updateMessage({id, content, user_id: req.session?.village_user?.id}, message_type);

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
            /* check if user is logged in, throws error otherwise */
            globalHelper.isUserLoggedIn(req);

            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {id,  message_type} = validate_fields_response.result.fields;
                let messageModel = new MessageModel();

                response_data = await messageModel.deleteMessage({id, user_id: req.session?.village_user?.id}, message_type);

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

/* automatically initialize Message Controller */
export default (function messagesFunctions(){
    return new MessageControllers();
})();