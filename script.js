document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
        alert("Connexion réussie (démo)");
        alert(`Bienvenue ${username} 👋`);
        window.location.href = "dashboard.html";
    } else {
        alert("Veuillez remplir tous les champs");
    }
});
