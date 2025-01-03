import React, { createContext, useState, useContext } from 'react';
import eventEmitter from '../EventEmitter'; // Certifique-se de importar o eventEmitter
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
    // Emitir evento de verificação dos itens (1º evento)
    eventEmitter.emit('check-has-items', inputItems, inventoryItems);

    // Emitir evento de atualização do inventário (2º evento)
    eventEmitter.emit('update-inventory', inputItems, inventoryItems, setInventoryItems);

    // Emitir evento de atualização da hotbar (3º evento)
    eventEmitter.emit('update-hotbar', inputItems, hotbarItems, setHotbarItems);

    // Adicionar item craftado ao inventário
    addItemToInventory(outputItem);
  
    // Adicionar o item craftado à hotbar no primeiro slot vazio
    const updatedHotbar = [...hotbarItems];
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
