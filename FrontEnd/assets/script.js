// On déclare la variable globale pour y stocker les travaux
let travauxGlobal = [];


// Prendre les données des travaux et les afficher dans la galerie
function listerTravaux(travaux) {
    // Récupération de la div "gallery" dans le HTML où je mets les images
    const galerie = document.querySelector(".gallery");  
    
    // Vider ce qu’il y a dans la galerie (au cas où il y a déjà des choses)
    galerie.innerHTML = "";  
    
    // Pour chaque travail qu’on a reçu (chaque projet), on va créer une image + un titre
    for (let i = 0; i < travaux.length; i++) {
      const travail = travaux[i];  // On prend un travail du tableau
  
      // Création d'une balise <figure>
      const figure = document.createElement("figure");
  
      // Création d'une image <img>
      const image = document.createElement("img");
      image.src = travail.imageUrl;      // On met le lien de l'image
      image.alt = travail.title;         // On met un texte alternatif pour l'accessibilité
  
      // Création d'une légende <figcaption>
      const legende = document.createElement("figcaption");
      legende.innerText = travail.title; // On met le titre du travail
  
      // On assemble : image + légende dans figure
      figure.appendChild(image);
      figure.appendChild(legende);
  
      // On ajoute la figure dans la galerie
      galerie.appendChild(figure);
    }
  }

// Récupération des données du back-end avec fetch
fetch("http://localhost:5678/api/works")
  .then(function(response) {
    // On transforme la réponse récupérer en JSON
    return response.json();
  })
  .then(function(data) {
    travauxGlobal = data;
    // Afficher sur la page
    listerTravaux(travauxGlobal);
  })
  .catch(function(error) {
    console.log("Erreur lors de la récupération des données :", error);
  });


// Récupération des catégories dans le back-ends avec fetch
fetch("http://localhost:5678/api/categories")
.then(function(response) {
 return response.json();
})
.then(function(data){
//Afficher les boutons sur la pages
 afficherFiltresBoutons(data);
 })
.catch(function(error){
console.log("Erreur lors de la récupération des données :", error);
});
  

/**
 * Création des boutons de filtre et gerer l'état actif avec un Set minimal.
 */
function afficherFiltresBoutons(data) {
    const container = document.querySelector('.filtres');
    container.innerHTML = '';  
  
    //mettre "Tous" + les catégories
    const categories = [{ name: 'Tous', id: null }, ...data];
  
    // Création d'un Set pour stocker le bouton actif
    let activeBtnSet = new Set();
  
    categories.forEach(cat => {
      const btn = document.createElement('button');  // Pour chaque categorie, créé un bouton
      btn.textContent = cat.name;                    // on met le nom
  
      btn.addEventListener('click', function() {
        // on retire la classe 'active' du bouton précédent (s'il existe)
        activeBtnSet.forEach(b => b.classList.remove('active'));
  
        // Mettre à jour le Set avec le bouton qu'on vient de cliquer
        activeBtnSet = new Set([this]);
  
        // Ajoute la classe 'active' au nouveau bouton
        this.classList.add('active');
  
        // Filtrer la galerie et affiche
        const liste = (cat.id === null)
          ? travauxGlobal
          : travauxGlobal.filter(t => t.categoryId === cat.id);
        listerTravaux(liste);
      });
  
      container.appendChild(btn);  // on ajoute le bouton à l'écran
    });
  }
  
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

document.addEventListener('DOMContentLoaded', function() {
  const modifyBtn   = document.getElementById('modifyBtn');
  const modal       = document.getElementById('modal');
  const overlay     = modal.querySelector('.modal-overlay');
  const closeBtn    = document.getElementById('close-btn');
  const galleryM     = document.getElementById('galleryModal');
  const fileInput   = document.getElementById('file-input');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const viewGallery    = document.getElementById("AfficherGallerie");
  const viewAdd        = document.getElementById("AjoutPhoto");
  const backBtn        = document.getElementById("btn-back");
  const previewArea    = document.getElementById("preview-area");
  const titleInput     = document.getElementById("photo-title");
  const categorySelect = document.getElementById("photo-category");
  const submitBtn      = document.getElementById("submit-btn");
  const mainGallery    = document.querySelector(".gallery");


  // Stocke (id, src) pour chaque image
  let images = [];

  // Afficher la galerie à partir du tableau images
  function renderGalleryM() {
    galleryM.innerHTML = '';
    images.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML =
        `<img src="${item.src}" alt="Photo ${item.id}">
         <button class="delete-btn" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>`;
      galleryM.appendChild(div);
    });
    // on rattache l’event de suppression après avoir inséré chaque <button class="delete-btn" data-id="...">…
      galleryM.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
    // On récupère l'id du work à supprimer
    const id = this.dataset.id;
    try {
      //  On envoie la requête DELETE à l'API
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Status " + response.status);

      //  Si tout est ok, on retire l'élément du tableau 'images'
      images = images.filter(item => item.id !== Number(id));
      renderGalleryM();  // ré-affiche la modale sans cet item

      // On retire aussi du tableau global et on rafraîchit la galerie principale
      travauxGlobal = travauxGlobal.filter(t => t.id !== Number(id));
      listerTravaux(travauxGlobal);

    } catch(err) {
      console.error("Erreur suppression :", err);
      alert("Impossible de supprimer ce projet.");
    }
  });
});
  }

  //on récupére les photos depuis le back-end
  function loadImages() {
    fetch("http://localhost:5678/api/works")            //et on l' adapte àl’URL si besoin
      .then(res => {
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.json();
      })
      .then(data => {
        // on transforme chaque work en (id, src)
        images = data.map(work => ({
          id:  work.id,
          src: work.imageUrl
        }));
        renderGalleryM();
      })
      .catch(err => {
        console.error('Erreur chargement photos :', err);
        alert("Impossible de charger la galerie.");
      });
  }

  // Ouvrir et fermer la modale
  modifyBtn.addEventListener('click', function() {
    modal.classList.remove('hidden');
    loadImages();    // on charge depuis le back à chaque ouverture
  });
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  overlay.addEventListener('click', () => modal.classList.add('hidden'));


// ───── 0. Charger les catégories dès le départ ─────
fetch("http://localhost:5678/api/categories")
  .then(res => res.json())
  .then(cats => {
    // Pour chaque catégorie reçue, on ajoute une <option>
    cats.forEach(cat => {
      const opt = document.createElement("option");
      opt.value       = cat.id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  })
  .catch(err => console.error("Erreur catégories :", err));

// ───── 1. Bascule Galerie ⇄ Ajout-photo ─────
addPhotoBtn.addEventListener("click", () => {
  viewGallery.classList.add("hidden");
  viewAdd.classList.remove("hidden");
});
backBtn.addEventListener("click", () => {
  viewAdd.classList.add("hidden");
  viewGallery.classList.remove("hidden");
  // Remise à zéro du formulaire et de la preview
  fileInput.value        = "";
  titleInput.value       = "";
  titleInput.disabled    = true;
  categorySelect.value   = "";
  categorySelect.disabled= true;
  submitBtn.disabled     = true;
  previewArea.innerHTML  = `
    <i class="fa-regular fa-image preview-icon"></i>
    <label for="file-input" class="btn-upload">+ Ajouter photo</label>
    <p class="preview-text">jpg, png : 4 Mo max</p>
  `;
});

// ───── 2. Preview + activation progressive ─────
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;  // si on annule, on fait rien

  // Affiche l’aperçu
  const reader = new FileReader();
  reader.onload = e => {
    previewArea.innerHTML = `<img src="${e.target.result}" alt="Aperçu" />`;
  };
  reader.readAsDataURL(file);

  // Active les champs Titre, Catégorie et le bouton Valider
  titleInput.disabled      = false;
  categorySelect.disabled  = false;
  submitBtn.disabled       = false;
});

// ───── 3. Soumission du formulaire ─────
submitBtn.addEventListener("click", async e => {
  e.preventDefault();

  // Vérifie que tout est rempli
  if (!fileInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
    return alert("Veuillez remplir tous les champs.");
  }

  // Prépare FormData
  const formData = new FormData();
  formData.append("image",    fileInput.files[0]);
  formData.append("title",    titleInput.value.trim());
  formData.append("category", categorySelect.value);

  try {
    // Envoi au back-end
    const token    = localStorage.getItem("token");
    const response = await fetch("http://localhost:5678/api/works", {
      method:  "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body:    formData
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const newWork = await response.json();

    // Ajoute la nouvelle photo dans la galerie principale
    const fig = document.createElement("figure");
    fig.innerHTML = `
      <img src="${newWork.imageUrl}" alt="${newWork.title}">
      <figcaption>${newWork.title}</figcaption>
    `;
    mainGallery.appendChild(fig);

    // Réinitialise et ferme la modale
    backBtn.click();
    modal.classList.add("hidden");

  } catch (err) {
    console.error("Échec ajout photo :", err);
    alert("Impossible d'ajouter la photo.");
  }
});

});

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
