package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import java.util.*;

@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final int PAGE_SIZE = 21;
    private final int MAX_POKEMON = 1025;

    // In-memory store for CRUD
    private final Map<Integer, Map<String, Object>> myPokemon = new HashMap<>();
    private int currentId = 1;

    // ------------------------------
    // Existing endpoints from PokéAPI
    // ------------------------------

    @GetMapping("/list")
    public ResponseEntity<?> getPokemonList(@RequestParam(defaultValue = "1") int page) {
        if (page < 1) page = 1;

        int offset = (page - 1) * PAGE_SIZE;

        // Clamp offset to prevent exceeding the max limit
        if (offset >= MAX_POKEMON) {
            return ResponseEntity.ok(Collections.emptyMap());
        }

        int adjustedLimit = Math.min(PAGE_SIZE, MAX_POKEMON - offset);

        String url = "https://pokeapi.co/api/v2/pokemon?offset=" + offset + "&limit=" + adjustedLimit;
        Map response = restTemplate.getForObject(url, Map.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getPokemonDetails(@PathVariable String name) {
        String url = "https://pokeapi.co/api/v2/pokemon/" + name;
        Map details = restTemplate.getForObject(url, Map.class);

        // Get evolution info
        Map species = restTemplate.getForObject((String) ((Map) details.get("species")).get("url"), Map.class);
        Map evolutionChain = restTemplate.getForObject((String) ((Map) species.get("evolution_chain")).get("url"), Map.class);

        Map<String, Object> result = new HashMap<>();
        result.put("id", details.get("id"));
        result.put("name", details.get("name"));
        result.put("image", ((Map)((Map)details.get("sprites")).get("other")).get("official-artwork"));
        result.put("abilities", details.get("abilities"));
        result.put("evolutionChain", evolutionChain);

        return ResponseEntity.ok(result);
    }

    // ------------------------------
    // CRUD: My Pokémon Collection
    // ------------------------------

    // Create
    @PostMapping("/my")
    public ResponseEntity<?> addPokemon(@RequestBody Map<String, Object> pokemon) {
        pokemon.put("id", currentId++);
        myPokemon.put((Integer) pokemon.get("id"), pokemon);
        return ResponseEntity.ok(pokemon);
    }

    // Read All
    @GetMapping("/my")
    public ResponseEntity<?> getAllMyPokemon() {
        return ResponseEntity.ok(myPokemon.values());
    }

    // Read One
    @GetMapping("/my/{id}")
    public ResponseEntity<?> getMyPokemonById(@PathVariable int id) {
        Map<String, Object> pokemon = myPokemon.get(id);
        if (pokemon == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pokemon);
    }

    // Update
    @PutMapping("/my/{id}")
    public ResponseEntity<?> updateMyPokemon(@PathVariable int id, @RequestBody Map<String, Object> updatedPokemon) {
        if (!myPokemon.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        updatedPokemon.put("id", id);
        myPokemon.put(id, updatedPokemon);
        return ResponseEntity.ok(updatedPokemon);
    }

    // Delete
    @DeleteMapping("/my/{id}")
    public ResponseEntity<?> deleteMyPokemon(@PathVariable int id) {
        if (myPokemon.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
