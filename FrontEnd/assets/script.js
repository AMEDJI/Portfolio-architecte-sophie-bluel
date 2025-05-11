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
  const modifyBtn   = document.getElementById('modify-btn');
  const modal       = document.getElementById('modal');
  const overlay     = modal.querySelector('.modal-overlay');
  const closeBtn    = document.getElementById('close-btn');
  const gallery     = document.getElementById('gallery');
  const fileInput   = document.getElementById('file-input');
  const addPhotoBtn = document.getElementById('add-photo-btn');

  // Stocke { id, src } pour chaque image
  let images = [];

  // Afficher la galerie à partir du tableau images
  function renderGallery() {
    gallery.innerHTML = '';
    images.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML =
        `<img src="${item.src}" alt="Photo ${item.id}">
         <button class="delete-btn" data-id="${item.id}">×</button>`;
      gallery.appendChild(div);
    });
    // on rattache l’event de suppression
    gallery.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = btn.dataset.id;
        // appeler ton DELETE avant de retirer du DOM
        images = images.filter(i => i.id !== Number(id));
        renderGallery();
      });
    });
  }

  //on récupére les photos depuis le back-end
  function loadImages() {
    fetch("http://localhost:5678/api/works")            //on l' adapte àl’URL si besoin
      .then(res => {
        if (!res.ok) throw new Error('Status ' + res.status);
        return res.json();
      })
      .then(data => {
        // transforme r chaque work en (id, src)
        images = data.map(work => ({
          id:  work.id,
          src: work.imageUrl
        }));
        renderGallery();
      })
      .catch(err => {
        console.error('Erreur chargement photos :', err);
        alert("Impossible de charger la galerie.");
      });
  }

  // Ouvrir er fermer la modale
  modifyBtn.addEventListener('click', function() {
    modal.classList.remove('hidden');
    loadImages();    // on charge depuis le back à chaque ouverture
  });
  closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  overlay .addEventListener('click', () => modal.classList.add('hidden'));

  // on ajouter une photo pour la lecture en base
  addPhotoBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', function() {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      // pour un vrai back il faut faire un fetch POST,
      // puis re-loadImages() ou push dans images[] avec l'ID renvoyé.
      images.push({ id: Date.now(), src: e.target.result });
      renderGallery();
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
  });
});


