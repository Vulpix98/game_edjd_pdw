// Inventory.jsx
import React, { useContext, useEffect } from 'react';
import { InventoryContext } from './InvtoryContext';
import eventEmitter from './EventEmitter';
import '../../public/inventory.css';

const Inventory = () => {
  const { isInventoryOpen, setIsInventoryOpen } = useContext(InventoryContext); // Aqui pegamos o contexto

  useEffect(() => {
    const handleToggleInventory = () => {
      setIsInventoryOpen(prevState => !prevState);
    };

    eventEmitter.on('toggle-inventory', handleToggleInventory);

    // Limpar o evento quando o componente for desmontado
    return () => {
      eventEmitter.removeListener('toggle-inventory', handleToggleInventory);
    };
  }, [setIsInventoryOpen]);

  if (!isInventoryOpen) return null;

  return (
    <div className="inventory">
      <h1>Inventário</h1>
      
      <table>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </table>

      <button onClick={() => eventEmitter.emit('toggle-inventory')}>Fechar Inventário</button>
    </div>
  );
};

export default Inventory;

