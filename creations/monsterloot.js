const goblinLoot = [
    {
        name: 'goblinTooth', 
        itemType: 'loot',
        price: 10,
        desc: "You can determine a goblin's strength by its tooth"
    },
    {
        name: 'fabric', 
        itemType: 'loot',
        price: 3,
        desc: "this can also be used for crafting medicines and weapon"
    },
    {
        name: 'dagger', 
        itemType: 'sword',
        price: 20,
        plusDmg: 13,
        desc: "Assasin's favorite weapon, useful for survival",
        cState: 1000,
        durability: 1000,
    },
    {
        name: 'berries', 
        itemType: 'food',
        price: 5,
        desc: "refreshing fruit can replenish stamina"
    },
    {
        name: 'stick', 
        itemType: 'sword',
        price: 10,
        plusDmg: 12,
        desc: "can be use for war but will not last long due to it's durability",
        cState: 1000,
        durability: 1000,
    },
]

export default goblinLoot