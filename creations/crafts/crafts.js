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
                qnty: 1
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
                qnty: 2
            }
        ],
        desc: 'only make this craft If you are far from monsters, so you can rest well'
    },
]

export default AllCrafts;