// NPC.jsx
import React, { useContext, useEffect, useState } from 'react';
import InventoryContext from '../Inventory/InventoryContext';
import HotbarContext from '../Hotbar/HotbarContext';
import ItemList from '../Items/ItemList';
import eventEmitter from '../EventEmitter';
import "./npc.css";

const NPC = () => {
    const { inventoryItems, craftWithNPC } = useContext(InventoryContext);
    const { addItemToHotbar } = useContext(HotbarContext);
    const [isNPCVisible, setIsNPCVisible] = useState(false);
    const [npcMessage, setNpcMessage] = useState(null);

    const recipes = [
        {
            input: [
                { type: 'wood', quantity: 4 },
                { type: 'stone', quantity: 2 },
            ],
            output: { type: 'crafting', quantity: 1 },
        },
    ];

    const handleCraft = (recipe) => {
        const success = craftWithNPC(recipe.input, recipe.output);
        if (success) {
            alert(`Você criou: ${recipe.output.type}`);
            // Emitir evento para reduzir vida ao coletar recurso
            eventEmitter.emit('change-wealth', { amount: 10 }); 
            eventEmitter.emit('change-life', { amount: -6 });
        } else {
            alert('Você não possui os itens necessários.');
        }
    };

    useEffect(() => {
        const handleInteraction = (data, state) => {
            setNpcMessage(data.message);
            eventEmitter.emit('npc-visible', state);
        };

        // Registrar ouvintes para abrir e fechar o NPC
        eventEmitter.on('npc-interaction', handleInteraction);

        // Limpar ouvintes ao desmontar
        return () => {
            eventEmitter.removeListener('npc-interaction', handleInteraction);
        };
    }, []);

    useEffect(() => {
        const handleVisible = (state) => {
            setIsNPCVisible(state);
        };

        eventEmitter.on('npc-visible', handleVisible);

        return () => {
            eventEmitter.removeListener('npc-visible', handleVisible);
        };
    }, []);

    if (!isNPCVisible) {
        return null;
    }

    return (
        <div className="npc">
            <h2 className="center">NPC de Crafting</h2>
            {npcMessage && <p className="center">{npcMessage}</p>}
            <button id="close" onClick={() => setIsNPCVisible(false)}>X</button>
            <h3 className="center">Suas Receitas:</h3>
            {recipes.map((recipe, index) => (
                <div key={index} className="recipe column center ">
                    <ItemList items={recipe.input} />
                    <button className="craftB_NPC"  onClick={() => handleCraft(recipe)}>Craftar</button>
                </div>
            ))}
        </div>
    );
};

export default NPC;
