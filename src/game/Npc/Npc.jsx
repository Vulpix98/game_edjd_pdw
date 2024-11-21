import React, { useContext, useEffect, useState } from 'react';
import InventoryContext from '../Inventory/InventoryContext';
import ItemList from '../Items/ItemList';
import eventEmitter from '../EventEmitter';

const NPC = () => {
    const { inventoryItems, craftWithNPC } = useContext(InventoryContext);
    const [isNPCVisible, setIsNPCVisible] = useState(false);
    const [npcMessage, setNpcMessage] = useState(null);

    const recipes = [
        {
            input: [
                { type: 'wood', quantity: 4 },
                { type: 'stone', quantity: 2 },
            ],
            output: { type: 'Crafting Table', quantity: 1 },
        },
    ];

    const handleCraft = (recipe) => {
        const success = craftWithNPC(recipe.input, recipe.output);
        if (success) {
            alert(`Você criou: ${recipe.output.type}`);
        } else {
            alert('Você não possui os itens necessários.');
        }
    };
  
    useEffect(() => {
        const handleInteraction = (data) => {
            setNpcMessage(data.message);
            setIsNPCVisible(true);
        };
  
        const handleClose = () => {
            setIsNPCVisible(false);
        };
  
        // Registrar ouvintes para abrir e fechar o NPC
        eventEmitter.on('npc-interaction', handleInteraction);
        eventEmitter.on('npc-close', handleClose);
  
        // Limpar ouvintes ao desmontar
        return () => {
            eventEmitter.removeListener('npc-interaction', handleInteraction);
            eventEmitter.removeListener('npc-close', handleClose);
        };
    }, []);
  
    if (!isNPCVisible) {
      return null;
    }
  
    return (
      <div className="npc">
        <h2>NPC de Crafting</h2>
        {npcMessage && <p>{npcMessage}</p>}
        <button onClick={() => setIsNPCVisible(false)}>Fechar</button>
        <h3>Suas Receitas:</h3>
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe">
            <ItemList items={recipe.input} />
            <button onClick={() => handleCraft(recipe)}>Craftar</button>
          </div>
        ))}
      </div>
    );
};
  
export default NPC;