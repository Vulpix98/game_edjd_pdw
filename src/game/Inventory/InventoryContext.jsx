import React, { createContext,useEffect, useState, useContext } from 'react';
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


  // Escutando o evento update-inventory  -> 2º
  useEffect(() => {
    const handleInventoryUpdate = (inputItems, inventoryItems) => {
      const updatedInventory = inventoryItems
        .map((item) => {
          const input = inputItems.find((i) => i.type === item.type);
          if (input) {
            return { ...item, quantity: item.quantity - input.quantity }; // Decrementa o item
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove itens com quantidade <= 0

      setInventoryItems(updatedInventory); // Atualiza o inventário
      // console.log('Inventário atualizado 222 :', updatedInventory);
    };

    eventEmitter.on('update-inventory', handleInventoryUpdate);

    return () => {
      eventEmitter.removeListener('update-inventory', handleInventoryUpdate);
    };
  }, []);

  // Escutando o evento update-hotbar  -> 3º
  useEffect(() => {
    const handleHotbarUpdate = (inputItems, hotbarItems) => {
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
      // console.log('Hotbar atualizada:', updatedHotbar);
    };

    eventEmitter.on('update-hotbar', handleHotbarUpdate);

    return () => {
      eventEmitter.removeListener('update-hotbar', handleHotbarUpdate);
    };
  }, []);


  // Emitir evento com o inventário atualizado
  useEffect(() => {
    const handleGetInventoryRequest = (callback) => {
      // Chama o callback com os itens do inventário
      callback(inventoryItems);
    };
  
    eventEmitter.on('get-inventory', handleGetInventoryRequest);
  
    return () => {
      eventEmitter.removeListener('get-inventory', handleGetInventoryRequest);
    };
  }, [inventoryItems]);


  // Emitir evento com a hotbar atualizado
  useEffect(() => {
    const handleGetHotbarRequest = (callback) => {
      // Chama o callback com os itens da hotbar
      callback(hotbarItems);
    };
  
    eventEmitter.on('get-hotbar', handleGetHotbarRequest);
  
    return () => {
      eventEmitter.removeListener('get-hotbar', handleGetHotbarRequest);
    };
  }, [hotbarItems]);
  



  const craftWithNPC = (inputItems, outputItem) => {
    const hasItems = inputItems.every((input) => {
      const item = inventoryItems.find((i) => i.type === input.type);
      return item && item.quantity >= input.quantity;
    });
  
    if (!hasItems) {
      return false;
    }

    // Emitir evento de atualização do inventário (2º evento)
    eventEmitter.emit('update-inventory', inputItems, inventoryItems, setInventoryItems);

    // Emitir evento de atualização da hotbar (3º evento)
    eventEmitter.emit('update-hotbar', inputItems, hotbarItems);

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
