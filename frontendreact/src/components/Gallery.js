import React, { useEffect, useState } from 'react';
import './Page.css';

function Gallery() {
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 21;
    const maxPokemon = 1025;
    const totalPages = Math.ceil(maxPokemon / pageSize);

    useEffect(() => {
        const offset = (currentPage - 1) * pageSize;
        fetch(`http://localhost:8080/api/pokemon/list?page=${currentPage}`)
            .then(res => res.json())
            .then(data => setPokemonList(data.results));
    }, [currentPage]);

    const handleClick = async (name) => {
        const res = await fetch(`http://localhost:8080/api/pokemon/${name}`);
        const data = await res.json();
        setSelectedPokemon(data);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="page demon-page">
            <h1 className="demon-heading">Pokémon Gallery</h1>

            {selectedPokemon && (
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
                    </div>
                </div>
            )}

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
