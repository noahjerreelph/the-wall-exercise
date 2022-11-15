$(document).ready(() => {
    $("body")
        .on("submit", "#create-post", submitForm)
        .on("submit", ".create-comment", submitForm)
        .on("submit", "#update-post", submitForm)
        .on("click", ".delete-post", deleteForm)
        .on("click", ".delete-comment", deleteForm);
});