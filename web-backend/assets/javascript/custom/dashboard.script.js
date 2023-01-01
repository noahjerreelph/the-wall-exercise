$(document).ready(function() {
    $("body")
        .on("submit", "#create-post", submitForm)
        .on("submit", "#update-message", submitForm)
        .on("click", ".delete-post", deleteForm)
        .on("click", ".delete-comment", deleteForm);
})