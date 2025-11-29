const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, makeTurret, addAura, makeMenu, dereference } = require('../facilitators.js');
const g = require('../gunvals.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js')

gunvals: {
    g.turret2 = { reload: 10.5, recoil: 1.4, shudder: 0.1, damage: 0.75, speed: 5, spray: 15 }
    g.double = { recoil: 0.5, shudder: 0.9, health: 0.9, damage: 0.7, spray: 1.2 }
    g.exhaust = { damage: 0.03, size: 0.8, range: 0.05, reload: 0.25, maxSpeed: 0.8, spray: 5.5, shudder: 2.7, speed: 0.25, recoil: 1.1 }
}

projectiles: {

}

bodies: {
    Class.shell = {
        PARENT: "genericTank",
        LABEL: "Shell",
    }
    Class.trim = {
        PARENT: "genericTank",
        LABEL: "Trim",
        SHAPE: 8,
        BODY: {
            ACCELERATION: base.ACCEL * 1.1,
            SPEED: base.SPEED * 1.2,
            HEALTH: base.HEALTH * 0.95
        }
    }
    Class.spine = {
        PARENT: "genericTank",
        LABEL: "Spine",
        BODY: {
            HEALTH: base.HEALTH * 1.1,
            DAMAGE: base.DAMAGE * 1.1
        },
        TURRETS: [
            {
                POSITION: {SIZE: 20.5, X: 0, Y: 0, ANGLE: 0, ARC: 0, LAYER: 0},
                TYPE: ["pentagon", {COLOR: "black"}],
            }
        ]
    },
    Class.layer = {
        PARENT: "genericTank",
        LABEL: "Layer",
        BODY: {
            HEALTH: base.HEALTH * 1.5,
            SPEED: base.SPEED * 0.9,
        },
        TURRETS: [
            {
                POSITION: {SIZE: 15, X: 0, Y: 0, ANGLE: 0, ARC: 0, LAYER: 1},
                TYPE: ["genericTank", {COLOR: -1}],
            }
        ]
    }
    Class.rocket = {
        PARENT: "genericTank",
        LABEL: "Rocket",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 16,
                    WIDTH: 10,
                    ASPECT: 2,
                    X: 0,
                    Y: 0,
                    ANGLE: 180,
                    DELAY: 0
                },
                PROPERTIES: {
                    AUTOFIRE: true,
                    COLOR: -1,
                    SHOOT_SETTINGS: combineStats([g.basic, g.exhaust]),
                    TYPE: "bullet",
                }
            }
        ]
    },
    Class.enchanted = {   
        PARENT: "genericTank",
        LABEL: "Enchanted",
        BODY: {
            HEALTH: base.HEALTH * 0.9
        },
        GUN_STAT_SCALE: { reload: 0.8, recoil: 1, shudder: 0.8, size: 1.1, health: 1.2, damage: 1.2, pen: 1.2, speed: 1.2, maxSpeed: 1.2, range: 1.2, density: 1.2, spray: 0.8, resist: 1.1 },
        TURRETS: [
            {
                POSITION: {SIZE: 10, X: 0, Y: 0, ANGLE: 0, ARC: 0, LAYER: 1},
                TYPE: ["triangle", {COLOR: "purple"}],
            }
        ]
    },

    Class.shell.UPGRADES_TIER_0 = ["trim", "spine", "rocket", "layer", "enchanted"]
}

weapons: {
    Class.none = {
        PARENT: "genericTank",
        LABEL: "None",
    }
    Class.turret = {
        PARENT: "genericTank",
        LABEL: "Turret",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 18,
                    WIDTH: 8,
                    ASPECT: 1,
                    X: 0,
                    Y: 0,
                    ANGLE: 0,
                    DELAY: 0
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.turret2]),
                    TYPE: "bullet",
                }
            }
        ]
    }
    Class.denier = {
        PARENT: "genericTank",
        LABEL: "Denier",
        STAT_NAMES: statnames.trap,
        GUNS: [
            {
                POSITION: {
                    LENGTH: 15,
                    WIDTH: 7
                }
            },
            {
                POSITION: {
                    LENGTH: 3,
                    WIDTH: 7,
                    ASPECT: 1.7,
                    X: 15
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap]),
                    TYPE: "trap",
                    STAT_CALCULATOR: "trap"
                }
            }
        ]
    }
    Class.double = {
        PARENT: "genericTank",
        LABEL: "Double",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 18,
                    WIDTH: 8,
                    ASPECT: 1,
                    X: 0,
                    Y: 5,
                    ANGLE: 0,
                    DELAY: 0
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.double]),
                    TYPE: "bullet",
                }
            },
            {
                POSITION: {
                    LENGTH: 18,
                    WIDTH: 8,
                    ASPECT: 1,
                    X: 0,
                    Y: -5,
                    ANGLE: 0,
                    DELAY: 0.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.double]),
                    TYPE: "bullet",
                }
            }
        ]
    }
    Class.point = {
        PARENT: "genericTank",
        LABEL: "Point",
        STAT_NAMES: {
            BULLET_SPEED: 'Blade Range',
            BULLET_HEALTH: 'Blade Longevity',
            BULLET_PEN: 'Blade Sharpness',
            BULLET_DAMAGE: 'Blade Damage',
            RELOAD: 'Blade Density'
        },
        GUNS: [
            {
                POSITION: [20, 15, 0.001, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, { reload: 0.4, speed: 0.1, maxSpeed: 0.1, range: 0.1, recoil: 0 }]),
                    TYPE: ["bullet", { ALPHA: 0 }],
                    AUTOFIRE: true
                }
            },
            {
                POSITION: [25, 15, 0.001, 0, 0, 0, 0]
            }
        ]
    }

    Class.none.UPGRADES_TIER_0 = ["turret", "denier", "point"]
    //    Class.turret.UPGRADES_TIER_1 = ["double"]
}