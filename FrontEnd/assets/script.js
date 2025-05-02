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
  
  