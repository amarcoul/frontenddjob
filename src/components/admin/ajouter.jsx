import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/add.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

function Create() {
  const [titre, setTitle] = useState("");
  const [categories, setCategories] = useState([]); // État pour stocker les catégories sélectionnées
  const [allCategories, setAllCategories] = useState([]); // État pour stocker toutes les catégories disponibles
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [contenu, setBio] = useState("");
  const [auteur, setAuteur] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.id) {
      setAuteur(userData.id);
    }

    // Récupérer les catégories depuis l'API
    axios.get(`${API_URL}/categories/`)
      .then(response => {
        setAllCategories(response.data); // Supposons que l'API retourne un tableau d'objets { id: number, nom: string }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des catégories:", error);
      });
  }, []);
  function logout() {
    localStorage.removeItem("user"); 
    window.location.href = "/login"; }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('titre', titre);
    
    // Gestion des catégories
    let categoriesToSend;
    if (categories.length === 1) {
      // Si une seule catégorie est sélectionnée, envoyer uniquement cette catégorie
      categoriesToSend = categories[0];
      formData.append('categories', JSON.stringify(categoriesToSend)); // Envoyer une seule catégorie
    } else {
      // Si plusieurs catégories sont sélectionnées, les envoyer une par une en tant que tableau
      categoriesToSend = categories; // On envoie directement le tableau
      categoriesToSend.forEach((category) => {
        formData.append('categories', JSON.stringify(category)); // Ajouter chaque catégorie individuellement
      });
    }
    
    const cleanedContent = contenu.replace(/<p>|<\/p>/g, ''); // Supprime les balises <p> et </p>
  formData.append('contenu', cleanedContent); // Envoyer le contenu nettoyé

    if (image) {
      formData.append('image', image);
    }
    
    if (auteur) {
      formData.append('auteur', auteur); // Envoyer l'auteur sous forme d'ID
    }
    console.log("titre:",titre);
    console.log("contenu:",contenu);
    console.log("categories:",categories);
    console.log("auteur:",auteur);
    console.log("image:",image);
  try {
      const response = await axios.post(`${API_URL}/articleadmin/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate('/adminhome');
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error);
      if (error.response) {
        console.error("Détails de l'erreur:", error.response.data);
      }
      alert(`Erreur: ${error.response?.data?.message || 'Une erreur est survenue'}`);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold"></span>
          </div>
          <span className="text-xl font-semibold">Kimbiiz</span>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={logout}>
          Déconnexion
        </button>

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => navigate('/adminadd')}>
          Nouvel article
        </button>
      </header>
      <div className="create-max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="create-main">Ajouter un article</h1>
        
        <label className="create-label">Titre de l'article</label>
        <input 
          type="text" 
          className="create-input-text" 
          value={titre} 
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <label className="create-label">Thèmes</label>
        <select 
          multiple 
          className="create-input-text"
          value={categories}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
            setCategories(selectedOptions); // Met à jour l'état des catégories
          }}
        >
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.nom}>{cat.nom}</option>
          ))}
        </select>
        
        <label className="create-label">Image d'illustration</label>
        <div className="create-border-p4">
        {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mx-auto mb-4"
              style={{ maxWidth: "50px", maxHeight: "50px", objectFit: "contain" }}
            />
          )}
          <input type="file" onChange={handleImageChange} className="hidden" id="fileUpload" />
          <label htmlFor="fileUpload" className="create-label-fileUpload">
            Cliquez pour choisir ou glissez et déposez
          </label>
        </div>
        
        <label className="create-label">Contenu</label>
        <div className="border rounded-lg mb-4">
          <ReactQuill 
            value={contenu}
            onChange={setBio}
            placeholder="Commencez à rédiger votre article ici..."
          />
        </div>
        
        <button className="create-button mr-2">Voir les données</button>
        <button onClick={handleSubmit} className="create-button">Publier</button>
      </div>
    </div>
  );
}

export default Create;