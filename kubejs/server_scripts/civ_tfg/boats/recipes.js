ServerEvents.recipes(event => {
  // Remove the existing anvil recipe (replace with the actual recipe id)
  event.remove({ output: 'alekiships:oarlock', type: 'tfc:anvil' })

  // Re-add it with a new tier
  event.custom({
    type: 'tfc:anvil',
    input: { item: '#forge:double_ingots/bronze' },
    result: { item: 'alekiships:oarlock' },
    tier: 2, // 👈 new anvil tier (lower = easier)
    rules: [ 'bend_last', 'hit_second_last', 'hit_third_last' ]
  });

  event.custom({
    type: 'tfc:anvil',
    input: { item: '#forge:double_ingots/bismuth_bronze' },
    result: { item: 'alekiships:oarlock' },
    tier: 2, // 👈 new anvil tier (lower = easier)
    rules: [ 'bend_last', 'hit_second_last', 'hit_third_last' ]
  });

  event.custom({
    type: 'tfc:anvil',
    input: { item: '#forge:double_ingots/black_bronze' },
    result: { item: 'alekiships:oarlock' },
    tier: 2, // 👈 new anvil tier (lower = easier)
    rules: [ 'bend_last', 'hit_second_last', 'hit_third_last' ]
  });

  

   event.remove({ output: 'alekiships:cleat', type: 'tfc:anvil' })

  // Re-add it with a new tier
  event.custom({
    type: 'tfc:anvil',
    input: { item: '#forge:double_ingots/wrought_iron' },
    result: { item: 'alekiships:cleat' },
    tier: 3, // 👈 new anvil tier (lower = easier)
    rules: [ 'bend_last', 'bend_second_last', 'bend_third_last' ]
  });

   event.remove({ output: 'alekiships:anchor', type: 'tfc:anvil' })

  // Re-add it with a new tier
  event.custom({
    type: 'tfc:anvil',
    input: { item: '#forge:double_plates/wrought_iron' },
    result: { item: 'alekiships:anchor' },
    tier: 3, // 👈 new anvil tier (lower = easier)
    rules: [ 'hit_last', 'punch_second_last', 'bend_third_last' ]
  });
})

