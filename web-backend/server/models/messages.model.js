import { format } from "mysql";
import DatabaseModel from "./lib/database.model";

class MessagesModel extends DatabaseModel{
    constructor(messages_table = "posts", transaction = null) {
        super(transaction);
        this.messages_table = messages_table;
    }

    fetchPostsAndComments = async() => {
        let response_data = {status: false, result: [], error: null};

        try {
            let get_posts_query = format(`
                SELECT posts.id as id, posts.content, users.id as user_id, CONCAT(users.first_name, ' ', users.last_name) as author, posts.created_at, posts.updated_at, user_post_comments.post_comments
                FROM posts
                LEFT JOIN (
                    SELECT 
                        post_id, 
                        json_arrayagg(
                            JSON_OBJECT(
                                "comment_id", comments.id,
                                "author", CONCAT(users.first_name, " ", users.last_name), 
                                "user_id", users.id, 
                                "message", comments.message,  
                                "created_at", comments.created_at
                        )) as post_comments
                    FROM comments
                    INNER JOIN users on users.id = comments.user_id
                    GROUP BY post_id
                ) as user_post_comments on user_post_comments.post_id = posts.id
                INNER JOIN users on users.id = posts.user_id
                ORDER BY posts.id DESC`);

            response_data.result = await this.executeQuery(get_posts_query);
            response_data.status = true;
        } 
        catch (error) {
            response_data.error = error.toString();
        }

        return response_data;
    }

    fetchMessages = async(params, select_fields = "*", table = "posts") => {
        let response_data = {status: false, result: [], error: null};

        try {
            let generate_query_response = this.getQueryAndParams(params);

            if(!params || generate_query_response.status){
                let {query_string, query_params} = generate_query_response.result;
                let get_posts_query = format(`
                    SELECT ${select_fields} 
                    FROM ${table} 
                    ${params ? `WHERE ${query_string}` : ""};
                `, (params ? query_params : []));

                response_data.result = await this.executeQuery(get_posts_query);
                response_data.status = true;
            }
            else{
                response_data.error = generate_query_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
        }

        return response_data;
    }

    createMessage = async (params) => {
        let response_data = {status: false, result: {}, error: null};

        try {
            let created_at = new Date();
            let will_create_post = true;
            
            if(this.messages_table === "comments"){
                let fetch_message_response = await this.fetchMessages({id: params.post_id}, "id", "posts", false);
                will_create_post = fetch_message_response.result?.[0].id && true || false;
            }

            if(will_create_post){
                let create_response = await this.executeQuery(format(`INSERT INTO ${this.messages_table} SET ?`, [{...params, created_at, updated_at: created_at}]));
                response_data.result = { last_insert_id: create_response.insertId, created_at };
                response_data.status = true;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        return response_data;
    }

    updateMessage = async (params, table = "posts") => {
        let response_data = {status: false, result: { redirect_url: "/dashboard" }, error: null};

        try {
            let update_query = format(`UPDATE ${this.messages_table} SET ${table === "posts" ? "content" : "message"} = ?, updated_at = NOW() WHERE id=? AND user_id=?`, [params.content, params.id, params.user_id]);
            await this.executeQuery(update_query);
            response_data.status = true;
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while updating your message!";
        }

        return response_data;
    }

    deleteMessage = async (params, table="posts") => {
        let response_data = {status: false, result: [], error: null};

        try {
            let will_delete_message = true;
            let message_params = {id: params.id, user_id: params.user_id};

            if(table === "posts"){
                this.activeTransaction = await this.startTransaction();

                let delete_comments_response = await this.deleteMessage({post_id: params.id, user_id: params.user_id}, "comments");
                will_delete_message = delete_comments_response.status;
            }
            else{
                message_params = {post_id: params.post_id, user_id: params.user_id};
            }

            if(will_delete_message){
                let generate_query_response = this.getQueryAndParams(message_params);

                if(generate_query_response.status){
                    let {query_string, query_params} = generate_query_response.result;
                    let delete_message_query = format(`DELETE FROM ${table} WHERE ${query_string}`, query_params);
    
                    response_data.result = await this.executeQuery(delete_message_query);
    
                    if(table === "posts" && this.activeTransaction){
                        this.commitTransaction(this.activeTransaction);
                        this.activeTransaction = null;
                        response_data.status = true;
                        response_data.result.redirect_url = "/dashboard";
                    }
                    else{
                        response_data.status = true;
                    }
                }
                else{
                    response_data.error = generate_query_response.error;
                }
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while deleting your message!";

            if(this.activeTransaction && table === "posts" ){
                this.cancelTransaction(this.activeTransaction);
            }
        }

        return response_data;
    }
}

export default MessagesModel;