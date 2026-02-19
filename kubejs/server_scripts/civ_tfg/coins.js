const coins = [
    "kubejs:bismuth_bronze_coin",
    "kubejs:black_bronze_coin",
    "kubejs:black_steel_coin",
    "createdeco:netherite_coin", // Blue steel
    "createdeco:brass_coin",
    "kubejs:bronze_coin",
    "createdeco:copper_coin",
    "createdeco:gold_coin",
    "kubejs:red_steel_coin",
    "createdeco:industrial_iron_coin", // Steel
    "kubejs:tin_coin",
    "createdeco:iron_coin", // wrought iron
    "createdeco:zinc_coin"
]


// Add recipes
ServerEvents.recipes((event) => {
    coins.forEach(coin => {
        event.remove({ output: coin + "stack" }) // Remove recipes for coinstacks
    })

    // Add all coin crafting
    event.shapeless('createdeco:gold_coin', [
        '#forge:nuggets/gold',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:netherite_coin', [
        '#forge:nuggets/blue_steel',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:brass_coin', [
        '#forge:nuggets/brass',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:iron_coin', [
        '#forge:nuggets/wrought_iron',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:copper_coin', [
        '#forge:nuggets/copper',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:industrial_iron_coin', [
        '#forge:nuggets/steel',
        '#forge:tools/hammers'
    ]);

    event.shapeless('createdeco:zinc_coin', [
        '#forge:nuggets/zinc',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:bronze_coin', [
        '#forge:nuggets/bronze',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:tin_coin', [
        '#forge:nuggets/tin',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:bismuth_bronze_coin', [
        '#forge:nuggets/bismuth_bronze',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:black_bronze_coin', [
        '#forge:nuggets/black_bronze',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:black_steel_coin', [
        '#forge:nuggets/black_steel',
        '#forge:tools/hammers'
    ]);

    event.shapeless('kubejs:red_steel_coin', [
        '#forge:nuggets/red_steel',
        '#forge:tools/hammers'
    ]);
})


// Add nbt tag when crafted
ItemEvents.crafted((event) => {
    coins.forEach(coin => {
        if (event.item.id === coin) {
            const player = event.player
            if (player) {
                event.item.nbt = event.item.nbt ?? {}
                event.item.nbt.creator = player.username
            }
        }
    })
});