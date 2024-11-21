// Inventory.jsx
import React, { useContext, useEffect, useState } from 'react';
import InventoryContext, { useInventory } from './InventoryContext';
import eventEmitter from './EventEmitter';
import '../../public/inventory.css';

const Inventory = () => {
  const { isInventoryOpen, setIsInventoryOpen, inventoryItems, addItemToInventory, combineItems } = useContext(InventoryContext);
  const [draggedItem, setDraggedItem] = useState(null);

  const itemTextures = {
    wood: '../../public/assets/Textures/tree.png',
    stone: '../../public/assets/Textures/rock.png',
  };

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
      // console.log('Evento recebido:', { type, quantity });
      addItemToInventory({ type, quantity });
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
      // console.log(draggedItem, targetItem);
      combineItems([draggedItem, targetItem]);
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Permite o "drop"
  };

  if (!isInventoryOpen) return null;

  return (
    <div className="inventory">
      <h1>Inventário</h1>        
      <table>
        <tbody>
          {inventoryItems.map((item, index) => (
            <tr key={index}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDrop={() => handleDrop(item)}
              onDragOver={handleDragOver}
            >
              <div className="items">
                <img 
                  src={itemTextures[item.type]} 
                  alt={itemTextures[item.type]} 
                  style={{ width: '32px', height: '32px' }} 
                />
                <td>{item.quantity}</td>
              </div>
            </tr>
          ))}
        </tbody>
      </table>

    <button onClick={() => eventEmitter.emit('toggle-inventory')}>Fechar Inventário</button>
  </div>
  );
};

export default Inventory;

