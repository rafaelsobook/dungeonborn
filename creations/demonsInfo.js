function allDemonz(floorNumber){
    return [
        {
            _id: 'bluedemon1234',
            demonType: "bluedemon", //red// noir
            effects: { effectType: "absorb", absorbType: "mp", defaultAbs: 20, chance: 9, dura: 100, plusDmg: 10*floorNumber, dmgPm: 0 },
            demonColor: {r:0.04, g:0.19, b:0.6}, // red 0.81, 0, 0
            hp: 500*floorNumber,
            maxHp: 500*floorNumber,
            expGain: 100 * floorNumber,
            name: undefined, 
            x: 0, 
            z: 85,
            nType: 'standby', 
            gender: 'male', 
            toWear: {hair: "antaenus", cloth: "bluedemon", pants: "martiz", boots: "silver", hairColor: {r: 0.25,g: 0.08,b:0.08} }, 
            displayW: {name: "oakblade", dmg: 1*floorNumber, isHide: false},
            skillDmg: 50*floorNumber,
            primarySkillDmg: 80*floorNumber,
            armor: {name: "none"},
            _moving: false,
            _attacking: false,
            _talking: false,
            mode: 'stand',
            spd: 2.5,
            condition: "none",
            dirTarg: {x: 0, z: 0},
            speech: "Humans are not allowed here !",
            dyingSpeech: "you lowly humans",
            atkInterval: 1700
        },
        {
            _id: 'reddemon123676',
            demonType: "reddemon", //red// noir
            effects: { effectType: "absorb", absorbType: "mp", defaultAbs: 20, chance: 9, dura: 100, plusDmg: 15*floorNumber, dmgPm: 0 },
            demonColor: {r:0.81, g:0, b:0}, 
            hp: 500*floorNumber,
            maxHp: 500*floorNumber,
            expGain: 100 * floorNumber,
            name: undefined, 
            x: 0, 
            z: 85,
            nType: 'standby', 
            gender: 'male', 
            toWear: {hair: "isveltte", cloth: "bluedemon", pants: "white", boots: "danes", hairColor: {r: 0.25,g: 0.08,b:0.08} }, 
            displayW: {name: "redprince", dmg: 1*floorNumber, isHide: false},
            skillDmg: 50*floorNumber,
            primarySkillDmg: 80*floorNumber,
            armor: {name: "none"},
            _moving: false,
            _attacking: false,
            _talking: false,
            mode: 'stand',
            spd: 2.5,
            condition: "none",
            dirTarg: {x: 0, z: 0},
            speech: "Humans are not allowed here !",
            dyingSpeech: "you lowly humans",
            atkInterval: 1700
        },
    ]
}

export default allDemonz;