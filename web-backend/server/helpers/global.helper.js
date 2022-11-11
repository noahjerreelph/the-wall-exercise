import md5 from "md5";

class GlobalHelper{
    constructor() {}

    generatePassword = (password, created_at = null, email_address = null) => {
        return md5(md5(`thewall${password}wallthe`), (created_at && new Date(created_at).getTime() || email_address));
    }

    generateSessionData = (req, user_data) => {
        user_data.encrypted_id = this.generatePassword(user_data.id, user_data.email_address);
        req.session.village_user = user_data;
        req.session.save();
    }
}

/* automatically initialize Global Helper */
export default (function globalFunctions(){
    return new GlobalHelper();
})();