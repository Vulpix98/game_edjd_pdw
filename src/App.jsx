// App.jsx
import React from 'react';
import { HotbarProvider } from './game/Hotbar/HotbarContext';
import { InventoryProvider } from './game/Inventory/InventoryContext';
import { BarrasProvider } from './game/barras_VidaRiqueza/BarrasContext';
import { CraftingTableProvider } from './game/CraftingTable/CraftingTableContext';
import Inventory from './game/Inventory/Inventory';
import Hotbar from './game/Hotbar/Hotbar';
import Barras from './game/barras_VidaRiqueza/Barras';
import NPC from './game/Npc/Npc';
import MainMenu from './game/scenes/MainMenu';
import CraftingTable from './game/CraftingTable/CraftingTable';
import Timer from './game/Timer/Timer';
import RadiationMeter from './game/Radiation/Radiation';

function App() {
  return (
    <HotbarProvider>
      <InventoryProvider>
        <BarrasProvider>
          <CraftingTableProvider>
            <Inventory />
            <Hotbar />
            <Barras />
            <MainMenu />
            <NPC />
            <CraftingTable />
            <Timer />
            <RadiationMeter />
          </CraftingTableProvider>
        </BarrasProvider>
      </InventoryProvider>
    </HotbarProvider>
  );
}

export default App;
