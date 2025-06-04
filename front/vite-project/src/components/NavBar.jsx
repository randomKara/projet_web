import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(!!userId);
  }, []);

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <nav style={{ 
      backgroundColor: '#343a40', 
      padding: '15px 20px',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link 
          to="/" 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '20px', 
            fontWeight: 'bold' 
          }}
        >
          📚 Ma Bibliothèque
        </Link>
        
        <ul style={{ 
          display: 'flex', 
          listStyle: 'none', 
          margin: 0, 
          padding: 0,
          gap: '20px'
        }}>
          <li>
            <Link 
              to="/" 
              style={{ 
                color: 'white', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background-color 0.3s'
              }}
            >
              Accueil
            </Link>
          </li>
          
          {isLoggedIn ? (
            <>
              <li>
                <Link 
                  to="/profile" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px'
                  }}
                >
                  Mon Profil
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout}
                  style={{ 
                    background: 'none',
                    border: '1px solid white',
                    color: 'white', 
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px'
                  }}
                >
                  Connexion
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  style={{ 
                    backgroundColor: '#007bff',
                    color: 'white', 
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px'
                  }}
                >
                  S'inscrire
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;