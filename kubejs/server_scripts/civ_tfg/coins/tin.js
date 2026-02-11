ItemEvents.crafted((event) => {
    
    if (event.item.id === 'kubejs:tin_coin') {
        const player = event.player;
        if (player) {
        
            event.item.nbt = event.item.nbt ?? {};
            event.item.nbt.creator = player.username;
        }
    }
    if (event.item.id === 'kubejs:tin_coin') {
        let player = event.player;
        if (!player) return;

        let item = event.item;
        if (!item) return;

        let pos = player.blockPosition();
        let chunkX = Math.floor(pos.x / 16);
        let chunkZ = Math.floor(pos.z / 16);
    
            event.item.nbt = event.item.nbt ?? {};
            item.nbt.craftedChunkX = chunkX;
            item.nbt.craftedChunkZ = chunkZ;
        }
});