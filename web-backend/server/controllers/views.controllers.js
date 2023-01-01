import MessagesModel from "../models/messages.model";

class ViewsController {
    constructor(req, res){
        this.user_data = req.session?.village_user;
        this.request = req;
        this.response = res;
    }

    visitLandingPage = () => {
        if(!this.user_data?.id){
            this.response.render("index", {template: "user", assets: {javascripts:[
                "global/wall.script.js",
                "custom/user.script.js"
            ]}});
        }
        else{
            this.response.redirect("/dashboard");
        }
    }

    visitDashboard = async() => {
        if(this.user_data?.id){
            let messageModel = new MessagesModel();
            let message_data = await messageModel.fetchMessages({user_id: this.user_data.id}, null, true);

            this.response.render("index", {template: "dashboard", data: {user_details: this.user_data, posts: message_data?.result || []}, assets: {javascripts:[
                "global/wall.script.js",
                "custom/dashboard.script.js"
            ]}});
        }
        else{
            this.response.redirect("/");
        }
    }

    editMessage = async(id, message_type) => {
        if(this.user_data?.id){
            let messageModel = new MessagesModel();
            let message_data = await messageModel.fetchMessages({id, user_id: this.user_data?.id}, "id, content, created_at, updated_at", false, message_type);

            this.response.render("index", {template: "message", data: {user_details: this.user_data, message: message_data?.result?.[0] || {}, message_type}, assets: {javascripts:[
                "global/wall.script.js",
                "custom/dashboard.script.js"
            ]}});
        }
        else{
            this.response.redirect("/");
        }
    }
}

export default ViewsController;