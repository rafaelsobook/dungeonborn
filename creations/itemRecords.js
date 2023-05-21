const records = [
    {
        dn: 'Goblin Tooth',
        name: 'goblinTooth', 
        itemType: 'loot',
        origPrice: 40,
        secondPrice: 20,
        desc: "You can determine a goblin's strength by its tooth"
    },
    {
        dn: 'Fabric',
        name: 'fabric', 
        itemType: 'loot',
        origPrice: 30,
        secondPrice: 20,
        desc: "this can also be used for crafting medicines and weapon"
    },
    {
        dn: 'Dagger',
        name: 'dagger', 
        itemType: 'sword',
        origPrice: 100,
        plusDmg: 10,
        secondPrice: 20,
        desc: "Assasin's favorite weapon, useful for survival"
    },
    { 
        dn: 'Dragon Spear',
        name: 'dragonSpear',
        itemType: 'sword',
        desc: "holding this powerful spear can make you powerful against any foes",
        plusDmg: 40,
        origPrice: 6000,
        secondPrice: 5500,
    },
    {
        dn: 'Dger Spear',
        name: 'dgerSpear', 
        itemType: 'sword',
        origPrice: 3000,
        plusDmg: 60,
        secondPrice: 20,
        desc: "Light and easy to throw spear, It camouflages in the dark"
    },
    {
        dn: "Sarpion",
        name: 'sarpion', 
        itemType: 'sword',
        origPrice: 2000,
        plusDmg: 60,
        secondPrice: 1000,
        desc: "A heavy pointed sword, No mercy on your enemy",
    },
    {
        dn: "Village Spear",
        name: 'villageSpear', 
        itemType: 'sword',
        origPrice: 300,
        plusDmg: 10,
        secondPrice: 140,
        desc: "A Pointed Spear useful for throwing, good for hunting",
    },
    {
        dn: 'big rod',
        name: 'rod', 
        itemType: 'sword',
        origPrice: 100,
        plusDmg: 60,
        secondPrice: 1000,
        desc: "A heavy swing from the user will create a large impact on the enemy",
    },
    {
        dn: 'Pickaxe',
        name: 'pickaxe', 
        itemType: 'sword',
        origPrice: 100,
        plusDmg: 60,
        secondPrice: 1000,
        desc: "Essential for minning and can also be used as a weapon"
    },
    {
        dn: 'Wood',
        name: "wood",
        itemType: "tool",
        desc: "used for making bon fire and can make stick out of it",
        origPrice: 2,
        secondPrice: 1
    },
    {
        dn: 'Iron',
        name: "iron",
        itemType: "tool",
        desc: "essential for making swords and hard tools",
        origPrice: 5,
        secondPrice: 2
    },
    {
        dn: 'Leaves',
        name: "leaves",
        itemType: "loot",
        desc: "A bunch of big and small leaves from the tree",
        origPrice: 5,
        secondPrice: 0
    },
    {
        dn: 'Stone',
        name: "stone",
        itemType: "loot",
        desc: "essential for making crafts",
        origPrice: 5,
        secondPrice: 2
    },
    {
        dn: 'Mango Seed',
        name: "mango seed",
        itemType: "seed",
        desc: "A refreshing fruit, also loved by forest mongoise",
        origPrice: 5,
        secondPrice: 2
    },
    {
        dn: 'Berries',
        name: "berries",
        itemType: "food",
        desc: "this fruit can replenish your stamina",
        origPrice: 5,
        secondPrice: 2
    },
    {
        dn: 'small potion',
        name: "spotion",
        itemType: "food",
        desc: "A small potion that can generate your life for an amount",
        origPrice: 100,
        secondPrice: 100
    },
    {
        dn: 'medium potion',
        name: "mpotion",
        itemType: "food",
        desc: "A Medium potion that can generate your life for an amount",
        origPrice: 300,
        secondPrice: 300
    },
    {
        dn: 'big potion',
        name: "bigpotion",
        itemType: "food",
        desc: "A Big potion that can generate your life for an amount",
        origPrice: 500,
        secondPrice: 500
    },
    {
        dn: 'Minotaur meat',
        name: "minMeatRaw",
        itemType: "food",
        desc: "taste like an ordinary meat, best when cooked",
        origPrice: 100,
        secondPrice:40
    },
    {
        dn: 'Minotaur meat',
        name: "minMeatCooked",
        itemType: "food",
        desc: "A meat that is good for traveling also great taste",
        origPrice: 100,
        secondPrice:40
    },
    {
        dn: 'Red Beryl',
        name: "redberyl",
        itemType: "loot",
        desc: "This crytal is rare to find they commonly use this for crafting powerful sword and equipments",
        origPrice: 15500,
        secondPrice: 12000
    },
    {
        dn: 'Azurite',
        name: "azurite",
        itemType: "loot",
        desc: "It takes its color intensity from the copper element and it's crystals tend to be monoclinic",
        origPrice: 1000,
        secondPrice: 500
    },
    { 
        dn: 'Red Prince',
        name: 'redprince', 
        itemType: 'sword',
        desc: "A terrifying sword that has blackness inside, it can unleash hell itself",
        origPrice: 3400,
        secondPrice: 2000
    },
    { 
        dn: 'Lumin Sword',
        name: 'normal', 
        itemType: 'sword',
        desc: "many battles have fought and this sword has the most experience",
        origPrice: 3400,
        secondPrice: 2000
    },
    { 
        dn: 'Blade Fury',
        name: 'bladefury', 
        itemType: 'sword',
        desc: "a fury sword used by old heroes",
        origPrice: 3400,
        secondPrice: 2000
    },
    { 
        dn: 'Hunting Sword',
        name: 'huntingsword', 
        itemType: 'sword',
        desc: "sword used for hunting boar and small monsters",
        origPrice: 2000,
        secondPrice: 500
    },
    { 
        dn: 'Wooden Stick',
        name: 'stick', 
        itemType: 'sword',
        desc: "useful weapon for self defense",
        origPrice: 400,
        secondPrice: 200
    },
    { 
        dn: 'Grim Blue',
        name: 'grimblue', 
        itemType: 'sword',
        desc: "one of its kind, crafted my the great maggos in its time",
        origPrice: 3400,
        secondPrice: 2000
    },
    { 
        dn: 'Drakfoid',
        name: 'drakfoid', 
        itemType: 'sword',
        desc: "A sword that on par to it's kind the sword can slay hundreds of demons",
        origPrice: 3400,
        secondPrice: 2000
    },
    { 
        dn: 'Ruzty Sword',
        name: 'ruztysword', 
        itemType: 'sword',
        desc: "it's rust can inflict your enemy with tetano",
        origPrice: 3400,
        secondPrice: 2000
    },
    {
        dn: 'Hydra Armor',
        name: 'hydra', 
        itemType: 'armor', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 5000,
        secondPrice: 3000,
        desc: "a noble's armor the armor is light but strong as destruction"
    },
    {
        dn: 'Chief Plate',
        name: 'chiefplate', 
        itemType: 'armor', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 5000,
        secondPrice: 3000,
        desc: "a replica of Chief Hanzon armor, the plate is made by bronze"
    },
    {
        dn: 'Karba Armor',
        name: 'karba', 
        itemType: 'armor', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 5000,
        secondPrice: 3000,
        desc: "this armor is famous to it's known leather, A farmer would say they are invinsible when wearing this armor"
    },
    {
        dn: "First Born Helmet",
        name: 'firstborn', 
        itemType: 'helmet', 
        plusDef: 10, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 2400,
        secondPrice: 2000,
        desc: "You use this helmet if you're out for adventuring."
    },
    {
        dn: "karori",
        name: 'karori', 
        itemType: 'helmet', 
        plusDef: 60, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 3400,
        secondPrice: 3000,
        desc: "even steel cannot penetrate the hardness of this steel"
    },
    {
        dn: "Silvered Nine",
        name: 'silverdnine', 
        itemType: 'gear', 
        plusDef: 20, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 100,
        secondPrice: 100,
        desc: "A well forged gear, useful for protection and light weight armor"
    },
    {
        dn: "Copper Scale",
        name: 'copperScale', 
        itemType: 'gear', 
        plusDef: 10, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 100,
        secondPrice: 100,
        desc: "Gear that can blocked small attacks, can protect you from harm"
    },
    {
        dn: "Safe Shield",
        name: 'safeshield', 
        itemType: 'shield', 
        plusDef: 20, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 100,
        secondPrice: 100,
        desc: "A well forged gear, useful for protection and light weight armor"
    },
    {
        dn: "Goblin Core",
        name: 'gobcore', 
        for: "goblin",
        itemType: 'core', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 100,
        secondPrice: 100,
        desc: "This core has a chaotic green color and can be good quality sometimes."
    },
    {
        dn: "Minotaur Core",
        name: 'mincore', 
        for: "minotaur",
        itemType: 'core', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 300,
        secondPrice: 200,
        desc: "This is one of the favorite core of craftsmen to make their weapons, quality is good"
    },
    {
        dn: "Viper Core",
        name: 'vipcore', 
        for: "viper",
        itemType: 'core', 
        plusDef: 0, plusDmg: 0, 
        magRes: 0, plusMag: 0,
        origPrice: 1000,
        secondPrice: 500,
        desc: "The Viper's core can sometimes dangerous for its toxins lives inside its core. better be careful handling it"
    },
    {
        dn: "Flow Stamina",
        name: 'stam1',
        itemType: 'flower',
        origPrice: 30,
        secondPrice: 20,
        desc: "Widely use for creating stamina potions to replenish stamina of the user"
    },
    {
        dn: "Lotus Herb",
        name: 'lotusHerb',
        itemType: 'herbs',
        origPrice: 30,
        secondPrice: 20,
        desc: "Useful for creating potions, can also be used to make medicines"
    },
]

export default records