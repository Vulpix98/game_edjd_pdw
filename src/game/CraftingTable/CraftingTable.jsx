import React, { useEffect, useState } from 'react';
import './craftingTable.css';
import Item from '../Items/Item';  // Importando o componente Item
import { useCraftingTable } from './CraftingTableContext';
import eventEmitter from '../EventEmitter';

const CraftingTable = () => {
    const { matrix, setMatrix, craftItem } = useCraftingTable();
    const [isCraftingTable, setIsCraftingTableVisible] = useState(false);
    const [draggedItem, setDraggedItem] = useState(null);
    const [images, setImages] = useState({}); // Armazenar imagens associadas aos slots

    // Gerenciar a visibilidade da crafting table com eventos
    useEffect(() => {
        const handleVisible = (state) => {
            setIsCraftingTableVisible(state);
        };

        eventEmitter.on('craftingTable-visible', handleVisible);

        return () => {
            eventEmitter.removeListener('craftingTable-visible', handleVisible);
        };
    }, []);

    if (!isCraftingTable) {
        return null;
    }

    // Lidar com drag and drop
    const handleDragStart = (item) => {
        setDraggedItem(item);  // Atualiza o estado do item arrastado
    };

    const handleDrop = (row, col, e) => {
        // Obtém os dados do item arrastado
        const itemData = e.dataTransfer.getData('application/json');
        const item = JSON.parse(itemData);
    
        if (item) {
            // Atualiza a matriz com o item na posição correta
            const newMatrix = [...matrix];
            newMatrix[row][col] = { type: item.type, quantity: item.quantity };  // Garantir que slot seja um objeto
            setMatrix(newMatrix);
    
            // Atualiza as imagens associadas ao item (texturas)
            setImages((prevImages) => ({
                ...prevImages,
                [`${row}-${col}`]: item.type, // Usa o tipo de item para associar a textura
            }));
    
            // Limpa o item arrastado
            setDraggedItem(null);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();  // Permite o drop
    };

    const handleSlotClick = (row, col) => {

        const newMatrix = [...matrix];
        if (newMatrix[row][col]) {
            newMatrix[row][col] = null;
        }
        setMatrix(newMatrix);

        // Limpa a imagem associada ao slot ao clicar
        setImages((prevImages) => {
            const updatedImages = { ...prevImages };
            delete updatedImages[`${row}-${col}`];
            return updatedImages;
        });
    };

    const handleCraft = () => {
        const result = craftItem();
        if (result) {
            alert(`Item criado: ${result}`);
            // Agora, o item craftado será adicionado ao inventário automaticamente pela função addItemToInventory no contexto
        } else {
            alert('Nenhuma combinação válida!');
        }
    };

    return (
        <div className="centro">
            <div className="UI">
                <table className="craftingTable">
                    <tbody>
                        {matrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((slot, colIndex) => (
                                    <th
                                        key={colIndex}
                                        className="slot"
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(rowIndex, colIndex, e)}  // Passando o evento corretamente
                                        onClick={() => handleSlotClick(rowIndex, colIndex)}
                                    >
                                        {slot ? (
                                            <div className="item">
                                                {/* Renderizando o componente Item, passando a textura e as propriedades do item */}
                                                <Item
                                                    item={slot}  // Passando o objeto item, que contém o tipo e a quantidade
                                                    draggable={true}
                                                    onDragStart={handleDragStart}
                                                />
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="seta"></div>
                <div className="resultado"></div>
            </div>
            <button className="craftB_table" onClick={handleCraft}>Craftar</button>
        </div>
    );
};

export default CraftingTable;
