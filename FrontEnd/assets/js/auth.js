// Récupération du formulaire de connexion
const form = document.getElementById('login-form');

if (form) {
// On écoute l’événement "submit" du formulaire
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupère ce que l’utilisateur a tapé dans les champs
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Récupère la balise pour afficher les erreurs
  const messageErreur = document.getElementById('error-message');

  // Efface les anciens messages
  messageErreur.textContent = '';

  try {
    // Envoie une requête POST à l’API avec les identifiants
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // Si l’email ou le mot de passe est incorrect
    if (response.status === 401) {
      messageErreur.textContent = 'Email ou mot de passe incorrect.';
      return; // Arrête le code ici
    }

    // Si une autre erreur est survenue
    if (!response.ok) {
      messageErreur.textContent = 'Erreur serveur. Veuillez réessayer plus tard.';
      return;
    }

    // Si tout est bon, on extrait les données JSON
    const data = await response.json();

    // On affiche le token dans la console
    console.log("Token reçu :", data.token);

    // On stocke le token dans le localStorage
    localStorage.setItem('token', data.token);

    // Redirection vers la page d’accueil
    window.location.href = 'index.html';

  } catch (error) {
    // Si la requête n’a pas pu être envoyée (ex: serveur éteint)
    messageErreur.textContent = 'Impossible de se connecter au serveur.';
    console.error(error);
  }
});
};

// Gestion de la connexion et déconnexion //

document.addEventListener("DOMContentLoaded", () => {
  //  On récupère tous les éléments dont on a besoin
  const loginLink  = document.getElementById("loginlink");   // Lien login/logout
  const topbar  = document.getElementById("topbar");   
  const modifyBtnTopbar  = document.getElementById("modifyBtnTopbar");   // le bouton "modifier" du topbar
  const modifyBtn  = document.getElementById("modifyBtn");   // bouton "modifier"
  const filtres = document.querySelector(".filtres");      // la zone de filtres
  const modif = document.querySelector(".modifier");    

  //La fonction qui met à jour l'affichage selon la présence du token et on relit le token à chaque appel pour changer de valeur
  function toggleEditMode() {
    const token = localStorage.getItem("token");

    if (token) {
      //Utilisateur connecté
      topbar.classList.remove("hidden");   // afficher le pré-header
      modifyBtnTopbar.classList.remove("hidden");   // afficher le bouton Modifier top bar
      modifyBtn.classList.remove("hidden");      // afficher le bouton Modifier
      modif.classList.remove("hidden");        // cacher le libelle Modifier 
      filtres.classList.add("hidden");        // masquer les filtres
      loginLink.textContent = "logout";      // changer le texte du lien
      loginLink.href = "login.html";        
    } else {
      // Utilisateur déconnecté 
      topbar.classList.add("hidden");      // cacher le pré-header
      modifyBtnTopbar.classList.add("hidden");      // cacher le bouton Modifier du top bar
      modifyBtn.classList.add("hidden");           // cacher le bouton Modifier top bar
      modif.classList.add("hidden");   // cacher le libelle Modifier 
      filtres.classList.remove("hidden");  // afficher les filtres
      loginLink.textContent = "login";        // remettre "login"
      loginLink.href = "login.html";          // lien vers la page de connexion
    }
  }

  // brancher un seul listener sur loginLink
  loginLink.addEventListener("click", (e) => {
    const token = localStorage.getItem("token");

    if (token) {
      // logout
      e.preventDefault();                 // empêche tout rechargement ou navig
      localStorage.removeItem("token");   // on supprime le token
      toggleEditMode();                   // on rafraîchit
    }
    // s'il n'ya pas de token, c'est un login 
  });

  // Initialisation de l'affichage dès le chargement
  toggleEditMode();

});