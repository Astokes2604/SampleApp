import React, { useEffect, useState } from 'react';
import './Page.css';

function Gallery() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [formMode, setFormMode] = useState(null); // "create" | "update"
    const [formData, setFormData] = useState({ name: '', abilities: '', imageUrl: '' });
    const pageSize = 21;
    const maxPokemon = 1025;
    const totalPages = Math.ceil(maxPokemon / pageSize);

    const fetchPokemonList = () => {
        fetch(`http://localhost:8080/api/pokemon/list?page=${currentPage}`)
            .then(res => res.json())
            .then(data => setPokemonList(data.results));
    };

    useEffect(() => {
        fetchPokemonList();
    }, [currentPage]);

    const handleClick = async (name) => {
        const res = await fetch(`http://localhost:8080/api/pokemon/${name}`);
        const data = await res.json();
        setSelectedPokemon(data);
        setFormMode(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this Pokémon?")) {
            await fetch(`http://localhost:8080/api/pokemon/${id}`, { method: 'DELETE' });
            setSelectedPokemon(null);
            fetchPokemonList();
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const abilitiesArray = formData.abilities.split(',').map(a => ({ ability: { name: a.trim() } }));

        const payload = {
            name: formData.name,
            abilities: abilitiesArray,
            image: { front_default: formData.imageUrl }
        };

        if (formMode === 'create') {
            await fetch(`http://localhost:8080/api/pokemon`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else if (formMode === 'update' && selectedPokemon) {
            await fetch(`http://localhost:8080/api/pokemon/${selectedPokemon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        setFormMode(null);
        setFormData({ name: '', abilities: '', imageUrl: '' });
        fetchPokemonList();
    };

    return (
        <div className="page demon-page">
            <h1 className="demon-heading">Pokémon Gallery</h1>

            {selectedPokemon && !formMode && (
                <div className="selected-pokemon-container">
                    <div className="pokemon-card demon-shadow">
                        <h2 className="pokemon-name">
                            {selectedPokemon.name} #{selectedPokemon.id}
                        </h2>
                        <img src={selectedPokemon.image.front_default} alt={selectedPokemon.name} />
                        <div className="pokemon-details">
                            <h3>Abilities:</h3>
                            <ul>
                                {selectedPokemon.abilities.map((a, i) => (
                                    <li className="pokemon-detail-item" key={i}>
                                        {a.ability.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => {
                                setFormMode('update');
                                setFormData({
                                    name: selectedPokemon.name,
                                    abilities: selectedPokemon.abilities.map(a => a.ability.name).join(', '),
                                    imageUrl: selectedPokemon.image.front_default
                                });
                            }}>Edit</button>
                            <button onClick={() => handleDelete(selectedPokemon.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {formMode && (
                <form onSubmit={handleFormSubmit} style={{ marginTop: '20px' }}>
                    <h2>{formMode === 'create' ? 'Add New Pokémon' : 'Edit Pokémon'}</h2>
                    <label>Name:</label>
                    <input name="name" value={formData.name} onChange={handleFormChange} required />
                    <label>Abilities (comma separated):</label>
                    <input name="abilities" value={formData.abilities} onChange={handleFormChange} required />
                    <label>Image URL:</label>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} required />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setFormMode(null)} style={{ marginLeft: '10px' }}>Cancel</button>
                </form>
            )}

            <div style={{ margin: '20px 0' }}>
                <button onClick={() => { setFormMode('create'); setFormData({ name: '', abilities: '', imageUrl: '' }); }}>Add Pokémon</button>
            </div>

            <div className="gallery-container">
                {pokemonList.map((poke, i) => (
                    <div className="pokemon-card demon-shadow" key={i} onClick={() => handleClick(poke.name)}>
                        <p className="pokemon-name">{poke.name}</p>
                    </div>
                ))}
            </div>

            <div className="pagination-container">
                <button
                    className="pagination-button demon-shadow"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    ←
                </button>
                <span className="pagination-page-number">Page {currentPage} of {totalPages}</span>
                <button
                    className="pagination-button demon-shadow"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    →
                </button>
            </div>
        </div>
    );
}

export default Gallery;
