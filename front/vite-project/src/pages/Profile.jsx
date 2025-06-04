import React, { useState, useEffect } from 'react';

const Profile = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [livresUtilisateur, setLivresUtilisateur] = useState([]);
    const [statistiques, setStatistiques] = useState({
        total: 0,
        aLire: 0,
        enCours: 0,
        lu: 0,
        totalPages: 0,
        averageRating: 0
    });

    useEffect(() => {
        const id = localStorage.getItem('userId');
        const email = localStorage.getItem('userEmail');

        if (id) {
            chargerInfosUtilisateur(id);
            recupererLivres(id);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const chargerInfosUtilisateur = async (id) => {
        try {
            const res = await fetch(`http://localhost:1234/users/${id}`);
            const data = await res.json();
            if (res.ok) {
                setUtilisateur(data.data.user);
            }
        } catch (err) {
            console.error('Erreur en chargeant les infos utilisateur', err);
        }
    };

    const recupererLivres = async (id) => {
        try {
            const res = await fetch(`http://localhost:1234/books/user/${id}`);
            const data = await res.json();
            if (res.ok) {
                const livres = data.data.books;
                setLivresUtilisateur(livres);
                calculerStats(livres);
            }
        } catch (err) {
            console.error('Erreur en chargeant les livres', err);
        }
    };

    const calculerStats = (livres) => {
        const total = livres.length;
        const aLire = livres.filter(l => l.status === 'À lire').length;
        const enCours = livres.filter(l => l.status === 'En cours').length;
        const lu = livres.filter(l => l.status === 'Lu').length;
        const totalPages = livres.reduce((acc, l) => acc + (l.pages || 0), 0);

        const notes = livres.filter(l => l.rating);
        const moyenne = notes.length > 0
            ? (notes.reduce((acc, l) => acc + l.rating, 0) / notes.length).toFixed(1)
            : 0;

        setStatistiques({
            total,
            aLire,
            enCours,
            lu,
            totalPages,
            averageRating: moyenne
        });
    };

    if (!utilisateur) {
        return <div style={{ padding: '20px' }}>Chargement...</div>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>👤 Mon Profil</h1>

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2>Informations personnelles</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div><strong>Nom:</strong> {utilisateur.name}</div>
                    <div><strong>Email:</strong> {utilisateur.email}</div>
                    {utilisateur.age && <div><strong>Âge:</strong> {utilisateur.age} ans</div>}
                    <div><strong>Membre depuis:</strong> {new Date(utilisateur.created_at).toLocaleDateString()}</div>
                </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
                <h2>📊 Mes statistiques de lecture</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                    <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#1976d2' }}>{statistiques.total}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>Livres total</p>
                    </div>
                    <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#f57c00' }}>{statistiques.aLire}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>À lire</p>
                    </div>
                    <div style={{ backgroundColor: '#fff8e1', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#fbc02d' }}>{statistiques.enCours}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>En cours</p>
                    </div>
                    <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#388e3c' }}>{statistiques.lu}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>Terminés</p>
                    </div>
                    <div style={{ backgroundColor: '#f3e5f5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '10px', color: '#7b1fa2' }}>{statistiques.totalPages}</h3>
                        <p style={{ margin: 0, fontSize: '14px' }}>Pages totales</p>
                    </div>
                    {statistiques.averageRating > 0 && (
                        <div style={{ backgroundColor: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
                            <h3 style={{ marginBottom: '10px', color: '#ff9800' }}>{statistiques.averageRating}/5</h3>
                            <p style={{ margin: 0, fontSize: '14px' }}>Note moyenne</p>
                        </div>
                    )}
                </div>
            </div>

            {livresUtilisateur.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <h2>📚 Mes genres préférés</h2>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        {Object.entries(
                            livresUtilisateur.reduce((acc, livre) => {
                                acc[livre.genre] = (acc[livre.genre] || 0) + 1;
                                return acc;
                            }, {})
                        )
                        .sort(([, a], [, b]) => b - a)
                        .map(([genre, count]) => (
                            <div key={genre} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <span>{genre}</span>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: `${(count / statistiques.total) * 100}px`,
                                        height: '20px',
                                        backgroundColor: '#007bff',
                                        marginRight: '10px',
                                        borderRadius: '4px'
                                    }}></div>
                                    <span>{count} livre{count > 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {livresUtilisateur.length > 0 && (
                <div>
                    <h2>📖 Mes derniers livres</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {livresUtilisateur
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .slice(0, 5)
                            .map((livre) => (
                                <div key={livre._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '5px' }}>{livre.title}</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>par {livre.author}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '12px',
                                            backgroundColor: livre.status === 'Lu' ? '#d4edda' : livre.status === 'En cours' ? '#fff3cd' : '#f8d7da',
                                            color: livre.status === 'Lu' ? '#155724' : livre.status === 'En cours' ? '#856404' : '#721c24'
                                        }}>
                                            {livre.status}
                                        </span>
                                        {livre.rating && <div style={{ marginTop: '5px' }}>{'⭐'.repeat(livre.rating)}</div>}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {livresUtilisateur.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <h3>Aucun livre dans votre bibliothèque</h3>
                    <p>Ajoutez-en quelques-uns pour voir vos statistiques ici.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
