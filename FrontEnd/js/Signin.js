const AUTH_BASE = "http://localhost:8080/api/v1/auth";

function togglePassword() {
    const pwd = document.getElementById("password");
    pwd.type = (pwd.type === "password") ? "text" : "password";
}

$.ajaxSetup({
    xhrFields: { withCredentials: true },
    contentType: "application/json"
});

async function validateSession() {
    try {
        const res = await $.ajax({ url: `${AUTH_BASE}/validate`, method: "GET" });

        const d = res?.data;
        if (d?.userName && d?.role) {
            return { isAuthenticated: true, userName: d.userName, role: d.role };
        }
    } catch (_) { }
    return { isAuthenticated: false };
}

$(function () {
    $("form").on("submit", async function (e) {
        e.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val();

        if (!username || !password) {
            if (window.Swal) Swal.fire("Missing info", "Please fill in all fields.", "warning");
            else alert("Please fill in all fields.");
            return;
        }

        try {
            await $.ajax({
                url: `${AUTH_BASE}/login`,
                method: "POST",
                data: JSON.stringify({ username, password })
            });

            const session = await validateSession();
            if (session.isAuthenticated) {
                sessionStorage.setItem("username", session.userName);
                sessionStorage.setItem("role", session.role);

                if (window.Swal) {
                    await Swal.fire({
                        title: "Welcome!",
                        text: `Logged in as ${session.userName} (${session.role})`,
                        icon: "success",
                        timer: 900,
                        showConfirmButton: false
                    });
                }
                window.location.href = "dashboard.html";
            } else {
                if (window.Swal) Swal.fire("Login error", "Cookie not set. Check HTTPS/SameSite/secure settings.", "error");
                else alert("Login succeeded but session not established.");
            }
        } catch (xhr) {
            let msg = xhr?.responseJSON?.message || "Login failed. Please try again.";
            if (xhr?.status === 401 || xhr?.status === 403) {
                msg = "Username or password incorrect.";
            } else if (xhr?.status === 404 || String(msg).toLowerCase().includes("not found")) {
                // 🚨 Instead of redirecting to signup, show info message
                if (window.Swal) {
                    Swal.fire({
                        title: "User not found",
                        text: "You must be registered in the system by an administrator before you can log in.",
                        icon: "info",
                        confirmButtonText: "OK"
                    });
                    return;
                }
                alert("User not found. Please contact the administrator to register you in the system.");
                return;
            }
            if (window.Swal) Swal.fire("Error", msg, "error");
            else alert(msg);
        }
    });

    $(".btn-register").on("click", function (e) {
        e.preventDefault();
        if (window.Swal) {
            Swal.fire("Info", "Only the system administrator can create new accounts. Please contact admin.", "info");
        } else {
            alert("Only the system administrator can create new accounts. Please contact admin.");
        }
    });
});

window.togglePassword = togglePassword;
window.validateSession = validateSession;
