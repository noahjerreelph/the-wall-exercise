$(document).ready(() => {
    $("body")
        .on("submit", "#user-registration", submitForm)
        .on("submit", "#user-login", submitForm);
});