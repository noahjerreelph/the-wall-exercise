import ApiHelper from "../helpers/api.helper";
import MessagesModel from "../models/messages.model";
import Ejs from "ejs";
import Path from "path";

class CommentController{
    constructor() {}

    createMessage = async (req, res) => {
        let response_data = {status: false, result: {}, error: null };

        try {
            let apiHelper = new ApiHelper(req.originalUrl);
            let validate_fields_response = apiHelper.validateFields(req.body);

            if(validate_fields_response.status){
                let {message, post_id} = validate_fields_response.result.fields;
                let messagesModel = new MessagesModel("comments");
                
                response_data = await messagesModel.createMessage({message, post_id, user_id: req.session?.village_user?.id});

                if(response_data.status){
                    response_data.result.html = await Ejs.renderFile(Path.join(__dirname, "../../views/templates/comment.template.ejs"), {
                        comment: {
                            comment_id: response_data.result.last_insert_id,
                            created_at: response_data.result.created_at,
                            message: message,
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
            let messagesModel = new MessagesModel("comments");
            response_data = await messagesModel.updateMessage({ id: req.params.comment_id, content: req.body.message, user_id: req.session?.village_user?.id}, "comments");
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
            let messagesModel = new MessagesModel("comments");
            response_data = await messagesModel.deleteMessage({ id: req.params.comment_id, user_id: req.session?.village_user?.id}, "comments");
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while deleting your post!";
        }

        res.json(response_data);
    }

}

/* automatically initialize Post Controller */
export default (function commentFunctions(){
    return new CommentController();
})();