import MessageModel from "../models/messages.model";

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
            let messageModel = new MessageModel();
            let response_data = await messageModel.fetchMessages({user_id: this.user_data?.id}, "", "", true);

            this.response.render("index", {template: "dashboard", data: {user_details: this.user_data, posts:(response_data.result || [])}, assets: {javascripts:[
                "global/wall.script.js",
                "custom/dashboard.script.js"
            ]}});
        }
        else{
            this.response.redirect("/");
        }
    }

    viewMessage = async(id, comment_id) => {
        if(this.user_data?.id){
            let messageModel = new MessageModel();
            let message_id = comment_id || id;
            let message_type = comment_id ? "comments" : "posts";
            let response_data = await messageModel.fetchMessages({id: message_id, user_id: this.user_data?.id}, "*", message_type);

            this.response.render("index", {template: "message", data: {user_details: this.user_data, message:(response_data?.result?.[0] || {}), message_type}, assets: {javascripts:[
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