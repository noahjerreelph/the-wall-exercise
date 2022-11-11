import MessagesModel from "../models/messages.model";

class ViewsController {
    constructor(req, res){
        this.user_data = req.session?.village_user;
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
            let messagesModel = new MessagesModel();
            let messages = await messagesModel.fetchPostsAndComments();

            this.response.render("index", {template: "dashboard", data: {user_data: this.user_data, posts: messages.result }, assets: {javascripts:[
                "global/wall.script.js",
                "custom/dashboard.script.js"
            ]}});
        }
        else{
            this.response.redirect("/");
        }
    }

    editMessage = async(message_id, message_type) => {
        if(this.user_data?.id){
            let messagesModel = new MessagesModel(message_type);
            let messages = await messagesModel.fetchMessages({id: message_id, user_id: this.user_data.id}, `id, ${message_type === "posts" ? "content" : "message"}`, message_type);

            this.response.render("index", {template: "message", data: {user_data: this.user_data, message: messages.result[0], message_type }, assets: {javascripts:[
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