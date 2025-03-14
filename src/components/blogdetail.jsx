import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaFacebook } from "react-icons/fa";
const API_URL = 'http://localhost:8000/api';
const API_URL1 = 'http://localhost:8000/';

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(0);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleIncrementViews = async () => {
    const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles')) || [];
    if (!viewedArticles.includes(id)) {
      try {
        const response = await axios.post(`${API_URL}/vue/${id}/`);
        setViews(response.data['nombre de vue']);
        localStorage.setItem('viewedArticles', JSON.stringify([...viewedArticles, id]));
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    }
  };

  const handleIncrementLikes = async () => {
    try {
      const response = await axios.post(`${API_URL}/likes/${article.id}/`);
      setLikes(response.data["nombre de likes"]);
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Erreur lors du like :", error);
    }
  };

  useEffect(() => {
    if (!id || isNaN(id)) {
      console.error("ID invalide :", id);
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/article/${id}/`);
        setArticle(response.data);
        setViews(response.data.vue);
        setLikes(response.data.likes);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
    handleIncrementViews();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <div className="kb-blog-detail">
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold"></span>
          </div>
          <span className="text-xl font-semibold">Kimbiiz</span>
        </div>
        <button onClick={handleLoginClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Me connecter
        </button>
      </header>

      <div className="kb-content-container">
        {/* Colonne principale avec le contenu de l'article */}
        <div className="kb-article-content">
          <div className="kb-article-metadata">
            <div className="kb-tags-container">
              {article.categories?.map((category) => (
                <span className="kb-category-tag" key={category.id}>{category.nom}</span>
              ))}
            </div>
            <h1 className="kb-article-title">{article.titre}</h1>
            
            <div className="kb-engagement-stats">
              <div className="kb-views">
                <span className="kb-stat-number">👁 {views}</span>
              </div>
              <div className="kb-likes">
              <button onClick={handleIncrementLikes} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      👍
                </button>
                <span className="kb-stat-number">{likes}</span>
              </div>
            </div>
          </div>

          <div className="kb-feature-image">
            <img src={`${API_URL1}/${article.image}`} alt="Article featured" />
          </div>

          <div className="kb-article-text">
            <p>{article.contenu}</p>
          </div>
        </div>

        {/* Sidebar avec les informations de l'auteur */}
        <div className="kb-author-section">
          <div className="kb-author-card">
            <img 
              src={`${API_URL1}/${article.auteur?.photo_profil}`} 
              alt="Author" 
              className="kb-author-avatar" 
            />
            <div className="kb-author-info">
              <h3 className="kb-author-name">{article.auteur?.first_name}</h3>
              <p className="kb-author-bio">{article.auteur?.bio}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
                  <a href="https://www.linkedin.com/sharing/share-offsite/?url=TON_URL" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin className="text-blue-600 text-2xl hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://twitter.com/intent/tweet?url=TON_URL&text=Ton%20message" target="_blank" rel="noopener noreferrer">
                    <FaTwitter className="text-blue-400 text-2xl hover:scale-110 transition-transform" />
                  </a>
                  <a href="https://www.facebook.com/sharer/sharer.php?u=TON_URL" target="_blank" rel="noopener noreferrer">
                    <FaFacebook className="text-blue-500 text-2xl hover:scale-110 transition-transform" />
                  </a>
          </div>
          <div className="kb-disabled-buttons">
              <button className="kb-edit-button">
                Modifier l'article ✎
              </button>
              <button className="kb-delete-button">
                Supprimer l'article 🗑
              </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default BlogDetail;