function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = (pwd.type === "password") ? "text" : "password";
}

$(document).ready(function () {
    $("#add-user").on('click', function (e) {
        e.preventDefault();

        const fullName = $("#fullName").val().trim();
        const username = $("#username").val().trim();
        const password = $("#password").val();
        const role = $("#role").val();

        if (!fullName || !username || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/api/v1/auth/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                fullName: fullName,
                username: username,
                password: password,
                role: role
            }),
            success: function (response) {
                alert(response.message);
                $("#user-form")[0].reset();
              //  window.location.href = "index.html";
            },
            error: function (xhr) {
                const errorMsg = xhr.responseJSON?.message || "Registration failed.";
                alert(errorMsg);
            }
        });
    });
});