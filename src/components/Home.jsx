import React, { useState, useEffect } from 'react';
import './styles/home.css';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8000/api';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const truncateText = (text, maxLines = 2) => {
    const words = text.split(" ");
    if (words.length > maxLines * 10) {
      return words.slice(0, maxLines * 10).join(" ") + " ...";
    }
    return text;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesRes, categoriesRes] = await Promise.all([
          fetch(`${API_URL}/articles/${activeCategory ? `?category=${activeCategory}` : ''}`).then(res => res.json()),
          fetch(`${API_URL}/categories/`).then(res => res.json())
        ]);
        setArticles(articlesRes);
        setCategories(categoriesRes);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [activeCategory]);

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

  const handleArticleClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const clearFilter = () => {
    setActiveCategory(null);
  };

  // Filtrage des articles en fonction du texte de recherche
  const filteredArticles = articles.filter(article =>
    article.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.contenu.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
              filteredArticles.map(article => (
                <div 
                  key={article.id} 
                  className="border rounded-lg p-6 flex gap-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      {article.titre} {formatDate(article.date_publication)}
                    </h2>
                    <p className="text-gray-600 mb-4">{truncateText(article.contenu)}</p>
                    <div className="flex gap-2">
                      {article.categories?.map(cat => (
                        <span key={cat.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {cat.nom}
                        </span>
                      ))}
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
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
};

export default Blog;
