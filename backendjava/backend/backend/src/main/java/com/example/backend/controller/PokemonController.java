package com.example.backend.controller;

import com.example.backend.model.Pokemon;
import com.example.backend.service.PokemonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/pokemon")
@CrossOrigin(origins = "*")
public class PokemonController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final int PAGE_SIZE = 21;
    private final int MAX_POKEMON = 1025;

    private final PokemonService service;

    public PokemonController(PokemonService service) {
        this.service = service;
    }

    // ------------------------------
    // Existing endpoints from PokéAPI
    // ------------------------------

    @GetMapping("/list")
    public ResponseEntity<?> getPokemonList(@RequestParam(defaultValue = "1") int page) {
        if (page < 1) page = 1;

        int offset = (page - 1) * PAGE_SIZE;

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
    // CRUD: My Pokémon Collection (DB)
    // ------------------------------

    // Create
    @PostMapping("/my")
    public ResponseEntity<Pokemon> addPokemon(@RequestBody Pokemon pokemon) {
        return ResponseEntity.ok(service.savePokemon(pokemon));
    }

    // Read All
    @GetMapping("/my")
    public ResponseEntity<List<Pokemon>> getAllMyPokemon() {
        return ResponseEntity.ok(service.getAllPokemon());
    }

    // Read One
    @GetMapping("/my/{id}")
    public ResponseEntity<Pokemon> getMyPokemonById(@PathVariable Long id) {
        return service.getPokemonById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update
    @PutMapping("/my/{id}")
    public ResponseEntity<Pokemon> updateMyPokemon(@PathVariable Long id, @RequestBody Pokemon updatedPokemon) {
        try {
            return ResponseEntity.ok(service.updatePokemon(id, updatedPokemon));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete
    @DeleteMapping("/my/{id}")
    public ResponseEntity<?> deleteMyPokemon(@PathVariable Long id) {
        try {
            service.deletePokemon(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
