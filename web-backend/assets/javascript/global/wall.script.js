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
                if(result?.redirect_url){
                    window.location.href = result.redirect_url;
                }
                else if(result?.html){
                    if(form.attr("id") === "create-post"){
                        form.after($(result.html));
                    }else{
                        form.before($(result.html));
                    }
                }
            }
            else{
                form.prepend(`<span class="error">${message || error}</span>`);
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

function deleteMessage(button, message_type){
    if(parseInt(button.attr("is-processing")) === 0){
        let is_delete = confirm("Are you sure you want to delete the selected message?");

        if(is_delete){
            let message_id = button.attr((message_type  === "posts" ? "post-id" : "comment-id"));
            let delete_url = `/api/${message_type}/${message_id}/delete`;
            
            button.attr("is-processing", 1);

            $.post(delete_url, ({status, result, error, message}) => {
                if(status){
                    button.parents((message_type  === "posts" ? "div.user-post" : "div.user-comment")).remove();
                }
                else{
                    alert(message || error)
                }
    
                button.attr("is-processing", 0);
            });
        }
    }
}