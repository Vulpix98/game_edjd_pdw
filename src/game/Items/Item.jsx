import React from 'react';
import '../../../public/Items.css'

const Item = ({ item, onDragStart, onDrop, draggable = false }) => {
  const itemTextures = {
    wood: '../../../public/assets/Textures/tree.png',
    stone: '../../../public/assets/Textures/rock.png',
    axe: '../../../public/assets/Textures/axe.png',
  };

  console.log(item.type);

  return (
    <div
      className="item"
      draggable={draggable}
      onDragStart={() => onDragStart(item)}
      onDrop={() => onDrop(item)}
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
