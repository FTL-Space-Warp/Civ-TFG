ServerEvents.recipes((event) => {

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


    event.shapeless('kubejs:bronze_coinstack', [
       '4x kubejs:bronze_coin'
       
   ]);

   event.shapeless('kubejs:tin_coinstack', [
       '4x kubejs:tin_coin'
   ]);

    event.shapeless('kubejs:bismuth_bronze_coin', [
       '#forge:nuggets/bismuth_bronze',
       '#forge:tools/hammers'
   ]);

    event.shapeless('kubejs:bismuth_bronze_coinstack', [
       '4x kubejs:bismuth_bronze_coin'
       
   ]);

   event.shapeless('kubejs:black_bronze_coin', [
       '#forge:nuggets/black_bronze',
       '#forge:tools/hammers'
   ]);

    event.shapeless('kubejs:black_bronze_coinstack', [
       '4x kubejs:black_bronze_coin'
       
   ]);

   event.shapeless('kubejs:black_steel_coin', [
       '#forge:nuggets/black_steel',
       '#forge:tools/hammers'
   ]);

    event.shapeless('kubejs:black_steel_coinstack', [
       '4x kubejs:black_steel_coin'
       
   ]);

   event.shapeless('kubejs:red_steel_coin', [
       '#forge:nuggets/red_steel',
       '#forge:tools/hammers'
   ]);

    event.shapeless('kubejs:red_steel_coinstack', [
       '4x kubejs:red_steel_coin'
       
   ]);

   event.shapeless('4x kubejs:bronze_coin', [
       'kubejs:bronze_coinstack',
       
   ]);

   event.shapeless('4x kubejs:bismuth_bronze_coin', [
       'kubejs:bismuth_bronze_coinstack',
       
   ]);

   event.shapeless('4x kubejs:black_bronze_coin',[
       'kubejs:black_bronze_coinstack',
       
   ]);

   event.shapeless('4x kubejs:black_steel_coin', [
       'kubejs:black_steel_coinstack',
       
   ]);

   event.shapeless('4x kubejs:red_steel_coin', [
       'kubejs:red_steel_coinstack',
       
   ]);

   event.shapeless('4x kubejs:tin_coin', [
       'kubejs:tin_coinstack',
       
   ]);



});     



