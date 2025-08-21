package com.example.backend.service;

import com.example.backend.dal.PokemonRepository;
import com.example.backend.model.Pokemon;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PokemonService {
    private final PokemonRepository repository;

    public PokemonService(PokemonRepository repository) {
        this.repository = repository;
    }

    public List<Pokemon> getAllPokemon() {
        return repository.findAll();
    }

    public Optional<Pokemon> getPokemonById(Long id) {
        return repository.findById(id);
    }

    public Pokemon savePokemon(Pokemon pokemon) {
        return repository.save(pokemon);
    }

    public Pokemon updatePokemon(Long id, Pokemon newData) {
        return repository.findById(id)
                .map(pokemon -> {
                    pokemon.setName(newData.getName());
                    pokemon.setType(newData.getType());
                    pokemon.setLevel(newData.getLevel());
                    return repository.save(pokemon);
                })
                .orElseThrow(() -> new RuntimeException("Pokemon not found with id " + id));
    }

    public void deletePokemon(Long id) {
        repository.deleteById(id);
    }
}
