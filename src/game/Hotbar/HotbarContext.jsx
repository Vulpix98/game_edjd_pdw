// HotbarContext.jsx
import React, { createContext, useState, useContext } from 'react';
import eventEmitter from '../EventEmitter';

const HotbarContext = createContext();

export const HotbarProvider = ({ children }) => {
  const [hotbarItems, setHotbarItems] = useState(Array(5).fill(null));
  const [selectedSlot, setSelectedSlot] = useState(0); // Novo estado para rastrear o slot selecionado

  const addItemToHotbar = (item, index) => {
    const updatedHotbar = [...hotbarItems];
    updatedHotbar[index] = item; // Adiciona o item no índice fornecido
    setHotbarItems(updatedHotbar);
  };

  const selectSlot = (index) => {
    setSelectedSlot(index);
    const selectedItem = hotbarItems[index]; // Obtém o item do slot selecionado

    eventEmitter.emit('slotSelected', { slotIndex: index, item: selectedItem });
  };

  return (
    <HotbarContext.Provider 
      value={{ 
        hotbarItems, 
        addItemToHotbar,
        setHotbarItems,
        selectedSlot,
        selectSlot,
      }}
    >
      {children}
    </HotbarContext.Provider>
  );
};

export const useHotbar = () => useContext(HotbarContext);

export default HotbarContext;
