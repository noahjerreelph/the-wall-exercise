$(document).ready(() => {
    $("body")
        .on("submit", "#create-post", submitForm)
        .on("submit", "#update-message", submitForm)
        .on("submit", "form.create-comment", submitForm)
        .on("click", "button[name='edit-post']", function(e) {
            e.preventDefault();

            let post_id = $(this).attr("post-id");
            window.location.href = `/posts/${post_id}`;
        })
        .on("click", "button[name='edit-comment']", function(e) {
            e.preventDefault();

            let comment_id = $(this).attr("comment-id");
            window.location.href = `/comments/${comment_id}`;
        })
        .on("click", "button[name='delete-post']", function(e) {
            e.preventDefault();
            deleteMessage($(this), "posts");
        })
        .on("click", "button[name='delete-comment']", function(e) {
            e.preventDefault();
            deleteMessage($(this), "comments");
        })
});