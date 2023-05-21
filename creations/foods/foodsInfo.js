const foodsInfo = [
    {
        dn: 'berries',
        name: "berries",
        plusHealth: .1, // life x percent (myLife x .5 = toAdd in my health)
        raw: false,
        plus: 10
    },
    {
        dn: "chicken meat",
        name: "chicken",
        plusHealth: .2, // life x percent (myLife x .5 = toAdd in my health)
        raw: true,
        plus: 30
    },
    {
        dn: "minotaur meat",
        name: "minMeatRaw",
        plusHealth: .1, // life x percent (myLife x .5 = toAdd in my health)
        raw: true,
        plus: 20
    },    
    {
        dn: "minotaur meat",
        name: "minMeatCooked",
        plusHealth: .3, // life x percent (myLife x .5 = toAdd in my health)
        raw: false,
        plus: 40
    },
    {
        dn: "goblin head",
        name: "gobHead",
        plusHealth: .2, // life x percent (myLife x .5 = toAdd in my health)
        raw: true,
        plus: 30
    },
    {
        dn: 'small potion',
        name: "spotion",
        plusHealth: .3,
        desc: "A small potion that can generate your life for an amount",
        raw: false,
        plus: 80,
    },
    {
        dn: 'medium potion',
        name: "mpotion",
        plusHealth: .5,
        desc: "A Medium potion that can generate your life for an amount",
        raw: false,
        plus: 200,
    },
    {
        dn: 'big potion',
        name: "bigpotion",
        plusHealth: .6,
        desc: "A Big potion that can generate your life for an amount",
        raw: false,
        plus: 500,
    },
]

export default foodsInfo