const starterBlessings = [
    {
        name: "undying",
        dn: "Apollo's Grace",
        desc: "Apollo the healing God will support you by watching your health as you heal",
        activate: function (det){
            const newRegens = {...det.regens, hp: det.regens.hp+= 2}
            const newDet = {...det, regens: newRegens}
            return newDet
        },
        kolur: 'limegreen'
    },
    {
        name: "oblivion",
        dn: "Atomic Blue",
        desc: "The Mana You will inherit is beyond your reach even witches will mistaken you as a Sage",
        activate: function (det){
            const newDet = {...det, maxMp: det.maxMp += 300}
            return newDet
        },
        kolur: '#66b7b3'
    },
    {
        name: "warbeast",
        dn: "War Beast",
        desc: "With this power you can explore anything in this world without worrying about your stamina, you will have no limits",
        activate: function (det){
            const newDet = {...det, maxSp: det.maxSp += 450}
            return newDet
        },
        kolur: 'yellow'
    },
]

export default starterBlessings;