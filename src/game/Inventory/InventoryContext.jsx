// InventoryContext.jsx
import React, { createContext, useState, useContext } from 'react';
import HotbarContext from '../Hotbar/HotbarContext';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const { hotbarItems, addItemToHotbar, setHotbarItems } = useContext(HotbarContext); // Acessa o hotbarItems
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

  const craftWithNPC = (inputItems, outputItem) => {
    const hasItems = inputItems.every((input) => {
      const item = inventoryItems.find((i) => i.type === input.type);
      return item && item.quantity >= input.quantity;
    });
  
    if (!hasItems) {
      return false;
    }
  
    // Atualiza o inventário
    const updatedInventory = inventoryItems
      .map((item) => {
        const input = inputItems.find((i) => i.type === item.type);
        if (input) {
          return { ...item, quantity: item.quantity - input.quantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
  
    setInventoryItems(updatedInventory);
  
    // Atualiza a hotbar
    const updatedHotbar = hotbarItems.map((slot) => {
      if (!slot) return null; // Ignora slots vazios
      const input = inputItems.find((i) => i.type === slot.type);
      if (input) {
        const remainingQuantity = slot.quantity - input.quantity;
        return remainingQuantity > 0
          ? { ...slot, quantity: remainingQuantity }
          : null; // Remove o item se quantidade <= 0
      }
      return slot;
    });
  
    setHotbarItems(updatedHotbar); // Atualiza a hotbar
  
    // Adiciona o item craftado ao inventário
    addItemToInventory(outputItem);
  
    // Adiciona o item craftado à hotbar no primeiro slot vazio
    const firstEmptySlot = updatedHotbar.findIndex((slot) => slot === null);
    if (firstEmptySlot !== -1) {
      updatedHotbar[firstEmptySlot] = outputItem;
      setHotbarItems(updatedHotbar); // Atualiza novamente para incluir o item craftado
    }
  
    return true;
  };

  return (
    <InventoryContext.Provider
      value={{
        isInventoryOpen,
        setIsInventoryOpen,
        inventoryItems,
        addItemToInventory,
        craftWithNPC,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);

export default InventoryContext;
