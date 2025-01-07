import React, { createContext, useState, useContext } from 'react';
import { useInventory } from '../Inventory/InventoryContext';  // Importa o contexto de inventário
import eventEmitter from '../EventEmitter';

const CraftingTableContext = createContext();

export const CraftingTableProvider = ({ children }) => {
    const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(3).fill(null))); // Matriz 3x3 vazia
    const { addItemToInventory } = useInventory();  // Acessa a função para adicionar item ao inventário

    // Lógica para verificar combinações de itens reais
    const checkCombination = () => {
        const combinationKey = matrix.flat().map(item => item ? item.type : 'null').join('-'); // Cria a chave da combinação

        const recipes = {
            'stone-stone-stone-null-wood-null-null-wood-null': 'stone_pickaxe', // Exemplo de receita
            'stone-stone-null-stone-wood-null-null-wood-null': 'stone_axe',
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
            addItemToInventory({ type: result, quantity: 1 }); // Adiciona o item criado ao inventário
            eventEmitter.emit('change-wealth', { amount: 5 }); 
            eventEmitter.emit('change-life', { amount: -5 });
            return result; // Retorna o item criado
        }
        return null; // Retorna null caso não haja combinação válida
    };

    return (
        <CraftingTableContext.Provider value={{ matrix, setMatrix, craftItem }}>
            {children}
        </CraftingTableContext.Provider>
    );
};

export const useCraftingTable = () => useContext(CraftingTableContext);
