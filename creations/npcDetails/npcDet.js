import AllCrafts from "../crafts/crafts.js"

const npcDet = {
    _id: '', 
    name: "", 
    x: 0, 
    z: 57,
    nType: 'standby', 
    gender: 'male', 
    toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0.25,g: 0.08,b:0.08} }, 
    displayW: {name: "none", isHide: false},
    armor: {name: "chiefplate"},
    place: "heartland",
    maxDistance: "none",
    _moving: false,
    _attacking: false,
    _minning: false,
    _training: false,
    _talking: false,
    mode: 'stand',
    spd: .1,
    condition: "none",
    dirTarg: {x: -5, z: 0},
    speech: [{name: 'barney', message: "don't talk to me peasant ..."}, {name: 'barney', message: "Mind you own business ..."}],
    secSpeech: [{name: 'barney', message: "How's the journey going in ..."}, {name: 'barney', message: "I heard there are some evil spirit at night ..."}, {name: 'barney', message: "hmm ... I wonder If they are strong ..."}],
} 
const randomNum = () => {
    return Math.random().toString().split(".")[1]
}
const npcInfos = [
    {
        _id: 'npc101', 
        name: "oaklin", 
        x: 5, 
        z: 13,
        nType: 'standby', 
        gender: 'male', 
        toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0.25,g: 0.08,b:0.08} }, 
        displayW: {name: "huntingsword", isHide: false},
        armor: {name: "chiefplate"},
        place: "heartland",
        _moving: false,
        _attacking: false,
        _minning: false,
        _training: false,
        mode: 'stand',
        spd: .1,
        condition: function (player) {
            if(player.rank === "none") return this.speech
            return this.secSpeech
        },
        dirTarg: {x: 4, z: 15},
        speech: [{name: 'oaklin', message: "Hi there, Just Go Straight and you will find the guild house"}, {name: 'oaklin', message: "I'm an Adventurer but I only take smaller quest. I'm not risking my life like the others did for a small amount of money..."}],
        secSpeech: [{name: 'oaklin', message: "Always watch your back outthere"}, {name: 'oaklin', message: "Not only the monsters that we should be afraid off ..."}]
    },
    {
        _id: 'npc102', 
        name: "Eugo", 
        x: -5, 
        z: 57,
        nType: 'standby', 
        gender: 'male', 
        toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0.25,g: 0.08,b:0.08} }, 
        displayW: {name: "huntingsword", isHide: false},
        armor: {name: "chiefplate"},
        place: "heartland",
        _moving: false,
        _attacking: false,
        _minning: false,
        _training: false,
        mode: 'stand',
        spd: .1,
        condition: function (player) {
            if(player.rank === "none") return this.speech
            return this.secSpeech
        },
        dirTarg: {x: -5, z: 0},
        speech: [{name: 'Eugo', message: "Do you want to be an Adventurer as well ..."}, {name: 'Eugo', message: "Goodluck with that kid ..."}],
        secSpeech: [{name: 'Eugo', message: "How's the Adventurer Life"}, {name: 'Eugo', message: "If you leave here, Out in the swamp forest ... you might find a cave"}, {name: 'Eugo', message: "beyond that leads to an unknown place.. I heard there's a lot of things going there"}],
    },
    {
        _id: 'npc43223', 
        name: "Anton", 
        x: -3.7, 
        z: -7,
        nType: 'standby', 
        gender: 'male', 
        toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0,g: 0.08,b:0.08} }, 
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        _moving: false,
        _attacking: false,
        _minning: false,
        _training: false,
        mode: 'stand',
        spd: .1,
        condition: function (player) {
            if(!player.places.some(plcName => plcName === "swampforest")) return this.speech
            return this.secSpeech
        },
        dirTarg: {x: 0, z: 0},
        speech: [{name: 'Anton', message: "That Gate ahead is old, Older than me but stronger than anyone in here ... Haha"}, {name: 'Anton', message: "Adventurers should always take an extra careful outside ..."}, {name: 'Anton', message: "No one knows what might show in there ..."}],
        secSpeech: [{name: 'Anton', message: "Have you seen it ?"}, {name: 'Anton', message: "That red skin in human form ..."}, {name: 'Eugo', message: "Hundreds of them are killed, but no one beleived me ..."}],
    },
    {
        _id: 'npcGuard42', 
        name: "Juleus Guard", 
        x: 4.31, 
        z: -77.9,
        nType: 'standby', 
        gender: 'male', 
        toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0,g: 0.08,b:0.08} }, 
        displayW: {name: "dgerSpear", isHide: false},
        armor: {name: "karba"},
        place: "heartland",
        _moving: false,
        _attacking: false,
        _minning: false,
        _training: false,
        mode: 'stand',
        spd: .1,
        condition: function (player) {
            if(!player.places.some(plcName => plcName === "swampforest")) return this.speech
            return this.secSpeech
        },
        dirTarg: {x: 4.31, z: -60},
        speech: [{name: 'Juleus', message: "Haven't seen you around here ..."}, {name: 'Juleus', message: "You already know the risk boy ..."}],
        secSpeech: [{name: 'Juleus', message: "I sworn to protect this village no matter what's beyond"}, {name: 'Juleus', message: "I will stand firm !"}],
    },
    {
        _id: 'npcGuard4221', 
        name: "Adonis Guard", 
        x: -4.31, 
        z: -77.9,
        nType: 'standby', 
        gender: 'male', 
        toWear: {hair: "antaenus", cloth: "grand", pants: "brown", boots: "silver", hairColor: {r: 0,g: 0.08,b:0.08} }, 
        displayW: {name: "villageSpear", isHide: false},
        armor: {name: "chiefplate"},
        place: "heartland",
        _moving: false,
        _attacking: false,
        _minning: false,
        _training: false,
        mode: 'stand',
        spd: .1,
        condition: function (player) {
            if(player.lvl > 10) return this.secSpeech
            return this.speech
        },
        dirTarg: {x: -4.31, z: -60},
        speech: [{name: 'Adonis', message: "Can you treat me some beer kid"}, {name: 'Adonis', message: "Ahhh ... I'm thirsty standing here ..."}],
        secSpeech: [{name: 'Adonis', message: "Never saw a High Level Adventurer Before"}, {name: 'Adonis', message: "Seems you've killed a lot of monsters out there"}],
    },
    {...npcDet,
        _id: 'npc104342',
        name: 'barney',
        nType: "walker",
        x: 0,
        z: 57,
        toWear: {hair: "antaenus", cloth: "inigma", pants: "brown", boots: "classic", hairColor: {r: 0.65,g: 0.02,b:0.07} },
        displayW: {name: "huntingsword", isHide: false},
        armor: {name: "chiefplate"},
        place: "heartland",
        maxDistance: { x: 0, z: -50, chaceToStop: 8},
        _moving: true,
        spd: .1,
        condition: function (player) {
            if(player.lvl <= 3) return this.speech
            return [{name: 'barney', message: "Sorry about last time, By the way I heard your name on the guild ..."}, {name: 'barney', message: "Not all Adventurer have an aptitude for magic ... "}, {name: 'barney', message: `Ohhh ... And You're already lvl ${player.lvl} ... SANA ALL !`}]
        },
        dirTarg: {x: -5, z: 0},
        speech: [{name: 'barney', message: "don't talk to me peasant ... Move Away !"}, {name: 'barney', message: "Mind your own business ..."}],
    },
    {...npcDet,
        _id: "npc5sdas",
        name: 'aegon',
        nType: "walker",
        x: 40,
        z: -14,
        toWear: {hair: "aegon", cloth: "grand", pants: "brown", boots: "classic", hairColor: {r: 0.065,g: 0.02,b:0.07} },
        displayW: {name: "normal", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: { x: -10, z: -16, chaceToStop: 8},
        _moving: true,
        spd: .1,
        condition: function (player) {
            console.log(player.lvl)
            if(parseInt(player.lvl) <= 5) {
                
                return this.speech
            }
            
            return this.secSpeech
        },
        dirTarg: {x: -5, z: 0},
        speech: [{name: 'aegon', message: "I'm thinking something ..."}, {name: 'aegon', message: "Should I go explore the dungeon ..."}, {name: 'aegon', message: "I heard people never came back after going there ..."}],
        secSpeech: [{name: 'aegon', message: "I can feel your strength ..."}, {name: 'aegon', message: "Maybe you're already above level 5"}, {name: 'barney', message: "I wish I can be as strong as you ... hays"}],
    },
    {...npcDet,
        _id: "npc5218",
        name: 'capricorn',
        nType: "walker",
        x: 30,
        z: -10,
        toWear: {hair: "isveltte", cloth: "inigma", pants: "brown", boots: "sinbad", hairColor: {r: 0.26,g: 0.16,b:0.88}},
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: { x: -20, z: -13, chaceToStop: 8},
        _moving: true,
        spd: .1,
        condition: function (player) {
            if(parseInt(player.lvl) <= 5) {
                return this.speech
            }
            return this.secSpeech
        },
        dirTarg: {x: -20, z: -13},
        speech: [{name: 'capricorn', message: "I want to go outside the gate"}, {name: 'capricorn', message: "But I heard there are lots of goblin outside ..."}],
        secSpeech: [{name: 'capricorn', message: "You must be a goblin slayer ..."}, {name: 'capricorn', message: "You look so strong ..."}, {name: 'barney', message: "Still ... Be careful out there"}],
    },
    {...npcDet,
        _id: "npc68",
        name: 'lucard',
        nType: "walker",
        x: 0,
        z: -10,
        toWear: {hair: "antaenus", cloth: "capkelvins", pants: "martiz", boots: "sinbad", hairColor: {r: 0.26,g: 0.16,b:0.88}},
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: { x: -50, z: -13, chaceToStop: 5},
        _moving: true,
        spd: .1,
        condition: function (player) {
            if(parseInt(player.lvl) <= 5) {
                return this.speech
            }
            return this.secSpeech
        },
        dirTarg: {x: -50, z: -13},
        speech: [{name: 'lucard', message: "There's a huge Monster on the forest ..."}, {name: 'lucard', message: "I heard It kills more than enough of adventurers ..."}],
        secSpeech: [{name: 'lucard', message: "!! You are the Monster Slayer ..."}, {name: 'lucard', message: "We Are Grateful for your service ..."}, {name: 'lucard', message: "Take care on your Journey ..."}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'fox',
        nType: "walker",
        x: 35,
        z: -21,
        toWear: {hair: "antaenus", cloth: "none", pants: "brown", boots: "sinbad", hairColor: {r: 0,g: 0,b:0}},
        displayW: {name: "grimblue", isHide: false},
        armor: {name: "hydra"},
        place: "heartland",
        maxDistance: { x: -50, z: -20, chaceToStop: 5},
        _moving: true,
        spd: .1,
        condition: function(player){
            if(player.weapon.name === 'grimblue') return this.secSpeech
            return this.speech
        },
        dirTarg: {x: -50, z: -20},
        speech: [{name: 'fox', message: "Hmmm ... What's that ?"}, {name: 'fox', message: "Yeah thought So ...."}],
        secSpeech: [{name: 'fox', message: "Your sword ..."}, {name: 'fox', message: "Never mind ... Name is fox see you around."}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'orland',
        nType: "walker",
        x: 55,
        z: -57,
        toWear: {hair: "isveltte", cloth: "zyger", pants: "martiz", boots: "sinbad", hairColor: {r: 1,g: 1,b:0}},
        displayW: {name: "huntingsword", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: { x: -50, z: -58, chaceToStop: 3},
        _moving: true,
        spd: .1,
        condition: 'none',
        dirTarg: {x: -50, z: -58},
        speech: [{name: 'orland', message: "I'm looking for herbs right now ..."}, {name: 'orland', message: "I used it to treat my wounds ... see yah !"}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'Zalt',
        nType: "walker",
        x: -55,
        z: -60,
        toWear: {hair: "aegon", cloth: "zyger", pants: "martiz", boots: "sinbad", hairColor: {r: .2,g: .4,b:.01}},
        displayW: {name: "ruztysword", isHide: false},
        armor: {name: "chiefplate"},
        place: "heartland",
        maxDistance: { x: 30, z: -60, chaceToStop: 3},
        _moving: true,
        spd: .1,
        condition: 'none',
        dirTarg: {x: 30, z: -60},
        speech: [{name: 'Zalt', message: "I almost had him !"}, {name: 'zalt', message: "If only that boy didn't show up ! ..."}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'stephen',
        nType: "standby",
        x: -10,
        z: -20,
        toWear: {hair: "aegon", cloth: "zyger", pants: "brown", boots: "sinbad", hairColor: {r: 0,g: .2,b:.7}},
        displayW: {name: "huntingsword", isHide: false},
        armor: {name: "none"},
        place: "swampforest",
        maxDistance: 'none',
        _moving: true,
        spd: .1,
        condition: 'none',
        dirTarg: {x:0, z: 0},
        speech: [{name: 'stephen', message: "I want to go Inside but I'm still scared ..."}, {name: 'stephen', message: "I hear there's so many demon inside that even heroes are afraid of it ..."}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'chad',
        nType: "standby",
        x: 6,
        z: -63.7,
        toWear: {hair: "aegon", cloth: "grand", pants: "brown", boots: "sinbad", hairColor: {r: .5,g: 0,b:.7}},
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: 'none',
        _moving: false,
        spd: .1,
        condition: 'none',
        dirTarg: {x:0, z: -80},
        speech: [{name: 'chad', message: "I'm waiting for my brother, It's been a week since he go out this gate"}, {name: 'chad', message: "He Promised he will return after taking one of the dungeon's Orb "}],
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'niko',
        nType: "standby",
        x: -6 + Math.random()*10,
        z: 51.3,
        toWear: {hair: "aegon", cloth: "grand", pants: "brown", boots: "sinbad", hairColor: {r: .1,g: .1,b:1}},
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: 'none',
        _moving: false,
        spd: .1,
        condition: function(playerDet){
            if(playerDet.storyQue.some(stry => stry === "firstFriend")){
                console.log('still have it ', playerDet.storyQue )
                return this.speech(playerDet.name)
            }else{
                console.log("no more friend here")
                return this.secSpeech
            }
        },
        dirTarg: {x:0, z: 80},
        speech: function(mainName){
            return [{ name: mainName, message: "I'm looking for someone named Niko" },{name: 'Niko', message: "You must be him, I'm Informed I will see you here..."}, {name: 'Niko', message: "I Know the Person who sent you here, No One must know how you got In here and where you came from ..."}, {name: 'Niko', message: "I'm here to support you In your Journey, He told me that you might need something ..."}]
        },
        secSpeech: [{name: "Niko", message: "Goodluck On Your Journey, If you want to rest you can rent in one of the apartments"}, {name: "Niko", message: "Having a good meal and enough rest will keep your focus"}, {name: "Niko", message: "You can sometimes find me here, I have some quests going on ... I might not be here always "}]
    },
    {...npcDet,
        _id: `npc${randomNum()}`,
        name: 'jericho',
        nType: "walker",
        x: 20,
        z: 0,
        toWear: {hair: "antaenus", cloth: "grand", pants: "magios", boots: "sinbad", hairColor: {r: .7,g: .2,b:0}},
        displayW: {name: "none", isHide: false},
        armor: {name: "none"},
        place: "heartland",
        maxDistance: { x: 50, z: 0, chaceToStop: 1},
        _moving: true,
        spd: .1,
        condition: function(player){
            let toReturn = {theSpeech: undefined, additionalDet: undefined}
            let toLearn = [];
            let crftNames = []
            if(!player.mycrafts.length) return {theSpeech: this.speechForBonfire, additionalDet: [AllCrafts[0]]}
            
            AllCrafts.forEach(crft => {
                if(crft.name === "bonfire") return
                if(crft.rqrdLvl <= player.lvl){
                    const isLearned = player.mycrafts.some(mycrft => mycrft.name === crft.name)
                    if(isLearned) return
                    crftNames.push(crft.name)
                    toLearn.push(crft);
                }
            })

            if(!toLearn.length) return {theSpeech: this.speech, additionalDet: undefined}
            
            return {theSpeech: this.nextSpeech(crftNames), additionalDet: toLearn}
        },
        dirTarg: {x: -50, z: -20},
        speechForBonfire: [{name: 'jericho', message: "Are you a traveler, I've never seen you here ..."},{name: 'jericho', message: "For your safety, I will teach you a craft ..."}, {name: 'jericho', message: "For now I'll teach you how to make a bonfire, a useful craft for survival"},{name: 'jericho', message: "If you are out in the wild you can simply craft it so evil spirits will not attempt to touch you"}],
        nextSpeech: function (crftNames) { return [{name: "jericho", message: "You are good out there ..."}, {name: "jericho", message: `Let me teach you a new craft ...`},{name: "jericho", message: `learn how to craft ${crftNames.length > 1 ? crftNames.join(" and ") : crftNames[0]}`}] },
        speech: [{name: 'jericho', message: "I hope this crafts will help you in your journey"}, {name: 'jericho', message: "Enjoy Adventuring ! Be Safe there ..."}],
        errSpeech: [{name: "jericho", message: "hmmm ... I don't know what crafts are in my mind right now"}]
    },
]


export default npcInfos