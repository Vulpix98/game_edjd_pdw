// Hotbar.jsx
import React, { useContext, useEffect, useState } from 'react';
import HotbarContext from './HotbarContext';
import Item from '../Items/Item';
import '../../../public/hotbar.css';
import eventEmitter from '../EventEmitter'; // Supondo que você tenha um EventEmitter

const Hotbar = () => {
  const { hotbarItems, addItemToHotbar, selectedSlot, selectSlot } = useContext(HotbarContext); // Consome o estado da hotbar do contexto
  const [isHotbarVisible, setIsHotbarVisible] = useState(false); // Inicialmente a hotbar está oculta (display: none)

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

  useEffect(() => {
    // Ouvir o evento para mostrar a hotbar
    const handleShowHotbar = () => {
      setIsHotbarVisible(true); // Torna a hotbar visível
    };

    // Registrar evento para mostrar a hotbar
    eventEmitter.on('show-hotbar', handleShowHotbar);

    // Limpar o evento ao desmontar
    return () => {
      eventEmitter.removeListener('show-hotbar', handleShowHotbar);
    };
  }, []);

  return (
    <div
      className="hotbar"
      style={{ display: isHotbarVisible ? 'flex' : 'none' }} // Exibe a hotbar se isHotbarVisible for true
    >
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
                draggable={true} // Na hotbar, não queremos arrastar itens de volta
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
