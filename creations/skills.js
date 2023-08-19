const skills = [
    {
        name: "superPunch",
        lvl: 1,
        pointsToClaim: 1,
        pointsForUpgrade: 1,
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
        upgradePlus: 25,
        desc: "A common technique to hit your enemy with your fist. Multiply the caster's strength by 2 and additional 30 damage"
    },
    {
        name: "fireBall",
        lvl: 1,
        pointsToClaim: 3,
        pointsForUpgrade: 2,
        element: "any",
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
        upgradePlus: 20,      
        desc: "This skill can be dangerous depends on the caster"
    },
    {
        name: "rephantasm",
        lvl: 1,
        pointsToClaim: 5,
        pointsForUpgrade: 2,
        element: "any",
        requireMode: "fist",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "re: phantasm",
        castDuration: 800,
        returnModeDura: 900,
        skillCoolDown: 5000,
        demand: {name:"mp", minCost: 50, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 200, chance: 10, bashPower: 10},
        tier: "rare",  
        upgradePlus: 130,      
        desc: "The Sharpness of your pride, A great magic for war"
    },
    {
        name: "spinningStar",
        lvl: 1,
        pointsToClaim: 3,
        pointsForUpgrade: 2,
        element: "fire",
        requireMode: "any",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "Fireball",
        castDuration: 500,
        returnModeDura: 900,
        skillCoolDown: 2000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 50, chance: 10, bashPower: 10},
        tier: "common",  
        upgradePlus: 20,      
        desc: "Making a fire that guides and support you, to make sure you are safe"
    },
    {
        name: "leap",
        lvl: 1,
        pointsToClaim: 3,
        pointsForUpgrade: 1,
        element: "normal",
        requireMode: "any",
        skillType: "attack", // buff // attack // passive // support
        animationLoop: false,
        displayName: "Leap",
        castDuration: 10,
        returnModeDura: 900,
        skillCoolDown: 2000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 10, chance: 10, bashPower: 10},
        tier: "common",
        upgradePlus: 2,       
        desc: "Enhancing Your feet and dashing forward with full power in your legs"
    },
    {
        name: "backdash",
        lvl: 1,
        pointsToClaim: 3,
        pointsForUpgrade: 1,
        element: "normal",
        requireMode: "any",
        skillType: "Dash Back", // buff // attack // passive // support
        animationLoop: false,
        displayName: "Leap",
        castDuration: 10,
        returnModeDura: 900,
        skillCoolDown: 2000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 10, chance: 10, bashPower: 10},
        tier: "common",
        upgradePlus: 2,       
        desc: "Enhancing Your feet and dashing backwards with full power in your legs"
    }
]

export default skills;