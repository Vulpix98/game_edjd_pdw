// Hotbar.jsx
import React, { useContext, useEffect } from 'react';
import HotbarContext from './HotbarContext';
import Item from '../Items/Item';
import '../../../public/hotbar.css';

const Hotbar = () => {
  const { hotbarItems, addItemToHotbar, selectedSlot, selectSlot } = useContext(HotbarContext); // Consome o estado da hotbar do contexto

  const handleDrop = (index, item) => {
    addItemToHotbar(item, index); // Atualiza o estado da hotbar no contexto
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveItem = (index) => {
    addItemToHotbar(null, index); // Remove o item do slot no contexto
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '5') {
        selectSlot(Number(e.key) - 1); // Atualiza o slot selecionado
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectSlot]);
  
  return (
    <div className="hotbar">
      {hotbarItems.map((slot, index) => (
        <div
          key={index}
          className={`hotbar-slot ${index === selectedSlot ? 'selected' : ''}`}
          onDrop={(e) => {
            e.preventDefault();
            const itemData = e.dataTransfer.getData('application/json');
            if (itemData) {
              const item = JSON.parse(itemData);
              handleDrop(index, item);
            }
          }}
          onDragOver={handleDragOver}
        >
          {slot ? (
            <div className="hotbar-item">
              <Item
                item={slot}
                draggable={false} // Na hotbar, não queremos arrastar itens de volta
                onDragStart={() => {}} // Desabilitamos para evitar erros
                onDrop={() => {}}
              />
              <button onClick={() => handleRemoveItem(index)}>X</button>
            </div>
          ) : (
            <div className="hotbar-placeholder">+</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Hotbar;
