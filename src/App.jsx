// App.jsx
import React from 'react';
import { HotbarProvider } from './game/Hotbar/HotbarContext';
import { InventoryProvider } from './game/Inventory/InventoryContext';
import { BarrasProvider } from './game/barras_VidaRiqueza/BarrasContext';
import Inventory from './game/Inventory/Inventory';
import Hotbar from './game/Hotbar/Hotbar';
import Barras from './game/barras_VidaRiqueza/Barras';
import NPC from './game/Npc/Npc';
import MainMenu from './game/scenes/MainMenu';

function App() {
  return (
    <HotbarProvider>
      <InventoryProvider>
        <BarrasProvider>
          <Inventory />
          <Hotbar />
          <Barras />
          <MainMenu />
          <NPC />
        </BarrasProvider>
      </InventoryProvider>
    </HotbarProvider>
  );
}

export default App;
