function submitForm(e){
    e.preventDefault();

    let form = $(this);

    if(parseInt(form.attr("is-processing")) === 0){
        form.attr("is-processing", 1);
        form.find("span.error").remove();

        $.post(form.attr("action"), form.serialize(), ({status, result, error, message}) => {
            if(message){
                form.prepend(`<span class="success">${message}</span>`);
            }

            if(status){
               window.location.reload();
            }
            else{
                if(result?.redirect_url){
                    window.location.href = result.redirect_url;
                }
                else if(message || error){
                    form.prepend(`<span class="error">${message || error}</span>`);
                }
            }

            form.attr("is-processing", 0);
            form[0].reset();
        });
    }
    else{
        alert("The Form is Busy!");
    }
    

    return false;
}

function deleteForm(e){
    e.preventDefault();

    let a_link = $(this);
    let message_type = $(a_link).hasClass("delete-post") ? "posts" : "comments";
    let id = $(a_link).attr("message-id");


    $.post("/api/messages/delete", {id, message_type}, ({status, result, error, message}) => {
        if(status){
            window.location.reload();
        }
        else{
            alert(message || error);
        }
    });
    

    return false;
}