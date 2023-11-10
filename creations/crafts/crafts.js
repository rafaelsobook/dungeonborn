const AllCrafts = [
    {
        name: "bonfire",
        craftType: "recource",
        rqrdLvl: 1,
        requirements: [
            {
                name: "wood",
                qnty: 3
            }
        ]
    },
    {
        name: "spear",
        weaponName: "villageSpear",
        craftType: "weapon",
        rqrdLvl: 2,
        requirements: [
            {
                name: "wood",
                qnty: 1
            },
            {
                name: "iron",
                qnty: 2
            },
        ],
        desc: 'A useful craft to defend yourself in the wild'
    },
    {
        name: "bedleave",
        craftType: "recource",
        rqrdLvl: 3,
        requirements: [
            {
                name: "leaves",
                qnty: 5
            }
        ],
        desc: 'only make this craft If you are far from monsters, so you can rest well'
    },
    {
        name: "geteld",
        craftType: "recource",
        rqrdLvl: 10,
        requirements: [
            {
                name: "fabric",
                qnty: 5
            },
            {
                name: "leaves",
                qnty: 2
            },
            {
                name: "wood",
                qnty: 3
            }
        ],
        desc: 'Craft this tent if you know your surroundings well'
    },
]

export default AllCrafts;