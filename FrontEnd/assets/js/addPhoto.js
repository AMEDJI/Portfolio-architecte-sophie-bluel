document.addEventListener('DOMContentLoaded', function() {
    const modal       = document.getElementById('modal');
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
    
// Charger les catégories dès le départ
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

// Bascule Galerie ⇄ Ajout-photo 
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

// Preview + activation progressive 
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;  // si on annule, on fait rien

  // Afficher l’aperçu
  const reader = new FileReader();
  reader.onload = e => {
    previewArea.innerHTML = `<img src="${e.target.result}" alt="Aperçu" />`;
  };
  reader.readAsDataURL(file);

  // Activer les champs Titre, Catégorie et le bouton Valider
  titleInput.disabled      = false;
  categorySelect.disabled  = false;
  submitBtn.disabled       = false;
});

// Soumission du formulaire 
submitBtn.addEventListener("click", async e => {
  e.preventDefault();

  // Vérifier que tout est rempli
  if (!fileInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
    return alert("Veuillez remplir tous les champs.");
  }

  // Préparer FormData
  const formData = new FormData();
  formData.append("image",    fileInput.files[0]);
  formData.append("title",    titleInput.value.trim());
  formData.append("category", categorySelect.value);

  try {
    // Envoyer au back-end
    const token    = localStorage.getItem("token");
    const response = await fetch("http://localhost:5678/api/works", {
      method:  "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body:    formData
    });
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const newWork = await response.json();

    // Ajouter la nouvelle photo dans la galerie principale
    const fig = document.createElement("figure");
    fig.innerHTML = `
      <img src="${newWork.imageUrl}" alt="${newWork.title}">
      <figcaption>${newWork.title}</figcaption>
    `;
    mainGallery.appendChild(fig);

    // Réinitialiser et fermer la modale
    backBtn.click();
    modal.classList.add("hidden");

  } catch (err) {
    console.error("Échec ajout photo :", err);
    alert("Impossible d'ajouter la photo.");
  }
});

});