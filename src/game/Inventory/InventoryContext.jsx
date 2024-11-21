// InventoryContext.jsx
import React, { createContext, useState, useContext } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  const addItemToInventory = (item) => {
    setInventoryItems((prevItems) => {
      const existingItem = prevItems.find((invItem) => invItem.type === item.type);
      if (existingItem) {
        return prevItems.map((invItem) =>
          invItem.type === item.type
          ? { ...invItem, quantity: invItem.quantity + item.quantity }
          : invItem
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const combineItems = (itemsToCombine) => {
    const recipe = recipes.find((recipe) =>
      recipe.input.every((input) =>
        itemsToCombine.some((item) => item.type === input),
      )
    );

    if (recipe) {
      // Remover os itens usados da lista
      setInventoryItems((prevItems) =>
        prevItems.map((item) => {
          if (recipe.input.includes(item.type)) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }).filter((item) => item.quantity > 0)
      );

      // Adicionar o item resultante
      addItemToInventory(recipe.output);
    } else {
      console.log('Nenhuma combinação válida encontrada!');
    }
  };

  const craftWithNPC = (inputItems, outputItem) => {
    // Verifica se todos os itens necessários estão disponíveis
    const hasItems = inputItems.every((input) => {
      const item = inventoryItems.find((i) => i.type === input.type);
      return item && item.quantity >= input.quantity;
    });
  
    if (!hasItems) {
      return false; // Falha ao craftar
    }
  
    // Remove os itens usados do inventário
    const updatedInventory = inventoryItems
      .map((item) => {
        const input = inputItems.find((i) => i.type === item.type);
        if (input) {
          return { ...item, quantity: item.quantity - input.quantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0); // Remove itens com quantidade 0
  
    setInventoryItems(updatedInventory);
  
    // Adiciona o item craftado ao inventário
    addItemToInventory(outputItem);
  
    return true; // Sucesso ao craftar
  };

  return (
    <InventoryContext.Provider
      value={{
        isInventoryOpen,
        setIsInventoryOpen,
        inventoryItems,
        addItemToInventory,
        combineItems,
        craftWithNPC,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

export default InventoryContext;

