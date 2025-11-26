const { combineStats, weaponArray } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

Class.omegaObliteratorBullet = {
    PARENT: 'bullet',
    TYPE: 'immuneBullet',
    DRAW_HEALTH: true,
    IMMUNE_TO_TILES: true,
    ARENA_CLOSER: true,
    DANGER: 999,
    ON: [
        {
            event: "define",
            handler: ({ body }) => {
                body.immuneToTiles = true
            }
        },
        {
            event: "collide",
            handler: ({ instance, other }) => {
                if (other.type == "wall") {
                    instance.health.amount -= 10
                    other.health.amount -= 4000 / (other.SIZE/220)
                    other.settings.drawHealth = true
                    if (other.isDead()) {
                        instance.master.sendMessage(`You destroyed a ${other.label.toLowerCase()}.`)
                        instance.master.skill.score += 10_000 * (other.SIZE/220)
                    }
                }
            }
        }
    ]
}

g.omegaObliterator = combineStats([g.basic, g.pounder, g.destroyer, g.annihilator, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.destroyer, g.destroyer, { health: 1, reload: 0.025, recoil: 1, damage: 10, speed: 5, maxSpeed: 100, range: 10 }])
//TODO: wall fragments
//TODO: tile destruction
Class.omegaObliterator = {
    PARENT: "genericTank",
    LABEL: "Omega Obliterator",
    FACING_TYPE: ["smoothToTarget", { smoothness: 100 }],
    SYNC_WITH_TANK: true,
    DANGER: 9999,
    AUTOSPIN_MULTIPLIER: 0.1,
    SIZE: 200,
    SHAKE: [
        {
            CAMERA_SHAKE: {
                DURATION: 1000,
                AMOUNT: 20 * 2,
            },
            GUI_SHAKE: {
                DURATION: 1000,
                AMOUNT: 4 * 2,
            },
            APPLY_ON_SHOOT: true,   
        },
    ],
    BODY: {
        ACCELERATION: base.ACCEL * 0.75,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 200,
        DAMAGE: base.DAMAGE * 20,
        PENETRATION: base.PENETRATION * 20,
        SHIELD: base.SHIELD * 200,
        REGEN: base.REGEN * 0.5,
        FOV: base.FOV * 0.9,
        DENSITY: base.DENSITY * 20,
        PUSHABILITY: 0.2,
        HETERO: 3
    },
    GUNS: [ 
        {
            POSITION: [8.5, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: g.omegaObliterator,
                NO_LIMITATIONS: true,
                TYPE: "omegaObliteratorBullet"
            },
        },
        ...(() => {
            function create(w = 3) {
                const resultGuns = []
                const splitAmount = 8
                for (let i = 0; i < splitAmount; i++) {
                    
                    const rangeStart = -6
                    const rangeEnd = 6
                    const rangeSpan = rangeEnd - rangeStart

                    const offset = rangeStart + ((i % 13) * rangeSpan) / (splitAmount - 1)
                    resultGuns.push({
                        POSITION: [4, w, 1, 11, offset, 0, 0],
                        PROPERTIES: {
                            SHOOT_SETTINGS: {
                                ...combineStats([g.basic, g.machineGun, g.shotgun, {spray: 4, resist: 100000, speed: 0.3, damage: 0.0, shudder: 8, health: 100000}]),
                                ...{reload: g.omegaObliterator.reload},
                            },
                            TYPE: ["bullet", {
                                ALPHA: 0.5,
                                HITS_OWN_TYPE: "never",
                                IGNORED_BY_AI: true,
                                ARENA_CLOSER: true,
                                IS_IMMUNE_TO_TILES: true,
                                NO_COLLISIONS: true,
                            }],
                        },
                    })
                }
                return resultGuns
            }
            return [
                ...create(3),
                ...create(2),
                ...create(1),
                ...create(1),
                ...create(0.5),
                ...create(0.5),
            ]
        })(),
        {
            POSITION: [20.5, 15, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.omegaObliterator, g.fake]),
                NO_LIMITATIONS: true,
                TYPE: "omegaObliteratorBullet"
            },
        },
        {
            POSITION: [18, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.omegaObliterator, g.fake]),
                NO_LIMITATIONS: true,
                TYPE: "omegaObliteratorBullet",
                COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3}
            },
        },
        
        {
            POSITION: [8, 15, -1.3, 3, 0, 0, 0],
        },
        {
            POSITION: [18, 7, -0.3, 3, 0, 0, 0],
        },

        {
            POSITION: [4, 4, 0.001, 10, 0, -60, 0],
        },
        {
            POSITION: [4, 4, 0.001, 10, 0, -37.5, 0],
        },
        {
            POSITION: [4, 4, 0.001, 10, 0, 60, 0],
        },
        {
            POSITION: [4, 4, 0.001, 10, 0, 37.5, 0],
        },
        {
            POSITION: [8, 4, 0.001, 10, 0, 0, 0],
        },

        {
            POSITION: [2, 2, 0.001, 10, 0, -60, 0],
            PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3} }
        },
        {
            POSITION: [2, 2, 0.001, 10, 0, -37.5, 0],
            PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3} }
        },
        {
            POSITION: [2, 2, 0.001, 10, 0, 60, 0],
            PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3} }
        },
        {
            POSITION: [2, 2, 0.001, 10, 0, 37.5, 0],
            PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3} }
        },
        {
            POSITION: [4, 2, 0.001, 10, 0, 0, 0],
            PROPERTIES: { COLOR: {BASE: -1, BRIGHTNESS_SHIFT: -7.5, SATURATION_SHIFT: 0.3} }
        },

        {
            POSITION: [1, 4.5, 0.9, 9.5, 0, -60, 0],
        },
        {
            POSITION: [1, 4.5, 0.9, 9.5, 0, -37.5, 0],
        },
        {
            POSITION: [1, 4.5, 0.9, 9.5, 0, 60, 0],
        },
        {
            POSITION: [1, 4.5, 0.9, 9.5, 0, 37.5, 0],
        },
        {
            POSITION: [1, 4.5, 0.9, 9.5, 0, 0, 0],
        },

        {
            POSITION: [0.5, 1, 0.001, 7.8, 19, -90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, -19, 90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, 17, -90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, -17, 90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, 15, -90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, -15, 90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, 13, -90, 0],
        },
        {
            POSITION: [0.5, 1, 0.001, 7.8, -13, 90, 0],
        },
    ],
    //would use props but they dont flippin go the right colors for some reason?
    TURRETS: [
        {
            POSITION: {SIZE: 21, X: 0, Y: 0, ANGLE: 180, LAYER: 0},
            TYPE: ["egg", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: 13 + 1, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: ["egg", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: 13, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: ["egg", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: (80 / 20) + 1, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: ["egg", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: 80 / 20, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: ["egg", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 15}, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray(
            {
                POSITION: {
                    SIZE: 1,
                    X: 8.5,
                    Y: 0,
                    ANGLE: 0,
                    LAYER: 1
                },
                TYPE: ["egg", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
            }, 12
        ),
        ...weaponArray(
            {
                POSITION: {
                    SIZE: 1,
                    X: 4.5,
                    Y: 0,
                    ANGLE: 0,
                    LAYER: 1
                },
                TYPE: ["egg", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
            }, 6
        ),
        {
            POSITION: {SIZE: 3, X: 18, Y: 0, ANGLE: 0, LAYER: 1},
            TYPE: ["hexagon", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: 2, X: 18, Y: 0, ANGLE: 0, LAYER: 1},
            TYPE: ["hexagon", {COLOR: {BASE: -1, BRIGHTNESS_SHIFT: 7.5}, MIRROR_MASTER_ANGLE: true}]
        },
        {
            POSITION: {SIZE: 1, X: 0, Y: 0, ANGLE: 180, LAYER: 1},
            TYPE: ["triangle", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
        },
        ...weaponArray(
            {
                POSITION: {
                    SIZE: 0.2,
                    X: 10.65,
                    Y: 0,
                    ANGLE: 0,
                    LAYER: 0
                },
                TYPE: ["triangle", {COLOR: 16, MIRROR_MASTER_ANGLE: true}]
            }, 64
        ),
    ],
}