// App.js
import React from 'react';
import { InventoryProvider } from './game/Inventory/InventoryContext';
import Inventory from './game/Inventory/Inventory';
import NPC from './game/Npc/Npc';
import MainMenu from './game/scenes/MainMenu';

function App() {
  return (
    <InventoryProvider>
      <Inventory />
      <MainMenu />
      <NPC />
    </InventoryProvider>
  );
}

export default App;
