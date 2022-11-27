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
            this.response.render("index", {template: "dashboard", data: {user_details: this.user_data, posts:[]}, assets: {javascripts:[
                "global/wall.script.js"
            ]}});
        }
        else{
            this.response.redirect("/");
        }
    }
}

export default ViewsController;