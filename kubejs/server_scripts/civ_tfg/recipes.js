ServerEvents.recipes(event => {
    event.shaped('createrailwaysnavigator:advanced_display', [
		'ABA',
		'CCC',
		'ABA'
	], {
		A: '#forge:plates/wrought_iron',
		B: '#gtceu:circuits/lv',
		C: 'create:display_board'
	}).id('civ_tfg:shaped/advanced_display')

	event.recipes.gtceu.assembler('civ_tfg:navigator')
		.itemInputs('4x #forge:plates/wrought_iron', 'gtceu:computer_monitor_cover' , '4x #gtceu:circuits/mv', '#forge:screws/aluminium')
		.itemOutputs('createrailwaysnavigator:navigator')
		.duration(20*2.5)
		.EUt(16)
})