import React from 'react';
import '../../../public/Items.css'

const Item = ({ item, onDragStart, draggable = false }) => {
  const itemTextures = {
    wood: '../../../public/assets/Textures/tree.png',
    stone: '../../../public/assets/Textures/rock.png',
    crafting: '../../../public/assets/Textures/crafting.png',
  };

  // Lógica para arrastar o item
  const handleDragStart = (e) => {
    if (draggable) {
      e.dataTransfer.setData('application/json', JSON.stringify(item));
    }
  };

  return (
    <div
      className="item"
      draggable={draggable}
      onDragStart={handleDragStart} // Usa a lógica interna
    >
      <img
        src={itemTextures[item.type]}
        alt={item.type}
        style={{ width: '32px', height: '32px' }}
      />
      <span className="quantity">{item.quantity}</span>
    </div>
  );
};

export default Item;
