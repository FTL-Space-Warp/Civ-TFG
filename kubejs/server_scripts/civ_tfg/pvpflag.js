const TIMEOUT = 17280000


// Enable pvp on login if persistent flag is not set
PlayerEvents.loggedIn(event => {
	const player = event.player
	if (player.persistentData.pvptimer == null) {
        player.persistentData.pvptimer = -1
        event.server.runCommandSilent(`execute as ${player.name.string} run pvpFlag on`)
	}
	return 1
})


// Register pvp command
ServerEvents.commandRegistry(event => {
    const {commands: Commands, arguments: Arguments } = event

    event.register(
        Commands.literal('pvp')

        .then(Commands.literal("enable")
            .executes(ctx => {
                const player = ctx.source.entity
                const server = ctx.source.server

                if (player) {
                    let playtime = player.stats.playTime

                    if (player.persistentData.pvptimer == -1) {
                        player.tell(`PvP is already enabled!`)
                    } else if (player.persistentData.pvptimer == null) {
                        player.persistentData.pvptimer = -1 // -1 means ENABLED
                        server.runCommandSilent(`execute as ${player.name.string} run pvpFlag on`)
                    } else if (playtime >= (player.persistentData.pvptimer + TIMEOUT)) {
                        player.persistentData.pvptimer = -1 // -1 means ENABLED
                        server.runCommandSilent(`execute as ${player.name.string} run pvpFlag on`)
                    } else {
                        let hours_left = (player.persistentData.pvptimer + TIMEOUT - playtime)/72000
                        player.tell(`You have to wait ${hours_left.toFixed(1)} hours for that!`)
                    }

                }

                return 1
            })
        )

        .then(Commands.literal("disable")
            .executes(ctx => {
                const player = ctx.source.entity
                const server = ctx.source.server

                if (player) {
                    let playtime = player.stats.playTime

                    if (player.persistentData.pvptimer == -1 || player.persistentData.pvptimer == null) {
                        player.persistentData.pvptimer = playtime
                        server.runCommandSilent(`execute as ${player.name.string} run pvpFlag off`)
                    } else {
                        player.tell(`PvP is already disabled!`)
                    }
                }

                return 1
            })
        )
    )
})