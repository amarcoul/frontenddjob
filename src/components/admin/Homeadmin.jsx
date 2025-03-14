import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/admin.css';
import { useNavigate } from 'react-router-dom'; 
const API_URL = 'http://localhost:8000/api';

function Admin() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null);
    function logout() {
      localStorage.removeItem("user"); 
      window.location.href = "/login"; 
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const [articlesRes, categoriesRes] = await Promise.all([
              fetch(`${API_URL}/articles/${activeCategory ? `?category=${activeCategory}` : ''}`).then(res => res.json()),
              fetch(`${API_URL}/categories/`).then(res => res.json())
            ]);
            
            // Normaliser les catégories pour chaque article
            const normalizedArticles = articlesRes.map(article => {
              return {
                ...article,
                categories: normalizeCategories(article.categories)
              };
            });
            
            setArticles(normalizedArticles);
            setCategories(categoriesRes);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [activeCategory]);
      
    // Fonction pour normaliser les catégories d'un article - AMÉLIORÉE
    const normalizeCategories = (categories) => {
      if (!categories) return [];
      
      // Si categories est une chaîne JSON, la parser
      if (typeof categories === 'string') {
        try {
          const parsed = JSON.parse(categories);
          
          if (Array.isArray(parsed)) {
            return parsed.map(cat => {
              if (typeof cat === 'object' && cat !== null && cat.nom) {
                return cat.nom;
              }
              return typeof cat === 'string' ? cat : String(cat);
            });
          }
          

          if (typeof parsed === 'object' && parsed !== null && parsed.nom) {
            return [parsed.nom];
          }
          
          return Array.isArray(parsed) ? parsed : [String(parsed)];
        } catch (e) {
          return [categories];
        }
      }
      
      if (Array.isArray(categories)) {
        return categories.map(cat => {
          if (typeof cat === 'object' && cat !== null && cat.nom) {
            return cat.nom;
          }
          return typeof cat === 'string' ? cat : String(cat);
        });
      }
      

      if (typeof categories === 'object' && categories !== null && categories.nom) {
        return [categories.nom];
      }

      return [String(categories)];
    };
      
    const handleLoginClick = () => {
        navigate('/login');
    };
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    };
    
    const truncateText = (text, maxLines = 2) => {
      const words = text.split(" ");
      if (words.length > maxLines * 10) {
        return words.slice(0, maxLines * 10).join(" ") + " ...";
      }
      return text;
    };

    const handleArticleClick = (id) => {
      navigate(`/blog1/${id}`);
    };
    
    const clearFilter = () => {
      setActiveCategory(null);
    };
    const filteredArticles = articles.filter(article =>
      article.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.contenu.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const createArticle = () => {
      navigate('/adminadd');
    };

    return (
        <div className="min-h-screen bg-white">
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
    
          <div className="flex max-w-7xl mx-auto px-6 py-8 gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">Blog</h1>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher"
                    className="w-full px-4 py-2 border rounded-lg pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
    
              <p className="text-gray-600 mb-8">
                Acquérez de nouvelles connaissances et laissez-vous inspirer par des articles sur la tech rédigés par des experts et des professionnels de la programmation, du design, du devops, et bien d'autres domaines connexes.
              </p>
    
              {/* Filter Card */}
              {activeCategory && (
                <div className="active-filter-badge">
                  <span className="active-filter-text">{activeCategory}</span>
                  <button onClick={clearFilter} className="clear-filter-button">
                    <svg 
                      className="clear-filter-icon" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>
              )}
    
              {/* Articles List */}
<div className="space-y-6">
  {filteredArticles.length > 0 ? (
    filteredArticles.map((article) => (
      <div
        key={article.id}
        className="border rounded-lg p-6 flex flex-col cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => handleArticleClick(article.id)}
      >
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            {article.titre} {formatDate(article.date_publication)}
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            {truncateText(article.contenu)}
          </p>

          <div className="flex gap-2 flex-wrap mt-3">
            {article.categories && article.categories.length > 0 ? (
              article.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-medium hover:bg-gray-50"
                >
                  {category}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">Aucune catégorie</span>
            )}
          </div>
        </div>
        <div className="w-64 h-48">
          <img
            src={article.image}
            alt={article.titre}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center">Aucun article trouvé.</p>
  )}
</div>

            </div>
    
            {/* Sidebar */}
            <div className="w-80">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Recherchez par thème</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div
                    key={category.id}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-white cursor-pointer ${
                      activeCategory === category.nom ? 'bg-white' : ''
                    }`}
                    onClick={() => setActiveCategory(category.nom)}
                  >
                    <div>
                      <p className="font-medium">{category.nom}</p>
                      <p className="text-sm text-gray-500">{category.nombre_article} articles</p>
                    </div>
                    <button className="ml-auto text-gray-400 hover:text-blue-500 transition-all duration-200 ease-in-out transform hover:scale-110">
                      <svg
                        width="20" height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                      >
                        <path 
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default Admin;