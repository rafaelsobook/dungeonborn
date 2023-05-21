const allRings = [
    {
        name: "ringOfSummon",
        dn: "Summoner's Ring",
        effectType: "summon",
        plusDmg: 40,
        plusDef: 10,
        additional: { for: "hp", amount: 500 }
    },
    {
        name: "ringOfWeapon",
        dn: "Creation Ring",
        effectType: "createWeapon",
        plusDmg: 40,
        plusDef: 10,
        additional: { for: "hp", amount: 500 }
    },
]

export default allRings;