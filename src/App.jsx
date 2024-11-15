// App.js
import React from 'react';
import { InventoryProvider } from './game/InvtoryContext';
import Inventory from './game/Inventory';
import MainMenu from './game/scenes/MainMenu';

function App() {
  return (
    <InventoryProvider>
      <Inventory />
      <MainMenu />
    </InventoryProvider>
  );
}

export default App;
