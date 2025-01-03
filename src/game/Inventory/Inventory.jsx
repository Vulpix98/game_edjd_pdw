import React, { useContext, useEffect, useState } from 'react';
import InventoryContext from './InventoryContext';
import ItemList from '../Items/ItemList';
import eventEmitter from '../EventEmitter';
import '../../../public/inventory.css';

const Inventory = () => {
  const { isInventoryOpen, setIsInventoryOpen, inventoryItems, addItemToInventory } = useContext(InventoryContext);
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
      addItemToInventory({ type, quantity });
    };
  
    eventEmitter.on('add-to-inventory', handleAddToInventory);
  
    return () => {
      eventEmitter.removeListener('add-to-inventory', handleAddToInventory);
    };
  }, [addItemToInventory]);

  // Escutando o evento check-has-items
  useEffect(() => {
    const handleHasItemsCheck = (inputItems, inventoryItems) => {
      const hasItems = inputItems.every((input) => {
        const item = inventoryItems.find((i) => i.type === input.type);
        return item && item.quantity >= input.quantity;
      });

      console.log('Itens suficientes?', hasItems); // Aqui você pode adicionar a lógica do que fazer com essa informação
    };

    eventEmitter.on('check-has-items', handleHasItemsCheck);

    return () => {
      eventEmitter.removeListener('check-has-items', handleHasItemsCheck);
    };
  }, []);

  // Escutando o evento update-inventory
  useEffect(() => {
    const handleInventoryUpdate = (inputItems, inventoryItems, setInventoryItems) => {
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
      console.log('Inventário atualizado:', updatedInventory);
    };

    eventEmitter.on('update-inventory', handleInventoryUpdate);

    return () => {
      eventEmitter.removeListener('update-inventory', handleInventoryUpdate);
    };
  }, []);

  // Escutando o evento update-hotbar
  useEffect(() => {
    const handleHotbarUpdate = (inputItems, hotbarItems, setHotbarItems) => {
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
      console.log('Hotbar atualizada:', updatedHotbar);
    };

    eventEmitter.on('update-hotbar', handleHotbarUpdate);

    return () => {
      eventEmitter.removeListener('update-hotbar', handleHotbarUpdate);
    };
  }, []);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetItem) => {
    if (draggedItem && targetItem) {
      // Lógica para o arraste sem a combinação de itens
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
