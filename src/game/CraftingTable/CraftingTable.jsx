import React, { useContext, useEffect, useState } from 'react';
import "./craftingTable.css";
import eventEmitter from '../EventEmitter';

const CraftingTable = () => {
    const [isCraftingTable, setIsCraftingTableVisible] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            setIsCraftingTableVisible(true);
        };

        eventEmitter.on('craftingTable-interaction', handleInteraction);

        return () => {
            eventEmitter.removeListener('craftingTable-interaction', handleInteraction);
        }
    }, []);

    useEffect(() => {
        const handleClose = () => {
            setIsCraftingTableVisible(false);
        };

        eventEmitter.on('craftingTable-close', handleClose);

        return () => {
            eventEmitter.removeListener('craftingTable-close', handleClose);
        }
    }, []);

    if (!isCraftingTable) {
        return null;
    }

    return (
        <div className="centro">
            <div className="UI">
                <table className="craftingTable">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>                
                </table>
                <div className="seta"></div>
                <div className="resultado"></div>
            </div>
            <button className="craftB_table">Craftar</button>
        </div>
    )
};

export default CraftingTable;
