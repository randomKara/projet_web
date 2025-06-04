import React, { useState, useEffect } from 'react';

const Home = () => {
    const [booksList, updateBooksList] = useState([]);
    const [isUserLoggedIn, updateLoginStatus] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [formVisible, toggleFormVisible] = useState(false);
    const [bookDetails, setBookDetails] = useState({
        title: '',
        author: '',
        genre: 'Fiction',
        pages: '',
        status: 'À lire',
        rating: ''
    });

    useEffect(() => {
        // Checking if user info is saved in local storage (on refresh for example)
        const savedId = localStorage.getItem('userId');
        if (savedId) {
            updateLoginStatus(true);
            setCurrentUserId(savedId);
            fetchUserBooks(savedId);
        }
    }, []);

    const fetchUserBooks = async (uid) => {
        try {
            const res = await fetch(`http://localhost:1234/books/user/${uid}`);
            const json = await res.json();
            if (res.ok) {
                updateBooksList(json?.data?.books || []);
            }
        } catch (err) {
            console.error('Erreur recup des livres:', err);
        }
    };

    const handleAddBook = async (event) => {
        event.preventDefault();

        const preparedBook = {
            ...bookDetails,
            userId: currentUserId,
            pages: parseInt(bookDetails.pages, 10) || 0,
            rating: bookDetails.rating ? parseInt(bookDetails.rating) : null
        };

        try {
            const addRes = await fetch('http://localhost:1234/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preparedBook)
            });

            if (addRes.ok) {
                setBookDetails({
                    title: '',
                    author: '',
                    genre: '',
                    pages: '',
                    status: 'À lire',
                    rating: ''
                });
                toggleFormVisible(false);  // Hide form after adding
                fetchUserBooks(currentUserId); // Refresh list
                alert('Livre ajouté avec succès.');
            } else {
                alert('Ajout échoué...');
            }
        } catch (err) {
            console.warn('Erreur réseau ? Vérifier le serveur', err);
            alert('Erreur lors de l\'ajout.');
        }
    };

    const removeBook = async (bookId) => {
        const confirmed = window.confirm('Supprimer ce livre ?');
        if (!confirmed) return;

        try {
            const delRes = await fetch(`http://localhost:1234/books/${bookId}`, {
                method: 'DELETE'
            });

            if (delRes.ok) {
                fetchUserBooks(currentUserId);
                alert('Livre supprimé.');
            } else {
                alert('Erreur lors de la suppression.');
            }
        } catch (e) {
            console.error('Suppression échouée:', e);
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        updateLoginStatus(false);
        updateBooksList([]);
        setTimeout(() => window.location.reload(), 100); 
    };

    if (!isUserLoggedIn) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>📚 Ma Bibliothèque Perso</h1>
                <p>Connectez-vous pour accéder à vos livres.</p>
                <div style={{ marginTop: '20px' }}>
                    <a href="/login" style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}>
                        Se connecter
                    </a>
                    <a href="/signup" style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px'
                    }}>
                        Créer un compte
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h1>📚 Ma Bibliothèque</h1>
                <div>
                    <button
                        onClick={() => toggleFormVisible(!formVisible)}
                        style={{
                            marginRight: '10px',
                            padding: '10px 15px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                        {formVisible ? 'Annuler' : 'Ajouter un livre'}
                    </button>
                    <button
                        onClick={logoutUser}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                        Déconnexion
                    </button>
                </div>
            </div>

            {formVisible && (
                <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>Ajout d'un nouveau livre</h3>
                    <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label>Titre *</label>
                            <input
                                type="text"
                                required
                                value={bookDetails.title}
                                onChange={(e) => setBookDetails({ ...bookDetails, title: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label>Auteur *</label>
                            <input
                                type="text"
                                required
                                value={bookDetails.author}
                                onChange={(e) => setBookDetails({ ...bookDetails, author: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label>Genre</label>
                            <select
                                value={bookDetails.genre}
                                onChange={(e) => setBookDetails({ ...bookDetails, genre: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="Fiction">Fiction</option>
                                <option value="Romance">Romance</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Science-Fiction">Science-Fiction</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Biographie">Biographie</option>
                                <option value="Histoire">Histoire</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                        <div>
                            <label>Nombre de pages</label>
                            <input
                                type="number"
                                value={bookDetails.pages}
                                onChange={(e) => setBookDetails({ ...bookDetails, pages: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div>
                            <label>Statut</label>
                            <select
                                value={bookDetails.status}
                                onChange={(e) => setBookDetails({ ...bookDetails, status: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            >
                                <option value="À lire">À lire</option>
                                <option value="En cours">En cours</option>
                                <option value="Lu">Lu</option>
                            </select>
                        </div>
                        <div>
                            <label>Note (1-5)</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={bookDetails.rating}
                                onChange={(e) => setBookDetails({ ...bookDetails, rating: e.target.value })}
                                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <button type="submit" style={{
                                padding: '10px 20px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}>
                                Ajouter
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {booksList.length === 0 ? (
                    <p>Aucun livre pour le moment. C’est vide par ici 📭</p>
                ) : (
                    booksList.map((b) => (
                        <div key={b._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: 'white' }}>
                            <h3 style={{ marginBottom: '10px', color: '#333' }}>{b.title}</h3>
                            <p><strong>Auteur:</strong> {b.author}</p>
                            <p><strong>Genre:</strong> {b.genre}</p>
                            <p><strong>Pages:</strong> {b.pages}</p>
                            <p><strong>Statut:</strong> <span style={{
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: b.status === 'Lu' ? '#d4edda' : b.status === 'En cours' ? '#fff3cd' : '#f8d7da',
                                color: b.status === 'Lu' ? '#155724' : b.status === 'En cours' ? '#856404' : '#721c24'
                            }}>{b.status}</span></p>
                            {b.rating && <p><strong>Note:</strong> {'⭐'.repeat(b.rating)}</p>}
                            <button
                                onClick={() => removeBook(b._id)}
                                style={{
                                    marginTop: '10px',
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}>
                                Supprimer
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
