import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

function Modifie() {
  const { id } = useParams(); // Récupère l'ID de l'article depuis l'URL
  const navigate = useNavigate();
  const [titre, setTitle] = useState("");
  const [categories, setCategories] = useState([]); // Catégories sélectionnées
  const [allCategories, setAllCategories] = useState([]); // Toutes les catégories disponibles
  const [image, setImage] = useState(null);
  const [contenu, setBio] = useState("");
  const [auteur, setAuteur] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Redirige vers la page de création d'article
  const createArticle = () => {
    navigate('/adminadd');
  };
  function logout() {
    localStorage.removeItem("user"); 
    window.location.href = "/login"; 
  }
   useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.id) {
        setAuteur(userData.id);
      }
    }, []);

  // Récupère toutes les catégories disponibles
  useEffect(() => {
    // Récupérer les catégories depuis l'API
    axios.get(`${API_URL}/categories/`)
      .then(response => {
        setAllCategories(response.data); // Supposons que l'API retourne un tableau d'objets { id: number, nom: string }
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des catégories:", error);
      });
  }, []);

  // Récupère les données de l'article à modifier
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/article/${id}/`);
        if (response.data) {
          const { titre, categories, contenu, image, auteur } = response.data;
          setTitle(titre );
          
          // Si categories est une chaîne, la convertir en tableau
            setCategories([categories]);
          
          setBio(contenu || "");
          setAuteur(auteur || "");
          setCurrentImage(image || "");
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  // Gère le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Soumet le formulaire de modification
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('titre', titre.replace(/['']/g, ''));
    categories.forEach(category => formData.append('categories', category));
    formData.append('contenu', contenu.replace(/["]+/g, ''));
    formData.append('auteur', auteur);
    if (image) {
      formData.append('image', image);
    }
    try {
      await axios.put(`${API_URL}/articleadmin/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Article modifié avec succès!');
      navigate('/adminhome');
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
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

        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => createArticle()}>
          Nouvel article
        </button>
      </header>
      <div className="create-max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="create-main">Modifier l'article : {titre}</h1>

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
            setCategories(selectedOptions);
          }}
        >
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.nom}>{cat.nom}</option>
          ))}
        </select>
        <small className="text-gray-500">Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs catégories</small>

        <label className="create-label">Image d'illustration</label>
        <div className="create-border-p4">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="mx-auto mb-4" />
          ) : currentImage && (
            <img src={`${API_URL}${currentImage}`} alt="Current" className="mx-auto mb-4" />
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

        <button onClick={handleSubmit} className="create-button">Modifier</button>
      </div>
    </div>
  );
}

export default Modifie;