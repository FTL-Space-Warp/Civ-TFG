
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

	// This recipe is unused, its just to make it show up in EMI
	event.shapeless(
		Item.of('map_atlases:atlas', 1),
		[
			"tfc:glue",
			"firmaciv:sextant",
			"firmaciv:nav_clock",
			"minecraft:book",
			"create:precision_mechanism",
			"minecraft:filled_map"
		]
	)

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


function lockMap(player) {
	player.potionEffects.add("xaerominimap:no_minimap", -1, 0, false, false)
	player.potionEffects.add("xaeroworldmap:no_world_map", -1, 0, false, false)
	player.persistentData.minimap = false
}


function unlockMap(player) {
	player.removeEffect("xaerominimap:no_minimap")
	player.removeEffect("xaeroworldmap:no_world_map")
	player.persistentData.minimap = true
}


// Enable map when Pocket GPS is equipped
PlayerEvents.tick(event => {
	const player = event.player

	
	// Loop trough the hotbar
	if(player.inventory.find('civ_tfg:pocket_gps') > -1) {
		if (!player.persistentData.minimap) {
			unlockMap(player)
		}
	}
	else {
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