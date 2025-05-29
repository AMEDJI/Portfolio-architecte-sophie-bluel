document.addEventListener('DOMContentLoaded', function() {
    const modifyBtn   = document.getElementById('modifyBtn');
    const modal       = document.getElementById('modal');
    const overlay     = modal.querySelector('.modal-overlay');
    const closeBtn    = document.getElementById('close-btn');
    const galleryM     = document.getElementById('galleryModal');
  
  
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
  
    // Ouvrir et fermer la modale
    modifyBtn.addEventListener('click', function() {
      modal.classList.remove('hidden');
      loadImages();    // on charge depuis le back à chaque ouverture
    });
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    overlay.addEventListener('click', () => modal.classList.add('hidden'));
});  