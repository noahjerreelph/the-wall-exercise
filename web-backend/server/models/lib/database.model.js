import DatabaseConnection from "../../config/database.connection";


class DatabaseModel {
    constructor(transaction = null){
        this.database = new DatabaseConnection();
        this.activeTransaction = transaction;
    }

    runQueryStatement = async (query, dbConnection, is_transaction = false) => {
        return new Promise((resolve, reject) => {
            try{
                dbConnection.query(query, (query_error, result) => {
                    if(query_error) reject(query_error);

                    if(!is_transaction) dbConnection.release();

                    resolve(result);
                });
            }
            catch(error){
                reject(error);
            }
        })
    }

    executeQuery = async (query) => {
        let databaseModel = this;

        return new Promise(async (resolve, reject) => {
            try{
                if(databaseModel.activeTransaction){
                    let results = await databaseModel.runQueryStatement(query, databaseModel.activeTransaction, true);
                    resolve(results);
                }
                else{
                    databaseModel.database.connection.getConnection(async(error, connection) => {
                        if(!error){
                            let results = await databaseModel.runQueryStatement(query, connection);
                            resolve(results);
                        }
                        else{
                            reject(error);
                        }
                    });
                }
            }
            catch(error){
                reject(error);
            }
        })
    }

    startTransaction = async () => {
        return new Promise((resolve, reject) => {
            try{
                this.database.connection.getConnection(async(error, connection) => {
                    if(!error){
                        connection.beginTransaction(async(transaction_error)=>{
                            if(transaction_error){
                                reject(transaction_error);
                            }
                            else{
                                resolve(connection);
                            }
                        });
                    }
                    else{
                        reject(error);
                    }
                });
            }
            catch(error){
                reject(error);
            }
        })
    }

    cancelTransaction = async (connection) => {
        return new Promise((resolve, reject) => {
            connection.rollback(function(){
                connection.release();
                resolve(true);
            })
        })
    }

    commitTransaction = async (connection) => {
        let databaseModel = this;

        return new Promise((resolve, reject) => {
            connection.commit(async function(transaction_error){
                if(transaction_error){
                    await databaseModel.cancelTransaction(connection);
                    reject(transaction_error);
                }
                else{
                    connection.release();
                    resolve(true);
                }
            })
        })
    }

    getQueryAndParams = (object_params, required_params = [], query_params = [], query_strings = [], query_connector = "AND", __strict = true) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(object_params.constructor === Object){
                for(const [key, value] of Object.entries(object_params)){
                    /*	check for selected columns only */ 
                    if(!required_params.length || required_params.includes(key)){				
                        /*	sanitized query parameter */ 
                        if(value){				
                            /*	check if value is an array to generate query param to IN clauses */ 
                            if(value.constructor === Array){
                                query_strings.push(`${key} IN (?)`);
                                query_params.push(value);
                            } 
                            /*	check if value is an object custom for NOT IN to generate query param to NOT IN clauses */ 
                            else if(value.constructor === Object && value.hasOwnProperty("not_in")){
                                query_strings.push(`${key} NOT IN (?)`);
                                query_params.push(value.not_in);
                            }
                            /*	check if value is an object custom for OR to generate query param to OR clauses */ 
                            else if(value.constructor === Object && value.hasOwnProperty("or")){
                                query_strings.push(`(${value.or.join(" OR ")})`);								
                            }  
                            /*	check if value is an object custom for raw queries */ 
                            else if(value.constructor === Object && value.hasOwnProperty("raw")){
                                query_strings.push(`${key} = ${value.raw}`);
                            }  
                            /*	default to generate normal query param */ 
                            else {
                                query_strings.push(`${key} = ?`);
                                query_params.push(value);
                            }
                        }
                    }
                }
            
                /* return true if there is an existing query strings */
                response_data.status  = (query_strings.length) ? true : false;

                if(query_strings.length){
                    response_data.result.query_string = `${query_strings.join(` ${query_connector} `)}`;
                    response_data.result.query_params = query_params;
                }
                else{
                    response_data.error = "Parameters should generate a query string.";
                }
            }
            else{
                response_data.error = "Parameters should be an object, not array";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

export default DatabaseModel;