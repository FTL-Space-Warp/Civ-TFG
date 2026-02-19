// priority: -1000


const tier_items = [
    //['tfc:metal/anvil/copper'],
    //['tfc:metal/anvil/bronze', 'tfc:metal/anvil/bismuth_bronze', 'tfc:metal/anvil/black_bronze'],
    ['tfc:metal/anvil/wrought_iron'],
    ['tfc:metal/anvil/steel'],
    ['tfc:metal/anvil/black_steel'],
    ['tfc:metal/anvil/red_steel', 'tfc:metal/anvil/blue_steel'],
    ['gtceu:lv_machine_hull'],
    ['gtceu:mv_machine_hull'],
    ['gtceu:hv_machine_hull'],
    ['gtceu:ev_machine_hull'],
    ['gtceu:iv_machine_hull'],
    ['gtceu:luv_machine_hull'],
    ['gtceu:zpm_machine_hull'],
    ['gtceu:uv_machine_hull'],
    ['gtceu:uhv_machine_hull']
]

const tier_costs = [
    //{"minecraft:copper_ingot": 64}, // copper
    //{"gtceu:bronze_ingot": 64}, // bronze
    {"gtceu:wrought_iron_ingot": 200, 
        "gtceu:bismuth_bronze_ingot": 64, "gtceu:black_bronze_ingot": 64, "gtceu:bronze_ingot": 64,
        "tfc:burlap_cloth": 150, "tfg:linen_cloth": 150}, // iron
    {"gtceu:steel_ingot": 200, "create:brass_ingot": 200, "firmalife:beeswax": 150, "tfc:wool_cloth": 150}, // steel
    {"tfc:metal/ingot/black_steel": 400, "minecraft:leather": 150, "tfc:silk_cloth": 150}, // black_steel
    {"tfc:metal/ingot/red_steel": 200, "tfc:metal/ingot/blue_steel": 200, "create:electron_tube": 500}, // red_steel
    {"tfg:lv_universal_circuit": 2000, "gtceu:steel_ingot": 500}, // LV
    {"tfg:mv_universal_circuit": 2000, "gtceu:steel_ingot": 500, "gtceu:aluminium_ingot": 500}, // MV
    {"tfg:hv_universal_circuit": 2000, "gtceu:aluminium_ingot": 500, "gtceu:stainless_steel_ingot": 500}, // HV
    {"tfg:ev_universal_circuit": 2000, "gtceu:stainless_steel_ingot": 500, "gtceu:titanium_ingot": 500}, // EV
    {"tfg:iv_universal_circuit": 2000, "gtceu:titanium_ingot": 500, "gtceu:tungsten_steel_ingot": 500}, // IV
    {"tfg:luv_universal_circuit": 2000}, // LuV
    {"tfg:zpm_universal_circuit": 2000}, // ZPM
    {"tfg:uv_universal_circuit": 2000}, // UV
    {"tfg:uhv_universal_circuit": 2000}, // UHV
]


const progression_tiers = [
    //"copper",
    //"bronze",
    "iron",
    "steel",
    "black_steel",
    "red_steel",
    "LV",
    "MV",
    "HV",
    "EV",
    "IV",
    "LuV",
    "ZPM",
    "UV",
    "UHV",
    "none"
]

// Variable for the current tech tier
const current_tier = "iron"


// Delete recipes up to the desired tier
ServerEvents.recipes(event => {
    if(current_tier == "none") return 1

    tier_items.slice(progression_tiers.indexOf(current_tier)).forEach((tier) => {
        tier.forEach(item => {
            event.remove({ output: item });
        })
    })
})



// Register Tier command
ServerEvents.commandRegistry(event => {
    const {commands: Commands, arguments: Arguments } = event

    event.register(
        Commands.literal('tier')

        // Query current tier and progress, serverwide if run with no arguments
        .then(Commands.literal("status")
            .executes(ctx => {
            const sender = ctx.source.entity
            const server = ctx.source.server

            let msg = getProgress(server)

            if (sender) {
                msg.forEach(line => sender.tell(line))
            } else {
                msg.forEach(line => server.tell(line))
            }
            return 1
            })
        )

        // Submit currently held items and add them to the progress
        .then(Commands.literal("submit") // Contribute items to the tier progress
            .executes(ctx => {
                const sender = ctx.source.entity
                if (sender) {
                    sender.tell("Use §e/tier submit confirm")
                    sender.tell("§4Warning:§f This will consume any items matching the current tier's requirement from your inventory and add them to the progress")
                }
                return 1
            })
            .then(Commands.literal("confirm")
                .executes(ctx => {
                    const sender = ctx.source.entity
                    const server = ctx.source.server

                    let msg = addProgress(server, sender)

                    if (sender) msg.forEach(line => sender.tell(line))
                    return 1
                })
            )
        )
        .then(Commands.literal("stats") // Read how many items a player has contributed
            .then(Commands.argument('tier', Arguments.STRING.create(event))
                // command autocomplete
                .suggests((ctx, builder) => {
                    progression_tiers.slice(0, -1).forEach(validToken => builder.suggest(validToken))
                    return builder.buildFuture()
                })
                .executes(ctx => {
                    const sender = ctx.source.entity
                    const server = ctx.source.server
                    const tier = Arguments.STRING.getResult(ctx, 'tier')

                    if (!progression_tiers.slice(0, -1).includes(tier)) {
                        ctx.source.sendFailure(Component.red(`Invalid tier: '${tier}'`))
                        return 0
                    }
                    if (sender) {
                        let msg = getStats(server, sender.name.string, tier)
                        msg.forEach(line => sender.tell(line))
                    }
                    return 1
                })
                .then(Commands.argument('target', Arguments.STRING.create(event))
                    .suggests((ctx, builder) => {
                        const server = ctx.source.server
                        Object.keys(server.persistentData.tierProgress).forEach(tier => {
                            Object.keys(server.persistentData.tierProgress[tier]).forEach(player => builder.suggest(player))
                        })
                        return builder.buildFuture()
                    })

                    .executes(ctx => {
                        const sender = ctx.source.entity
                        const server = ctx.source.server
                        const tier = Arguments.STRING.getResult(ctx, 'tier')
                        const player_name = Arguments.STRING.getResult(ctx, 'target')
                        let msg = getStats(server, player_name, tier)

                        if (!progression_tiers.includes(tier)) {
                            ctx.source.sendFailure(Component.red(`Invalid tier: '${tier}'`))
                            return 0
                        }
                        if (sender) {
                            msg.forEach(line => sender.tell(line))
                        } else {
                            msg.forEach(line => server.tell(line))
                        }
                        return 1
                    })
                )
            )
        )
    )
})


// Return a message containing the progress towards the next tier 
function getProgress(server) {
    // Initialize persistentData if it's null
    if (!server.persistentData.tierProgress) server.persistentData.tierProgress = {}
    if (!Object.keys(server.persistentData.tierProgress).includes(current_tier)) server.persistentData.tierProgress[current_tier] = {}

    const spent_items = {}
    Object.values(server.persistentData.tierProgress[current_tier]).forEach(player => {
        Object.keys(player).forEach(item => {
            if (!spent_items[item]) {
                spent_items[item] = player[item]
            } else {
                spent_items[item] += player[item]
            }
        })
    })

    const requirements = tier_costs[progression_tiers.indexOf(current_tier)]
    const keys = Object.keys(requirements)

    const outputLines = [
        "-".repeat(25),
        "Current tier is: §e" + current_tier,
        "Required for next tier:"
    ]

    // Handle missing costs gracefully
    if (current_tier == "none") {
        return ["No tier lock enabled!"]
    } else if (keys.length == 0) {
        return ["The current tier has no item requirements!"]
    } else {
        let total_spent = 0
        let total_required = 0
        keys.forEach(item => {
            const required = requirements[item] ?? 0
            total_required += required
            const spent = spent_items[item] ?? 0
            total_spent += spent
            const item_line = Text.ofString('- ').color('white')
                .append(Text.of(Item.of(item).hoverName).color('yellow'))
                .append(Text.ofString(`: §f${spent}/${required}`).color('white'))
            outputLines.push(item_line)
        })
        
        let progress_bar = Math.round(50 * total_spent / total_required)
        outputLines.push("[§2" + "|".repeat(progress_bar) + "§4" + "|".repeat(50 - progress_bar) + `§f] ${progress_bar * 2}%`)
    }
    return outputLines
}


// Remove required items in a player's inventory and add them to the server's progress
function addProgress(server, player) {    
    // Initialize persistentData if it's null
    if (!server.persistentData.tierProgress) server.persistentData.tierProgress = {}
    if (!Object.keys(server.persistentData.tierProgress).includes(current_tier)) server.persistentData.tierProgress[current_tier] = {}

    const spent_items = {}
    Object.values(server.persistentData.tierProgress[current_tier]).forEach(player => {
        Object.keys(player).forEach(item => {
            if (!spent_items[item]) {
                spent_items[item] = player[item]
            } else {
                spent_items[item] += player[item]
            }
        })
    })


    const requirements = tier_costs[progression_tiers.indexOf(current_tier)]
    const keys = Object.keys(requirements)
    const outputLines = []


    // Handle missing costs or tier gracefully
    if (current_tier == "none") {
        return ["No tier lock enabled!"]
    } else if (keys.length == 0) {
        return ["The current tier has no item requirements!"]
    } else {
        keys.forEach(item => {
            const required = requirements[item] ?? 0
            const spent = spent_items[item] ?? 0
            if (spent > required) {
                return 0
            }
            const held_items = player.inventory.count(item)
            const consumed_items = Math.min(held_items, required - spent)
            if (consumed_items) {
                server.runCommandSilent(`clear ${player.name.string} ${item} ${consumed_items}`)
                const item_line = Text.ofString('- ').color('white')
                .append(Text.of(Item.of(item).hoverName).color('yellow'))
                .append(Text.ofString(`: ${consumed_items}`).color('white'))
                outputLines.push(item_line)

                if (!server.persistentData.tierProgress[current_tier][player.name.string]) {
                    server.persistentData.tierProgress[current_tier][player.name.string] = {}
                }
                if (!server.persistentData.tierProgress[current_tier][player.name.string][item]) {
                    server.persistentData.tierProgress[current_tier][player.name.string][item] = consumed_items
                } else {
                    server.persistentData.tierProgress[current_tier][player.name.string][item] += consumed_items
                }
            }
        })
        if (outputLines.length) {
            outputLines.unshift("Items added to the progress:")
            outputLines.unshift("-".repeat(25))
        } else {
            outputLines.push("None of the required items were found!")
        }
    }
    return outputLines
}


// Return a message displaying the items submitted by a single player
function getStats(server, player_name, tier) {

    // Return no items if the current tier has not been initialized
    if (!server.persistentData.tierProgress || !Object.keys(server.persistentData.tierProgress).includes(tier) || !server.persistentData.tierProgress[tier][player_name]) {
        return [`No stats for ${player_name} for tier: §e${tier}`]
    } else {
        let player_stats = server.persistentData.tierProgress[tier][player_name]
        let keys = Object.keys(player_stats)
        let outputLines = [
            "-".repeat(25),
            `Items submitted by ${player_name} for tier: §e${tier}§f:`
        ]

        if (!keys.length) {
            return [`No stats for ${player_name} for tier: §e${tier}`]
        } else {
            keys.forEach(item => {
                const item_line = Text.ofString('- ').color('white')
                .append(Text.of(Item.of(item).hoverName).color('yellow'))
                .append(Text.ofString(`: ${player_stats[item]}`).color('white'))
                outputLines.push(item_line)
            })
        }

        return outputLines
    }
}
