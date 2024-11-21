// Inventory.jsx
import React, { useContext, useEffect, useState } from 'react';
import InventoryContext from './InventoryContext';
import ItemList from './Items/ItemList';
import eventEmitter from './EventEmitter';
import '../../public/inventory.css';

const Inventory = () => {
  const { isInventoryOpen, setIsInventoryOpen, inventoryItems, addItemToInventory, combineItems } =
    useContext(InventoryContext);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const handleToggleInventory = () => {
      setIsInventoryOpen((prevState) => !prevState);
    };

    eventEmitter.on('toggle-inventory', handleToggleInventory);

    return () => {
      eventEmitter.removeListener('toggle-inventory', handleToggleInventory);
    };
  }, [setIsInventoryOpen]);

  useEffect(() => {
    const handleAddToInventory = ({ type, quantity }) => {
      console.log('Recurso coletado:', { type, quantity });
      addItemToInventory({ type, quantity }); // Certifique-se de que esta função atualiza o estado global do inventário
    };
  
    eventEmitter.on('add-to-inventory', handleAddToInventory);
  
    return () => {
      eventEmitter.removeListener('add-to-inventory', handleAddToInventory);
    };
  }, [addItemToInventory]);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetItem) => {
    if (draggedItem && targetItem) {
      combineItems([draggedItem, targetItem]);
    }
    setDraggedItem(null);
  };

  if (!isInventoryOpen) return null;

  return (
    <div className="inventory">
      <h1>Inventário</h1>
      <ItemList
        items={inventoryItems}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
      <button onClick={() => eventEmitter.emit('toggle-inventory')}>
        Fechar Inventário
      </button>
    </div>
  );
};

export default Inventory;


