import React, { useState } from 'react';

const Login = () => {
    const [identifiants, setIdentifiants] = useState({
        email: '',
        password: ''
    });

    const gererChangement = (e) => {
        setIdentifiants({
            ...identifiants,
            [e.target.name]: e.target.value
        });
    };

    const gererConnexion = async (e) => {
        e.preventDefault();

        try {
            const requete = await fetch('http://localhost:1234/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(identifiants)
            });

            const resultat = await requete.json();

            if (requete.ok) {
                alert('Connexion réussie !');
                localStorage.setItem('userId', resultat.data.user._id);
                localStorage.setItem('userEmail', resultat.data.user.email);
                window.location.href = '/';
            } else {
                alert('Erreur : ' + resultat.error);
            }
        } catch (erreur) {
            alert('Erreur de connexion au serveur');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
            <h1>Connexion</h1>
            <form onSubmit={gererConnexion}>
                <div style={{ marginBottom: '15px' }}>
                    <label>Email :</label>
                    <input
                        type="email"
                        name="email"
                        value={identifiants.email}
                        onChange={gererChangement}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        name="password"
                        value={identifiants.password}
                        onChange={gererChangement}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    Se connecter
                </button>
            </form>
        </div>
    );
};

export default Login;
