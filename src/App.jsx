// App.js
import React from 'react';
import { HotbarProvider } from './game/Hotbar/HotbarContext';
import { InventoryProvider } from './game/Inventory/InventoryContext';
import Inventory from './game/Inventory/Inventory';
import Hotbar from './game/Hotbar/Hotbar';
import NPC from './game/Npc/Npc';
import MainMenu from './game/scenes/MainMenu';

function App() {
  return (

   <HotbarProvider> {/* Envolvendo com HotbarProvider */}
      <InventoryProvider> {/* Envolvendo com InventoryProvider */}
        <Inventory />
        <Hotbar />
        <MainMenu />
        <NPC />
      </InventoryProvider>
    </HotbarProvider>
  );
}

export default App;
