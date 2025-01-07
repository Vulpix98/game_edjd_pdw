// CraftingTableContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Contexto
const CraftingTableContext = createContext();

// Provedor
export const CraftingTableProvider = ({ children }) => {
    const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(3).fill(null))); // Matriz 3x3 vazia
    const [inventory, setInventory] = useState(['wood', 'stone']); // Exemplo de inventário com itens reais

    // Lógica para verificar combinações de itens reais
    const checkCombination = () => {
        const combinationKey = matrix.flat().join('-'); // Exemplo: 'wood-stone-iron-null-null...'
        const recipes = {
            'stone-stone-stone-null-wood-null-null-wood-null': 'stone_pickaxe', // Exemplo de receita
        };

        if (recipes[combinationKey]) {
            return recipes[combinationKey]; // Retorna o item criado
        }
        return null;
    };

    // Função para craftar
    const craftItem = () => {
        const result = checkCombination();
        if (result) {
            setMatrix(Array(3).fill().map(() => Array(3).fill(null))); // Limpa a matriz após craftar
            return result; // Retorna o item criado
        }
        return null;
    };

    // Função para adicionar item ao inventário
    const addItemToInventory = (item) => {
        setInventory((prev) => [...prev, item]); // Adiciona um item no inventário
    };

    return (
        <CraftingTableContext.Provider value={{ matrix, setMatrix, inventory, setInventory, addItemToInventory, craftItem }}>
            {children}
        </CraftingTableContext.Provider>
    );
};

// Hook para usar o contexto
export const useCraftingTable = () => useContext(CraftingTableContext);
