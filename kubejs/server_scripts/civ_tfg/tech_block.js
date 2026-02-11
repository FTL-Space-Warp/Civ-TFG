// priority: -1000


const tier_items = [
    ['tfc:metal/anvil/copper'],
    ['tfc:metal/anvil/bronze', 'tfc:metal/anvil/bismuth_bronze', 'tfc:metal/anvil/black_bronze'],
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
    {"minecraft:copper_ingot": 64}, // copper
    {"gtceu:bronze_ingot": 64}, // bronze
    {"gtceu:wrought_iron_ingot": 64}, // iron
    {"gtceu:steel_ingot": 64}, // steel
    {"tfc:metal/ingot/black_steel": 64}, // black_steel
    {"tfc:metal/ingot/red_steel": 32, "tfc:metal/ingot/blue_steel": 32}, // red_steel
    {"tfg:lv_universal_circuit": 128}, // LV
    {"tfg:mv_universal_circuit": 128}, // MV
    {"tfg:hv_universal_circuit": 128}, // HV
    {"tfg:ev_universal_circuit": 128}, // EV
    {"tfg:iv_universal_circuit": 128}, // IV
    {"tfg:luv_universal_circuit": 128}, // LuV
    {"tfg:zpm_universal_circuit": 128}, // ZPM
    {"tfg:uv_universal_circuit": 128}, // UV
    {"tfg:uhv_universal_circuit": 128}, // UHV
]


const progression_tiers = {
    copper: 0,
    bronze: 1,
    iron: 2,
    steel: 3,
    black_steel: 4,
    red_steel: 5,
    LV: 6,
    MV: 7,
    HV: 8,
    EV: 9,
    IV: 10,
    LuV: 11,
    ZPM: 12,
    UV: 13,
    UHV: 14,
    none: 15
}

// Variable for the current tech tier
const current_tier = progression_tiers.none


// Delete recipes up to the desired tier
ServerEvents.recipes(event => {
    console.log(current_tier)

    if(current_tier == 15) return 1

    tier_items.slice(current_tier).forEach((tier) => {
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

        // Runs with no arguments, query current tier and progress
        .executes(ctx => {
            const sender = ctx.source.entity
            const server = ctx.source.server
                    
            if (sender) {
                if (current_tier != 15) {
                    let tier_msg = getProgress(server)
                    if (tier_msg) {
                        tier_msg.forEach(line => {
                            sender.tell(line)
                        })
                    } else {
                        sender.tell("null")
                    }
                } else sender.tell("No tier enabled!")
            } else {
                if (current_tier != 15) {
                    let tier_msg = getProgress(server)
                    if (tier_msg) {
                        tier_msg.forEach(line => {
                            server.tell(line)
                        })
                    } else {
                        server.tell("null")
                    }
                } else sender.tell("No tier enabled!")
            }
            return 1
        })

        // Submit currently held items and add them to the progress
        .then(Commands.literal("submit")
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

                    if (current_tier != 15) {
                        if (sender) {
                            let msg = addProgress(server, sender)
                            if (msg) {
                                msg.forEach(line => {
                                    sender.tell(line)
                                })
                            }
                        }
                    }
                    return 1
                })
            )
        )
    )
})

// Return a message containing the progress towards the next tier 
function getProgress(server) {
    // Initialize persistentData if it's null or if 
    if (server.persistentData.tierProgress?.tier !== current_tier) server.persistentData.tierProgress = { tier: current_tier }
    const spent_items = server.persistentData.tierProgress

    const requirements = tier_costs[current_tier]
    const keys = Object.keys(requirements)

    const outputLines = [
        "-".repeat(25),
        "Current tier is: §e" + Object.keys(progression_tiers)[parseInt(current_tier)],
        "Required for next tier:"
    ]

    // Handle missing costs gracefully
    if (keys.length === 0) {
        return null
    } else {
        let total_spent = 0
        let total_required = 0
        keys.forEach(item => {
            const required = requirements[item] ?? 0
            total_required += required
            const spent = spent_items[item] ?? 0
            total_spent += spent
            outputLines.push(`- §e${Item.of(item).displayName.string.slice(4, -1)}: §f${spent}/${required}`)
        })
        
        let progress_bar = Math.round(50 * total_spent / total_required)
        outputLines.push("[§2" + "|".repeat(progress_bar) + "§4" + "|".repeat(50 - progress_bar) + `§f] ${progress_bar * 2}%`)
    }
    return outputLines
}


// Remove required items in a player's inventory and add them to the server's progress
function addProgress(server, player) {    
    // Initialize persistentData if it's null
    if (server.persistentData.tierProgress?.tier !== current_tier) server.persistentData.tierProgress = { tier: current_tier }
    const spent_items = server.persistentData.tierProgress

    const requirements = tier_costs[current_tier]
    const keys = Object.keys(requirements)
    const outputLines = []


    // Handle missing costs gracefully
    if (keys.length === 0) {
        return null
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
                outputLines.push(`- §e${Item.of(item).displayName.string.slice(4, -1)}: §f${consumed_items}`)
                server.persistentData.tierProgress[item] = spent + consumed_items
                console.log(server.persistentData.tierProgress)
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