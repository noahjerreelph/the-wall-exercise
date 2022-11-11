import ApiHelper from "../helpers/api.helper";
import MessagesModel from "../models/messages.model";
import Ejs from "ejs";
import Path from "path";

class PostController{
    constructor() {}

    createMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {content} = validate_fields_response.result.fields;
                let messagesModel = new MessagesModel();
                
                response_data = await messagesModel.createMessage({content, user_id: req.session?.village_user?.id});

                if(response_data.status){
                    response_data.result.html = await Ejs.renderFile(Path.join(__dirname, "../../views/templates/post.template.ejs"), {
                        post: {
                            id: response_data.result.last_insert_id,
                            created_at: response_data.result.created_at,
                            content: content,
                            user_id: req.session?.village_user?.id,
                            author: `${req.session?.village_user?.first_name} ${req.session?.village_user?.last_name}`
                        },
                        user_id: req.session?.village_user?.id
                    });
                }
            }
            else{
                response_data.error = validate_fields_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your post!";
        }

        res.json(response_data);
    }

    updateMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            let messagesModel = new MessagesModel("posts");
            response_data = await messagesModel.updateMessage({ id: req.params.post_id, content: req.body.message, user_id: req.session?.village_user?.id}, "posts");
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while updating your post!";
        }

        res.json(response_data);
    }

    deleteMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            let messagesModel = new MessagesModel("posts");
            response_data = await messagesModel.deleteMessage({ id: req.params.post_id, user_id: req.session?.village_user?.id}, "posts");
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while deleting your post!";
        }

        res.json(response_data);
    }

}

/* automatically initialize Post Controller */
export default (function postFunctions(){
    return new PostController();
})();