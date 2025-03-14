import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email,
        password
      });
      
      // Vérification si la réponse contient un token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Stocke toutes les informations de l'utilisateur
        localStorage.setItem('userId', response.data.user.id); 
        navigate('/adminhome');
      } else {
        setError('Aucun token reçu');
        console.error('Aucun token reçu');
      }
    } catch (error) {
      setError('Erreur de connexion : ' + error.response?.data?.error || error.message);
      console.error('Erreur de connexion:', error);
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-text"></span>
          </div>
          <h2 className="brand-name">Kimbiiz</h2>
        </div>
        
        <h1 className="login-title">Connectez-vous</h1>
        <p className="login-subtitle">Entrez vos identifiants pour accéder à votre compte</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Me connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
