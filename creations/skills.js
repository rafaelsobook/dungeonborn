const skills = [
    {
        name: "superPunch",
        element: "normal",
        requireMode: "fist",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "Supreme Punch",
        castDuration: 100, // for long range only
        returnModeDura: 900, // return mode and if will return _casting false
        skillCoolDown: 5000,
        demand: {name: "mp", minCost: 20, cost: .2}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 50, chance: 10, bashPower: 10},
        tier: "common",
        desc: "A common technique to hit your enemy with your fist. Multiply the caster's strength by 2 and additional 30 damage"
    },
    {
        name: "fireBall",
        element: "fire",
        requireMode: "fist",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "Fireball",
        castDuration: 500,
        returnModeDura: 900,
        skillCoolDown: 2000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 50, chance: 10, bashPower: 10},
        tier: "common",        
        desc: "This skill can be dangerous depends on the caster"
    }
]

export default skills;