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