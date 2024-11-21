// InventoryContext.jsx
import React, { createContext, useState, useContext } from 'react';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);

  const recipes = [
    { input: ['wood', 'stone'], output: { type: 'axe', quantity: 1 } },
  ];

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

  return (
    <InventoryContext.Provider
      value={{
        isInventoryOpen,
        setIsInventoryOpen,
        inventoryItems,
        addItemToInventory,
        combineItems,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

export default InventoryContext;

