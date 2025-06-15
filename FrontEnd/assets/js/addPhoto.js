document.addEventListener('DOMContentLoaded', () => {
  // Références DOM
  const addPhotoBtn    = document.getElementById('add-photo-btn');
  const backBtn        = document.getElementById('btn-back');
  const viewGallery    = document.getElementById('AfficherGallerie');
  const viewAdd        = document.getElementById('AjoutPhoto');
  const fileInput      = document.getElementById('file-input');
  const previewArea    = document.getElementById('preview-area');
  const titleInput     = document.getElementById('photo-title');
  const categorySelect = document.getElementById('photo-category');
  const submitBtn      = document.getElementById('submit-btn');
  const modal          = document.getElementById('modal');
  const mainGallery    = document.querySelector('.gallery');

  // Charger les catégories dès le chargement
  fetch('http://localhost:5678/api/categories')
    .then(res => res.json())
    .then(cats => {
      cats.forEach(cat => {
        const opt = document.createElement('option');
        opt.value       = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      });
    })
    .catch(err => console.error('Erreur catégories :', err));

  // Désactiver par défaut
  titleInput.disabled     = true;
  categorySelect.disabled = true;
  submitBtn.disabled      = true;

  // Fonction qui active/désactive le bouton Valider
  function updateSubmitState() {
    const hasFile  = fileInput.files.length > 0;
    const hasTitle = titleInput.value.trim()  !== '';
    const hasCat   = categorySelect.value     !== '';
    submitBtn.disabled = !(hasFile && hasTitle && hasCat);
  }

  // Bascule Galerie → Ajout-photo
  addPhotoBtn.addEventListener('click', () => {
    viewGallery.classList.add('hidden');
    viewAdd.classList.remove('hidden');
  });
  backBtn.addEventListener('click', () => {
    viewAdd.classList.add('hidden');
    viewGallery.classList.remove('hidden');
    // Réinitialiser le form
    fileInput.value        = '';
    previewArea.innerHTML  = `
      <i class="fa-regular fa-image preview-icon"></i>
      <label for="file-input" class="btn-upload">+ Ajouter photo</label>
      <p class="preview-text">jpg, png : 4 Mo max</p>`;
    titleInput.value       = '';
    titleInput.disabled    = true;
    categorySelect.value   = '';
    categorySelect.disabled= true;
    updateSubmitState();   // désactive le bouton
  });

  // Preview + activation progressive des champs
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    // Aperçu immédiat
    const reader = new FileReader();
    reader.onload = e => {
      previewArea.innerHTML = `<img src="${e.target.result}" alt="Aperçu" />`;
    };
    reader.readAsDataURL(file);

    // Active les champs Titre & Catégorie
    titleInput.disabled     = false;
    categorySelect.disabled = false;

    updateSubmitState();  // réévalue le bouton
  });

  // À chaque saisie dans le titre, on réévalue
  titleInput.addEventListener('input', updateSubmitState);

  // À chaque changement de catégorie, on réévalue
  categorySelect.addEventListener('change', updateSubmitState);

  // Soumission du formulaire
  submitBtn.addEventListener('click', async e => {
    e.preventDefault();

    // Validation basique
    if (!fileInput.files[0] || !titleInput.value.trim() || !categorySelect.value) {
      return alert('Veuillez remplir tous les champs.');
    }

    // Préparer FormData
    const formData = new FormData();
    formData.append('image',    fileInput.files[0]);
    formData.append('title',    titleInput.value.trim());
    formData.append('category', categorySelect.value);

    try {
      const token    = localStorage.getItem('token');
      const response = await fetch('http://localhost:5678/api/works', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body:    formData
      });

      if (!response.ok) throw new Error(response.status);
      const newWork = await response.json();

      // Ajout immédiat dans la galerie principale
      const fig = document.createElement('figure');
      fig.innerHTML = `
        <img src="${newWork.imageUrl}" alt="${newWork.title}">
        <figcaption>${newWork.title}</figcaption>`;
      mainGallery.appendChild(fig);

      // Réinitialiser et fermer la modale
      backBtn.click();
      modal.classList.add('hidden');

    } catch (err) {
      console.error('Échec ajout photo :', err);
      alert('Impossible d\'ajouter la photo.');
    }
  });

  // Fermer la Vue Ajout avec la croix
  document.getElementById('addclose-btn').addEventListener('click', () => {
    backBtn.click();
    modal.classList.add('hidden');
  });
});
