import React from 'react';
import Item from './Item';
import '../../../public/Items.css'

const ItemList = ({ items, onDragStart, onDrop }) => {
  return (
    <div className="item-list">
      {items.map((item, index) => (
        <Item
          key={index}
          item={item}
          draggable={true}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};

export default ItemList;
