import { format } from "mysql";
import globalHelper from "../helpers/global.helper";
import DatabaseModel from "./lib/database.model";

class MessageModel extends DatabaseModel{
    construct() {}

    fetchMessages = async (params, select_fields = "*", table = "posts", is_dashboard_page = false) => {
        let response_data = {status: false, result: [], error: null};

        try {
            let generate_query_response = this.getQueryAndParams(params, ["id", "user_id"]);

            if(generate_query_response.status){
                let select_query = null;
    
                if(is_dashboard_page){
                    select_query = format(`
                        SELECT 
                            posts.id as post_id, posts.content, users.id as user_id, CONCAT(users.first_name, ' ', users.last_name) as author,
                            DATE_FORMAT(posts.created_at, "%M %d, %Y %H:%i:%s") as created_at,
                            IF(posts.user_id = ? AND posts.created_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1, 0) as is_deletable,
                            user_post_comments.post_comments
                        FROM posts
                        LEFT JOIN (
                            SELECT 
                                post_id,
                                json_arrayagg(JSON_OBJECT(
                                    "comment_id", comments.id,
                                    "user_id", users.id,
                                    "author",  CONCAT(users.first_name, ' ', users.last_name),
                                    "content", comments.content,
                                    "created_at", DATE_FORMAT(comments.created_at, "%M %d, %Y %H:%i:%s"),
                                    "is_deletable",  IF(comments.user_id = ? AND comments.created_at >= DATE_SUB(NOW(), INTERVAL 30 MINUTE), 1, 0)
                                )) as post_comments
                            FROM comments
                            INNER JOIN users on comments.user_id = users.id
                            GROUP BY post_id
                        ) as user_post_comments on user_post_comments.post_id = posts.id
                        INNER JOIN users on posts.user_id = users.id
                        ORDER BY posts.id DESC;
                    `, [params.user_id, params.user_id]);
                }
                else{
                    select_query =  format(`SELECT  id, content, created_at FROM ${table} WHERE id = ?`, [params.id]);
                }
    
                response_data.result = await this.executeQuery(select_query);
                response_data.status = true;
            }
            else{
                response_data.error = generate_query_response.error;
            }
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        return response_data;
    }

    createMessage = async (params, table="posts") => {
        let response_data = {status: false, result: [], error: null};

        try {
            await this.executeQuery(format(`INSERT INTO ${table} SET ?, created_at = NOW();`, [params]));
            response_data.status = true;
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while creating your message!";
        }

        return response_data;
    }

    updateMessage = async (params, table="posts") => {
        let response_data = {status: false, result: [], error: null};

        try {
            await this.executeQuery(format(`UPDATE ${table} SET content = ?, updated_at = NOW() WHERE id = ? AND user_id;`, [params.content, params.id, params.user_id]));
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
            await this.executeQuery(format(`DELETE FROM ${table} WHERE id = ? AND user_id = ?;`, [params.id, params.user_id]));
            response_data.status = true;
        } 
        catch (error) {
            response_data.error = error.toString();
            response_data.message = "Something went wrong while deleting your message!";
        }

        return response_data;
    }
}

export default MessageModel;