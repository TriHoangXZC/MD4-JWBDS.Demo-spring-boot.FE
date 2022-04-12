function register() {
    let username = $('#username').val();
    let password = $('#password').val();
    let confirmPassword = $('#confirm-password').val();
    let user = {
        username : username,
        password : password,
        confirmPassword : confirmPassword
    }
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/register',
        data: JSON.stringify(user),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            location.href = "login.html";
        },
        error: function (){
            showErrorMessage("Sign Up failed!");
        }
    })
}