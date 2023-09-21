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
        pointsToClaim: 5,
        pointsForUpgrade: 2,
        element: "any",
        requireMode: "any",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "Fireball",
        castDuration: 500,
        returnModeDura: 900,
        skillCoolDown: 5000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 50, chance: 10, bashPower: 10},
        tier: "common",  
        upgradePlus: 60,      
        desc: "This skill can be dangerous depends on the caster"
    },
    {
        name: "rephantasm",
        lvl: 1,
        pointsToClaim: 6,
        pointsForUpgrade: 2,
        element: "normal",
        requireMode: "any",
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
        element: "normal",
        requireMode: "any",
        skillType: "attack", // buff // attack // passive
        animationLoop: false,
        displayName: "Spinning Star",
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
        demand: {name:"sp", minCost: 15, cost: .3}, // percent of mana and min cost
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
        skillType: "normal", // buff // attack // passive // support
        animationLoop: false,
        displayName: "Dash Back",
        castDuration: 10,
        returnModeDura: 900,
        skillCoolDown: 2000,
        demand: {name:"mp", minCost: 20, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 10, chance: 10, bashPower: 10},
        tier: "common",
        upgradePlus: 2,       
        desc: "Enhancing Your feet and dashing backwards with full power in your legs"
    },
    {
        name: "pact",
        lvl: 1,
        pointsToClaim: 10,
        pointsForUpgrade: 7,
        element: "dark",
        requireMode: "any",
        skillType: "buff", // buff // attack // passive
        animationLoop: false,
        displayName: "Summoner's Pact",
        castDuration: 500,
        returnModeDura: 1000,
        skillCoolDown: 1000 * 2,
        demand: {name:"mp", minCost: 200, cost: .3}, // percent of mana and min cost
        effects: { effectType: "damage", dmgPm: 0, plusDmg: 100, chance: 10, bashPower: 10},
        tier: "rare",  
        upgradePlus: 100,      
        desc: "You can consider yourself as a summoner for having this skill. Use this skill on monsters with lower life if the power of this skill plus your magic force is greater than the monster's life then it will increase the chance to capture your target"
    },
    {
        name: "flexaura",
        lvl: 1,
        pointsToClaim: 1,
        pointsForUpgrade: 1,
        element: "normal",
        requireMode: "any",
        skillType: "na", // buff // attack // passive // na
        animationLoop: false,
        displayName: "Flex aura",
        castDuration: 10,
        returnModeDura: 900,
        skillCoolDown: 1000 * 2,
        demand: {name:"mp", minCost: 1, cost: .3}, // percent of mana and min cost
        effects: { effectType: "buff", dmgPm: 0, plusDmg: 0, chance: 10, bashPower: 10},
        tier: "common",  
        upgradePlus: 60,      
        desc: "You can conceal and show your aura, This is best to do when you want someone to easily spot you in some certain places. Your aura can be dense depends on your magic force."
    },
]

export default skills;