
ServerEvents.recipes(event => {

	// Add Pocket GPS recipe
	event.recipes.gtceu.shaped('civ_tfg:pocket_gps', [
		'ABH',
		'CDE',
		'FGF'
	], {
		A: 'gtceu:hv_sensor',
		B: 'gtceu:mercury_barium_calcium_cuprate_single_wire',
		C: '#gtceu:batteries/hv',
		D: 'gtceu:computer_monitor_cover',
		E: 'gtceu:hv_emitter',
		F: '#gtceu:circuits/hv',
		G: '#forge:plates/titanium',
		H: 'gtceu:exquisite_certus_quartz_gem'
	})

	event.remove({ type: "map_atlases:crafting_atlas" })

	// Adding the atlas recipe, it doesn't show up in the EMI
	event.custom({
		"type": "map_atlases:crafting_atlas",
		"ingredients": [
			{
			"item": "tfc:glue"
			},
			{
			"item": "firmaciv:sextant"
			},
			{
			"item": "firmaciv:nav_clock"
			},
			{
			"item": "minecraft:book"
			},
			{
			"item": "create:precision_mechanism"
			}
		]
	})
})

// remove the minimap
function lockMap(player) {
	player.potionEffects.add("xaerominimap:no_minimap", -1, 0, false, false)
	player.potionEffects.add("xaeroworldmap:no_world_map", -1, 0, false, false)
	player.persistentData.minimap = false // false for no minimap
}


function unlockMap(player) {
	player.removeEffect("xaerominimap:no_minimap")
	player.removeEffect("xaeroworldmap:no_world_map")
	player.persistentData.minimap = true // true for enabled minimap
}


// Enable map when Pocket GPS is equipped
PlayerEvents.tick(event => {
	const player = event.player

	// Only execute every 20 ticks
	if (player.age % 20 != 0) return
	
	// Loop trough the inventory
	if(player.inventory.find('civ_tfg:pocket_gps') > -1) {
		// Unlock if locked
		if (!player.persistentData.minimap) {
			unlockMap(player)
		}
	}
	else {
		// Lock if unlocked
		if (player.persistentData.minimap) {
			lockMap(player)
		}
	}
})

// Disable map on login if persistent flag is not set
PlayerEvents.loggedIn(event => {
	const player = event.player
	if (player.persistentData.minimap == null) {
		lockMap(player)
	}
	return 1
})

// Disables the map on respawn
PlayerEvents.respawned(event => {
	const player = event.player

	if(!player.persistentData.minimap) {
		lockMap(player)
	}
})