const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, makeTurret, makeAura, makeMenu, dereference } = require('../facilitators.js');
const g = require('../gunvals.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js')

const addonPrefix = "dcsut_"

gunvals: {
    g[addonPrefix + "turret"] = { reload: 10.5, recoil: 1.4, shudder: 0.1, damage: 0.75, speed: 5, spray: 15 }
    g[addonPrefix + "double"] = { recoil: 0.5, shudder: 0.9, health: 0.9, damage: 0.7, spray: 1.2 }
    g[addonPrefix + "exhaust"] = { damage: 0.03, size: 0.8, range: 0.05, reload: 0.25, maxSpeed: 0.8, spray: 5.5, shudder: 2.7, speed: 0.25, recoil: 1.1 }
}

projectiles: {

}

bodies: {
    Class[addonPrefix + "shell"] = {
        PARENT: "genericTank",
        LABEL: "Shell",
    }
    Class[addonPrefix + "trim"] = {
        PARENT: "genericTank",
        LABEL: "Trim",
        SHAPE: 8,
        BODY: {
            ACCELERATION: base.ACCEL * 1.1,
            SPEED: base.SPEED * 1.2,
            HEALTH: base.HEALTH * 0.95
        }
    }
    Class[addonPrefix + "spine"] = {
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
    Class[addonPrefix + "layer"] = {
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
    Class[addonPrefix + "rocket"] = {
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
                    SHOOT_SETTINGS: combineStats([g.basic, g[addonPrefix + "exhaust"]]),
                    TYPE: "bullet",
                }
            }
        ]
    },
    Class[addonPrefix + "enchanted"] = {   
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

    Class[addonPrefix + "shell"].UPGRADES_TIER_0 = [addonPrefix + "trim", addonPrefix + "spine", addonPrefix + "rocket", addonPrefix + "layer", addonPrefix + "enchanted"]
}

weapons: {
    Class[addonPrefix + "none"] = {
        PARENT: "genericTank",
        LABEL: "None",
    }
    Class[addonPrefix + "turret"] = {
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
                    SHOOT_SETTINGS: combineStats([g[addonPrefix + "turret"]]),
                    TYPE: "bullet",
                }
            }
        ]
    }
    Class[addonPrefix + "denier"] = {
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
    Class[addonPrefix + "double"] = {
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
                    SHOOT_SETTINGS: combineStats([g.basic, g[addonPrefix + "double"]]),
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
                    SHOOT_SETTINGS: combineStats([g.basic, g[addonPrefix + "double"]]),
                    TYPE: "bullet",
                }
            }
        ]
    }
    Class[addonPrefix + "point"] = {
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

    Class[addonPrefix + "none"].UPGRADES_TIER_0 = [addonPrefix + "turret", addonPrefix + "denier", addonPrefix + "point"]
    //    Class.turret.UPGRADES_TIER_1 = [addonPrefix + "double"]
}