Class.dogeiscut_kitBodega_goggle_lense = {
    SHAPE: 6,
    COLOR: "#ff0066",
}

Class.dogeiscut_kitBodega_goggle = {
    SHAPE: 6,
    COLOR: "#fbde44",
    PROPS: [
        {
            POSITION: {SIZE: 13, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: "dogeiscut_kitBodega_goggle_lense",
        }
    ]
}

Class.dogeiscut_kitBodega = {
    PARENT: "genericTank",
    LABEL: "Kit Bodega",
    NAME: "Kit",
    COLOR: "#ddb676",
    TEAM: 1192002154571,
    GUNS: [
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 15,
                ASPECT: 1,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                TYPE: "bullet",
                COLOR: "#db5951"
            }
        },
        {
            POSITION: {
                LENGTH: 18,
                WIDTH: 18,
                ASPECT: -0.8,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                COLOR: "#fbde44"
            }
        },
    ],
    PROPS: [
        {
            POSITION: {SIZE: 10, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: "dogeiscut_kitBodega_goggle",
        }
    ]
}

Class.menu_addons.UPGRADES_TIER_0.push("dogeiscut_kitBodega");