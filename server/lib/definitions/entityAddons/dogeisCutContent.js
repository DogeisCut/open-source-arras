const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, makeTurret, makeAura, makeMenu, dereference, weaponMirror, makeDrive, makePolygon, makeRelic } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const { createLine, createSpringConstraint } = require('./constraints.js'); // TODO: disable tanks that use this if constraints arent there
const g = require('../gunvals.js');

/* Config */

const enableUnfinishedTanks = false

const oldgunvals = {
// Bases
    basic: { reload: 10.5, recoil: 1.4, shudder: 0.1, damage: 0.75, speed: 5, spray: 15 },
    drone: { reload: 36, recoil: 0.25, shudder: 0.1, size: 0.6, speed: 1.5, spray: 0.1 },
    trap: { reload: 23, shudder: 0.25, size: 0.7, damage: 0.75, speed: 3.25, resist: 3, spray: 0 },
    swarm: { reload: 23, recoil: 0.25, shudder: 0.05, size: 0.4, damage: 0.75, speed: 4, spray: 5 },
    factory: { reload: 48, shudder: 0.1, size: 0.7, damage: 0.75, speed: 3, spray: 0.1 },
    productionist: { reload: 56, recoil: 0.25, shudder: 0.05, size: 0.7, damage: 0.75, speed: 4, range: 1.5, spray: 5 },

// Spammers
    desmos: { reload: 1.1, range: 1.2, shudder: 0, spray: 0, damage: 0.75, speed: 0.5 },
    single: { reload: 1.05, speed: 1.05 },
    twin: { recoil: 0.5, shudder: 0.9, health: 0.9, damage: 0.7, spray: 1.2 },
    doubleTwin: { damage: 1.1 },
    tripleTwin: { health: 1.1 },
    hewnDouble: { reload: 1.25, recoil: 1.5, health: 0.9, damage: 0.85, maxSpeed: 0.9 },
    tripleShot: { reload: 1.1, shudder: 0.8, health: 0.9, pen: 0.8, density: 0.8, spray: 0.5 },
    spreadshotMain: { reload: 0.781, recoil: 0.25, shudder: 0.5, health: 0.5, speed: 1.923, maxSpeed: 2.436 },
    spreadshot: { reload: 1.5, shudder: 0.25, speed: 0.7, maxSpeed: 0.7, spray: 0.25 },
    triplet: { reload: 1.2, recoil: 2/3, shudder: 0.9, health: 0.85, damage: 0.85, pen: 0.9, density: 1.1, spray: 0.9, resist: 0.95 },
    turret: { reload: 2, health: 0.8, damage: 0.6, pen: 0.7, density: 0.1 },
    autoTurret: { reload: 0.9, recoil: 0.75, shudder: 0.5, size: 0.8, health: 0.9, damage: 0.6, pen: 1.2, speed: 1.1, range: 0.8, density: 1.3, resist: 1.25 },
    quint: { reload: 1.5, recoil: 0.667, shudder: 0.9, pen: 0.9, density: 1.1, spray: 0.9, resist: 0.95 },
    machineShot: { reload: 0.3, recoil: 0.8, shudder: 0.4, health: 0.7, damage: 0.7, speed: 4.5, maxSpeed: 5.9, spray: 19 },

// Snipers
    sniper: { reload: 1.35, shudder: 0.25, damage: 0.8, pen: 1.1, speed: 1.5, maxSpeed: 1.5, density: 1.5, spray: 0.2, resist: 1.15 },
    crossbow: { reload: 2, health: 0.6, damage: 0.6, pen: 0.8 },
    assassin: { reload: 1.65, shudder: 0.25, health: 1.15, pen: 1.1, speed: 1.18, maxSpeed: 1.18, density: 3, resist: 1.3 },
    hunter: { reload: 1.5, recoil: 0.7, size: 0.95, damage: 0.9, speed: 1.1, maxSpeed: 0.8, density: 1.2, resist: 1.15 },
    hunterSecondary: { size: 0.9, health: 2, damage: 0.5, pen: 1.5, density: 1.2, resist: 1.1 },
    predator: { reload: 1.4, size: 0.8, health: 1.5, damage: 0.9, pen: 1.2, speed: 0.9, maxSpeed: 0.9 },
    dual: { reload: 2, shudder: 0.8, health: 1.5, speed: 1.3, maxSpeed: 1.1, resist: 1.25 },
    rifle: { reload: 0.8, recoil: 0.8, shudder: 1.5, health: 0.8, damage: 0.8, pen: 0.9, spray: 2 },
    blunderbuss: { recoil: 0.1, shudder: 0.5, health: 0.4, damage: 0.2, pen: 0.4, spray: 0.5 },
    railgun: { reload: 4.2, damage: 0.81, health: 3.06, resist: 2.3, density: 0.7, speed: 1.375, maxSpeed: 1.375 },
    marksman: { pen: 2, damage: 0.12, health: 25/3, reload: 1.75 },

// Machine guns
    machineGun: { reload: 0.5, recoil: 0.8, shudder: 1.7, health: 0.7, damage: 0.7, maxSpeed: 0.8, spray: 2.5 },
    minigun: { reload: 1.25, recoil: 0.6, size: 0.8, health: 0.55, damage: 0.45, pen: 1.25, speed: 1.33, density: 1.25, spray: 0.5, resist: 1.1 },
    streamliner: { reload: 1.1, recoil: 0.6, damage: 0.65, speed: 1.24 },
    nailgun: { reload: 0.85, recoil: 2.5, size: 0.8, damage: 0.7, density: 2 },
    pelleter: { reload: 1.25, recoil: 0.25, shudder: 1.5, size: 1.1, damage: 0.35, pen: 1.35, speed: 0.9, maxSpeed: 0.8, density: 1.5, spray: 1.5, resist: 1.2 },
    gunner: { recoil: 0.25, shudder: 1.5, size: 1.2, health: 1.35, damage: 0.25, pen: 1.25, speed: 0.8, maxSpeed: 0.65, density: 1.5, spray: 1.5, resist: 1.2 },
    machineGunner: { reload: 0.66, recoil: 0.8, shudder: 2, damage: 0.75, speed: 1.2, maxSpeed: 0.8, spray: 2.5 },
    blaster: { recoil: 1.2, shudder: 1.25, size: 1.1, health: 1.5, pen: 0.6, speed: 0.8, maxSpeed: 0.33, range: 0.6, density: 0.5, spray: 1.5, resist: 0.8 },
    focal: { reload: 1.25, recoil: 4/3, shudder: 0.8, health: 0.8, pen: 1.1, speed: 1.25, maxSpeed: 1.25, range: 1.1, density: 1.25, spray: 0.5, resist: 1.1 },
    atomizer: { reload: 0.3, recoil: 0.8, size: 0.5, damage: 0.75, speed: 1.2, maxSpeed: 0.8, spray: 2.25 },
    spam: { reload: 1.1, size: 1.05, damage: 1.1, speed: 0.9, maxSpeed: 0.7, resist: 1.05 },
    gunnerDominator: { reload: 1.1, recoil: 0, shudder: 1.1, size: 0.5, health: 0.5, damage: 0.5, speed: 1.1, density: 0.9, spray: 1.2, resist: 0.8 },

// Flanks
    flankGuard: { recoil: 1.2, health: 1.02, damage: 0.81, pen: 0.9, maxSpeed: 0.85, density: 1.2 },
    cyclone: { health: 1.3, damage: 1.3, pen: 1.1, speed: 1.5, maxSpeed: 1.15 },
    triAngle: { recoil: 0.9, health: 0.9, speed: 0.8, maxSpeed: 0.8, range: 0.6 },
    triAngleFront: { recoil: 0.2, speed: 1.3, maxSpeed: 1.1, range: 1.5 },
    thruster: { recoil: 1.5, shudder: 2, health: 0.5, damage: 0.5, pen: 0.7, spray: 0.5, resist: 0.7 },

// Drones
    overseer: { reload: 1.25, size: 0.85, health: 0.7, damage: 0.8, maxSpeed: 0.9, density: 2 },
    overdrive: { reload: 2.5, health: 0.8, damage: 0.8, pen: 0.8, speed: 0.9, maxSpeed: 0.9, range: 0.9, spray: 1.2 },
    commander: { reload: 1.5, health: 0.4, damage: 0.7 },
    baseProtector: { reload: 0.7, size: 1.5, recoil: 0.000001, health: 100, speed: 2.3, maxSpeed: 1.1, range: 0.5, density: 5, resist: 10 },
    battleship: { health: 1.25, damage: 1.15, maxSpeed: 0.85, resist: 1.1 },
    carrier: { reload: 1.5, damage: 0.8, speed: 1.3, maxSpeed: 1.2, range: 1.2 },
    bee: { reload: 1.3, size: 1.4, damage: 1.5, pen: 0.5, speed: 1.5, maxSpeed: 1.5, density: 0.25 },
    sunchip: { reload: 4, size: 1.4, health: 0.5, damage: 0.4, pen: 0.6, density: 0.8 },
    maleficitor: { reload: 0.25, size: 1.05, health: 1.15, damage: 1.15, pen: 1.15, speed: 0.8, maxSpeed: 0.8, density: 1.15 },
    summoner: { reload: 0.3, size: 1.125, health: 0.5, damage: 0.345, pen: 0.4, density: 0.8 },
    minionGun: { recoil: 0, shudder: 2, health: 0.4, damage: 0.4, pen: 1.2, range: 0.75, spray: 2 },
    babyfactory: { reload: 1.5, maxSpeed: 1.25 },
    bigCheese: { reload: 1.5, size: 1.8, health: 2.5, speed: 1.25 },
    mothership: { reload: 1.25, pen: 1.1, speed: 0.775, maxSpeed: 0.8, range: 15, resist: 1.15 },
    satellite: { size: 0.8, reload: 3, damage: 1.875 },

// Heavy cannons
    pounder: { reload: 2, recoil: 1.6, damage: 2, speed: 0.85, maxSpeed: 0.8, density: 1.5, resist: 1.15 },
    destroyer: { reload: 2, recoil: 1.8, shudder: 0.5, health: 2, damage: 0.90, pen: 1.2, speed: 0.50, maxSpeed: 0.6, density: 2, resist: 3 },
    annihilator: { reload: 1, recoil: 1.35, damage: 0.86 },
    hive: { reload: 1.5, recoil: 0.8, size: 0.8, health: 0.7, damage: 0.3, maxSpeed: 0.6 },
    artillery: { reload: 1.2, recoil: 0.7, size: 0.9, speed: 1.15, maxSpeed: 1.1, density: 1.5 },
    mortar: { reload: 1.2, health: 1.1, speed: 0.8, maxSpeed: 0.8 },
    shotgun: { reload: 8, recoil: 0.4, size: 1.5, damage: 0.4, pen: 0.8, speed: 1.8, maxSpeed: 0.6, density: 1.2, spray: 1.2 },
    destroyerDominator: { reload: 6.5, recoil: 0, size: 0.975, health: 5, damage: 5, pen: 5, speed: 0.575, maxSpeed: 0.475, spray: 0.5 },

// Missiles
    launcher: { reload: 1.5, recoil: 1.5, shudder: 0.1, size: 0.72, health: 1.05, damage: 0.925, speed: 0.9, maxSpeed: 1.2, range: 1.1, resist: 1.5 },
    skimmer: { recoil: 0.8, shudder: 0.8, size: 0.9, health: 1.35, damage: 0.8, pen: 2, speed: 0.85, maxSpeed: 0.85, resist: 1.1 },
    snake: { reload: 0.4, shudder: 4, health: 1.5, damage: 0.9, pen: 1.2, speed: 0.1, maxSpeed: 0.35, density: 3, spray: 6, resist: 0.5 },
    snakeskin: { reload: 0.6, shudder: 2, health: 0.5, damage: 0.5, speed: 2, maxSpeed: 0.2, range: 0.4, spray: 5 },
    sidewinder: { reload: 1.5, recoil: 2, health: 1.5, damage: 0.9, speed: 0.15, maxSpeed: 0.5 },
    rocketeer: { reload: 1.4, shudder: 0.9, size: 1.2, health: 1.5, damage: 1.4, pen: 1.4, speed: 0.3, range: 1.2, resist: 1.4 },
    missileTrail: { reload: 0.6, recoil: 0.25, shudder: 2, damage: 0.9, pen: 0.7, speed: 0.4, range: 0.5 },
    rocketeerMissileTrail: { reload: 0.5, recoil: 7, shudder: 1.5, size: 0.8, health: 0.8, damage: 0.7, speed: 0.9, maxSpeed: 0.8, spray: 5 },

// Traps and blocks
    setTrap: { reload: 1.1, recoil: 2, shudder: 0.1, size: 1.5, health: 2, pen: 1.25, speed: 2.2, maxSpeed: 2.15, range: 1.25, resist: 1.25 },
    construct: { reload: 1.3, size: 0.9, maxSpeed: 1.1 },
    boomerang: { reload: 0.8, health: 0.5, damage: 0.5, speed: 0.75, maxSpeed: 0.75, range: 4/3 },
    nestKeeper: { reload: 3, size: 0.75, health: 1.05, damage: 1.05, pen: 1.1, speed: 0.5, maxSpeed: 0.5, range: 0.5, density: 1.1 },
    hexaTrapper: { reload: 1.3, shudder: 1.25, speed: 0.8, range: 0.5 },
    trapperDominator: { reload: 1.46, recoil: 0, shudder: 0.25, health: 1.25, damage: 1.45, pen: 1.6, speed: 0.5, maxSpeed: 2, range: 1.1, spray: 0.5 },
    megaTrapper: { reload: 2, damage: 2, recoil: 2, size: 1.2 },
    barricade: { reload: 0.75, damage: 0.79, range: 0.5 },

// Speed
    fast: { speed: 1.2 },
    veryfast: { speed: 2.5 },
    morespeed: { speed: 1.3, maxSpeed: 1.3 },

// Misc
    blank: { reload: 1, recoil: 1, shudder: 1, size: 1, health: 1, damage: 1, pen: 1, speed: 1, maxSpeed: 1, range: 1, density: 1, spray: 1, resist: 1 },
    weak: { reload: 2, health: 0.6, damage: 0.6, pen: 0.8, speed: 0.5, maxSpeed: 0.7, range: 0.25, density: 0.3 },
    power: { shudder: 0.6, size: 1.2, pen: 1.25, speed: 2, maxSpeed: 1.7, density: 2, spray: 0.5, resist: 1.5 },
    fake: { size: 0.00001, health: 0.0001, speed: 0, maxSpeed: 0, shudder: 0, spray: 0, recoil: 0, range: 0 },
    op: { reload: 0.5, recoil: 1.3, health: 4, damage: 4, pen: 4, speed: 3, maxSpeed: 2, density: 5, spray: 2 },
    arenaCloser: { reload: 0.80, recoil: 0.25, health: 1000, damage: 1000, pen: 1000, speed: 2.5, maxSpeed: 1.15, range: 1.8, density: 4, spray: 0.25 },
    healer: { damage: -1, speed: 0.5, maxSpeed: 0.5, recoil: 0.5 },
    lowPower: { shudder: 2, health: 0.5, damage: 0.5, pen: 0.7, spray: 0.5, resist: 0.7 },
    halfrange: { range: 0.5 },
    aura: { reload: 0.001, recoil: 0.001, shudder: 0.001, size: 6, speed: 0.001, maxSpeed: 0.001, spray: 0.001 },
    noSpread: { shudder: 0, spray: 0 },

// Shiny menu
    worstTank: { reload: 15, damage: 0.01, health: 0.01, pen: 0.01 },
    bigBalls: { reload: 4, damage: 4, health: 2, speed: 0.85, maxSpeed: 0.85, size: 2.5 },
    bacteria: { reload: 2, recoil: 0.25, shudder: 0.1, size: 0.62, speed: 2},
}

projectiles: {
    Class.disruptorDeco = makeDeco(0)
    Class.disruptorBullet = {
        PARENT: "bullet",
        INDEPENDENT: true,
        GUNS: [
            ...(() => {
                const resultGuns = []
                const splitAmount = 6
                for (let i = 0; i < splitAmount; i++) {
                    resultGuns.push(
                        {
                            POSITION: [0, 8, 1, 0, 0, 360/splitAmount*i, 0],
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minigun, oldgunvals.gunner, {shudder: 2.5, spray: 4.5 }]),
                                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                                SHOOT_ON_DEATH: true,
                            }
                        }
                    )
                }
                return resultGuns
            })()
        ],
        TURRETS: [{
            POSITION: [8, 0, 0, 45, 0, 1],
            TYPE: ["disruptorDeco", { MIRROR_MASTER_ANGLE: true }]
        }]
    }

    Class.stickerDeco = makeDeco(-3, { BASE: -1, BRIGHTNESS_SHIFT: -15, SATURATION_SHIFT: 0.6 })
    Class.sticker = {
        PARENT: "setTrap",
        LABEL: "Sticker",
        SHAPE: 0,
        INDEPENDENT: true,
        DIE_AT_RANGE: true,
        HITS_OWN_TYPE: "never",
        BODY: {
            SPEED: base.SPEED * 2,
            HEALTH: base.HEALTH * 5,
            DAMAGE: base.DAMAGE * 0,
            DENSITY: base.DENSITY * 0.2,
            PUSHABILITY: 0,
            RANGE: 25,
        },
        GUNS: [],
        TURRETS: [{
            POSITION: [18, 0, 0, 45, 0, 0],
            TYPE: ["stickerDeco", { MIRROR_MASTER_ANGLE: true }]
        }],
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    body.stickied ??= false
                    body.stickiedTo = null
                },
            },
            {
                event: "collide",
                handler: ({ instance, other }) => {
                    if (!instance.stickied) {
                        if (other && other !== instance.master && other !== instance && other.stickied == undefined && other.type != "line") {
                            if (other instanceof bulletEntity) {
                                return
                            }
                            let sizeRatio = (instance.size / other.size)
                            let rotationOffset = (instance.facing - other.facing)
                            // Convert to other entity space
                            let otherSpaceX =
                                ((instance.x - other.x) * Math.cos(other.facing) +
                                    (instance.y - other.y) * Math.sin(other.facing)) / other.size;
                            let otherSpaceY =
                                (-(instance.x - other.x) * Math.sin(other.facing) +
                                    (instance.y - other.y) * Math.cos(other.facing)) / other.size;
                            // Convert other space to turret space
                            otherSpaceX *= 10
                            otherSpaceY *= 10

                            instance.range += 125
                            instance.stickied = true
                            instance.stickiedTo = other
                            instance.layer = other.layer + 1,
                            instance.settings.mirrorMasterAngle = true
                            instance.bond = other;
                            instance.source = other;
                            let _off = new Vector(otherSpaceX, otherSpaceY)
                            instance.bound = { size: sizeRatio, angle: 0, direction: _off.direction, offset: _off.length / 10, arc: 0, layer: 1 };
                            //instance.facingType = "spin";
                            //instance.facingTypeArgs = { speed: 0.5 };
                            instance.facingType = "bound";
                            instance.facingTypeArgs = {};
                            instance.motionType = "bound";
                            instance.motionTypeArgs = {};
                            instance.move();
                            instance.settings.drawShape = true;
                        }
                    }
                },
            },
        ]
    }
    
    Class.stickyGrenade = {
        PARENT: "sticker",
        LABEL: "Sticky Grenade",
        SHAPE: -8,
        INDEPENDENT: true,
        BODY: {
            SPEED: base.SPEED * 2,
            HEALTH: base.HEALTH * 5,
            DAMAGE: base.DAMAGE * 0,
            DENSITY: base.DENSITY * 0.2,
        },
        GUNS: [ 
            {
                POSITION: [5, 8, 0.001, 9, 0, 0, 0],
            },
            {
                POSITION: [5, 8, 0.001, 9, 0, -90, 0],
            },
            {
                POSITION: [5, 8, 0.001, 9, 0, -180, 0],
            },
            {
                POSITION: [5, 8, 0.001, 9, 0, 90, 0],
            },
            ...(() => {
                const resultGuns = []
                const splitAmount = 32
                for (let i = 0; i < splitAmount; i++) {
                    resultGuns.push(
                        {
                            POSITION: [0, 8, 1, 0, 0, 360/splitAmount*i, 0],
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([oldgunvals.basic, {shudder: 2.5, spray: 4.5 }]),
                                TYPE: ["bullet", { PERSISTS_AFTER_DEATH: true }],
                                SHOOT_ON_DEATH: true,
                            }
                        }
                    )
                }
                return resultGuns
            })()
        ],
    }

    Class.autoSticker = {
        PARENT: "sticker",
        LABEL: "Auto-Sticker",
        INDEPENDENT: true,
        TURRETS: [
            {
                POSITION: [18, 0, 0, 45, 0, 0],
                TYPE: ["stickerDeco", { MIRROR_MASTER_ANGLE: true }]
            },
            {
                POSITION: [11, 0, 0, 0, 360, 1],
                TYPE: "autoTurret",
            },
        ],
    }

    Class.zapwireBullet = {
        PARENT: "trap",
        BODY: {
            SPEED: base.SPEED * 2,
            DAMAGE: base.DAMAGE * 0,
            DENSITY: base.DENSITY * 2,
        },
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    body.zapwireLine = createLine(body, body.master)
                },  
            },
        ]
    }
}

tanks: {
    Class.jetrusher = {
        PARENT: "genericTank",
        LABEL: "Jetrusher",
        DANGER: 7,
        BODY: {
            FOV: 1.3,
        },
        GUNS: [
            ...(() => {
                const resultGuns = []
                const gunAmount = 10
                for (let i = 0; i < gunAmount; i++) {
                    resultGuns.push(
                        {
                            POSITION: [25 - (i * 1.1), 6, 1, 0, 0, 0, i / gunAmount],
                            PROPERTIES: {
                                SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minigun, oldgunvals.streamliner, oldgunvals.streamliner, oldgunvals.sniper]),
                                TYPE: "bullet",
                            },
                        },
                    )
                }
                return resultGuns
            })()
        ],
    }

    Class.batterifier = {
        PARENT: "genericTank",
        LABEL: "Batterifier",
        DANGER: 6,
        BODY: {
            FOV: base.FOV * 1.2
        },
        GUNS: [
            {
                POSITION: [21, 12, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minigun, oldgunvals.pounder]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 1 / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minigun, oldgunvals.pounder]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [17, 12, 1, 0, 0, 0, 2 / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minigun, oldgunvals.pounder]),
                    TYPE: "bullet"
                }
            }
        ]
    }

    Class.clunker = {
        PARENT: "genericTank",
        LABEL: "Clunker",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 12,
                    WIDTH: 14,
                    ASPECT: 1.4,
                    X: 8
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.pounder, { size: 0.92 }]),
                    TYPE: "bullet"
                }
            }
        ]
    }

    Class.kludger = {
        PARENT: "genericTank",
        LABEL: "Kludger",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 12,
                    WIDTH: 16,
                    ASPECT: 1.4,
                    X: 8
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.pounder, oldgunvals.destroyer, { size: 0.92 }]),
                    TYPE: "bullet"
                }
            }
        ]
    }

    Class.disruptor = {
        PARENT: "genericTank",
        LABEL: "Disruptor",
        GUNS: [
            {
                POSITION: {
                    LENGTH: 12,
                    WIDTH: 14,
                    ASPECT: 1.4,
                    X: 8
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.pounder, oldgunvals.lowPower, { size: 0.92 }]),
                    NO_LIMITATIONS: true, // i hate this
                    TYPE: "disruptorBullet"
                }
            }
        ],
        TURRETS: [{
            POSITION: [8, 0, 0, 45, 0, 1],
            TYPE: ["disruptorDeco", { MIRROR_MASTER_ANGLE: true }]
        }]
    }

    Class.sgn = {
        PARENT: "genericTank",
        LABEL: "Sticky Grenade Launcher",
        DANGER: 7,
        GUNS: [
            {
                POSITION: [12, 10, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder]),
                    NO_LIMITATIONS: true,
                    TYPE: "autoSticker",
                },
            },
        ],
    }

    Class.boobyTrapper = {
        PARENT: "genericTank",
        LABEL: 'Booby-trapper',
        BODY: {
            SPEED: base.SPEED * 1.1,
        },
        DANGER: 6,
        FACING_TYPE: ["spin", {speed: -0.02}],
        TURRETS: [
            {
                POSITION: [12, 8, 0, 0, 190, 0],
                TYPE: "trapper",
            },
            {
                POSITION: [12, 8, 0, 120, 190, 0],
                TYPE: "trapper",
            },
            {
                POSITION: [12, 8, 0, 240, 190, 0],
                TYPE: "trapper",
            },
            {
                POSITION: [12, 8, 0, 0 + 60, 190, 0],
                TYPE: "trapper",
            },
            {
                POSITION: [12, 8, 0, 120 + 60, 190, 0],
                TYPE: "trapper",
            },
            {
                POSITION: [12, 8, 0, 240 + 60, 190, 0],
                TYPE: "trapper",
            },
        ],
    };

    Class.radar = {
        PARENT: "genericTank",
        LABEL: 'Radar',
        GUNS: [ {
                POSITION: [ 18, 8, 1, 0, 0, -55, 0, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.setTrap, oldgunvals.flankGuard]),
                    TYPE: "setTrap",
                }, }, {
                POSITION: [ 18, 8, 1, 0, 0, 55, 0.2, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.setTrap, oldgunvals.flankGuard]),
                    TYPE: "setTrap",
                }, }, {
                POSITION: [ 2, 8, 1.5, 17, 0, -55, 0, ],
                }, {
                POSITION: [ 2, 8, 1.5, 17, 0, 55, 0, ],
                }, {
                POSITION: [ 13, 7, 1, 7, 0, 0, 0.9, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.flankGuard]),
                    TYPE: "bullet",
                }, }, 
            ],
    };

    Class.pigeon = makeBird("twin", "Pigeon")

    Class.irradiatorAura = makeAura(2, 1.2)
    Class.irradiator = dereference("smasher")
    Class.irradiator.LABEL = "Irradiator"
    Class.irradiator.SKILL_CAP = [smshskl, smshskl, smshskl, smshskl, 0, smshskl, smshskl, smshskl, smshskl, smshskl]
    Class.irradiator.TURRETS ??= []
    Class.irradiator.TURRETS.push(
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "irradiatorAura",
        }
    )

    Class.nuisanceAura = makeAura(2, 1.2)
    Class.nuisance = dereference("triAngle")
    Class.nuisance.LABEL = "Nuisance"
    Class.nuisance.TURRETS ??= []
    Class.nuisance.TURRETS.push(
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "nuisanceAura",
        }
    )

    Class.zapwire = {
        PARENT: "genericTank",
        LABEL: "Zapwire",
        DANGER: 4,
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
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic]),
                    NO_LIMITATIONS: true,
                    TYPE: "zapwireBullet",
                }
            }
        ]
    }

    Class.toverseer = {
        PARENT: "overseer",
        LABEL: "Dog Walker",
        MAX_CHILDREN: 1,
        ON: [
            {
                event: "fire",
                handler: ({ body, child }) => {
                    child.zapwireLine = createSpringConstraint(child, body, 150, 0.25, 0.01, false)
                },
            }
        ]
    }

    Class.grappler = {
        PARENT: "genericTank",
        LABEL: "Grappler",
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
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder]),
                    NO_LIMITATIONS: true,
                    TYPE: "sticker",
                }
            }
        ],
        ON: [
            {
                event: "fire",
                handler: ({ body, child }) => {
                    child.zapwireLine = createSpringConstraint(child, body, 150, 0.25, 0.01, false)
                },
            },
        ]
    }

    Class.softBoxSpawner = {
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    function createPoint(xOffset, yOffset, type = {...Class.genericTank, BODY: {DENSITY: 0.5 * base.DENSITY}}) {
                        const o = new Entity({ x: body.x + xOffset, y: body.y + yOffset }, body.master)
                        o.define(type)
                        o.refreshBodyAttributes();
                        o.SIZE = 4
                        o.life();
                        return o
                    }
                    const tl = createPoint(-10, 10)
                    const tr = createPoint(10, 10)
                    const bl = createPoint(-10, -10)
                    const br = createPoint(10, -10)
                    const rope1 = createPoint(10, -10)
                    const rope2 = createPoint(10, -10)
                    const rope3 = createPoint(10, -10)
                    createSpringConstraint(tl, tr, 100, 0.05, 0.05/6)
                    createSpringConstraint(tr, br, 100, 0.05, 0.05/6)
                    createSpringConstraint(br, bl, 100, 0.05, 0.05/6)
                    createSpringConstraint(bl, tl, 100, 0.05, 0.05/6)
                    createSpringConstraint(tl, br, 100 * Math.SQRT2, 0.05, 0.05/6)
                    createSpringConstraint(tr, bl, 100 * Math.SQRT2, 0.05, 0.05 / 6)
                    createSpringConstraint(br, rope1, 50, 0.05, 0.05/6)
                    createSpringConstraint(rope1, rope2, 50, 0.05, 0.05 / 6)
                    createSpringConstraint(rope2, rope3, 50, 0.05, 0.05/6)
                    createSpringConstraint(rope3, body.master, 50, 0.05, 0.05/6)
                    body.destroy()
                },  
            },
        ]
    }

    Class.softBoxSpawnerGenerator = {
        PARENT: "genBody",
		LABEL: "Soft Box Generator",
		//MAX_CHILDREN: 10,
		UPGRADES_TIER_0: [],

		TURRETS: [{
			POSITION: [8, 0, 0, 0, 0, 1],
			TYPE: ["genericTank", { INDEPENDENT: true }]
		}],

		GUNS: [
			{
				POSITION: [2, 10.5, 1, 15, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([{
						shudder: 0.1,
						speed: 0,
						recoil: 0.1,
						reload: 6,
						size: 20 / 13
					}]),
					NO_LIMITATIONS: true,
					SPAWN_OFFSET: 0,
					TYPE: ["softBoxSpawner", { INDEPENDENT: true }]
				}
			},
			{
				POSITION: [11, 10.5, 1.4, 4, 0, 0, 0]
			}
		]
    }

    Class.random = {
        PARENT: "genericTank",
        LABEL: "Random",
        DANGER: 4,
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    if (!body.seed) {
                        body.seed ??= Math.random()
                        let seed = body.seed

                        let seedFuncs = {}

                        seedFuncs.random = function () {
                            seed = (seed * 9301 + 49297) % 233280
						    return seed / 233280
                        }
                        seedFuncs.random_range = function(min, max) {
                            return seedFuncs.random() * (max - min) + min;
                        }

                        let points = 100
                        let cart = []
                        let set = {}

                        function gun(preset, position, stats, settings) {
                            switch (preset) {
                                case "trap":

                                default:
                                    return {
                                        POSITION: position,
                                        PROPERTIES: {
                                            SHOOT_SETTINGS: combineStats([oldgunvals.basic, stats]),
                                            TYPE: "bullet",
                                        }
                                    }
                            }
                        }

                        let shop = [
                            {
                                cost: 1,
                                item: (extraSpendings) => {
                                    set.BODY ??= {}
                                    set.BODY.FOV ??= base.FOV
                                    set.BODY.FOV += 0.2
                                },
                                chanceMultiplier: 0.2
                            },
                            {
                                cost: 25,
                                item: (extraSpendings) => {
                                    // guns are gonna need a lot of paramters/subpurchasables
                                    // for instance, symetry, and if its not symetric, a only place the gun on front or back
                                    // and also x + y offsets
                                    // as well as the gun types, and their paramters (drone max count)
                                    // ensure guns dont overlap (at least in a non visible way)
                                    // and of course the various stats that can be added.
                                    set.GUNS ??= []
                                    set.GUNS.push(
                                        gun("",{
                                            LENGTH: seedFuncs.random_range(12, 23),
                                            WIDTH: seedFuncs.random_range(4, 15),
                                            ASPECT: seedFuncs.random_range(-2, 2),
                                            X: 0,
                                            Y: 0,
                                            ANGLE: 0,
                                            DELAY: 0
                                        },{})
                                    )
                                },
                                chanceMultiplier: 1
                            }
                        ]
                        function canBuy(index) {
                            return points >= shop[index].cost
                        }
                        function buy(index, extraSpendings) {
                            const shopItem = shop[index]
                            if (canBuy(index)) {
                                points -= shopItem
                                cart.push({index, extraSpendings})
                                shopItem.item(extraSpendings)
                            }
                        }
                        function splurge() {
                            let safety = 5000
                            while (points > 0 && safety-- > 0) {
                                let weighted = []
                                let total = 0
                                for (let i = 0; i < shop.length; i++) {
                                    let weight = shop[i].chanceMultiplier ?? 1
                                    if (canBuy(i)) {
                                        weighted.push({ i, weight })
                                        total += weight
                                    }
                                }
                                if (weighted.length === 0) break
                                let choice = seedFuncs.random() * total
                                for (let item of weighted) {
                                    choice -= item.weight
                                    if (choice <= 0) {
                                        buy(item.i)
                                        break
                                    }
                                }
                            }
                        }
                        splurge()
                        set.LABEL = `Random (Seed ${body.seed})`
                        body.define(set)
                    } 
                },  
            },
        ]
    }
}

bosses: {
    Class.idkWhatToCallThis = {
        PARENT: "miniboss",
        LABEL: "Boss",
        TURRETS: weaponArray({
            POSITION: {SIZE: 7, X: 10, Y: 0, ANGLE: 180, ARC: 2, LAYER: 0},
            TYPE: ["boomer", {GUN_STAT_SCALE: {reload: 0.8, health: 0.8}}],
        }, 6), 
    };
}

fun: {
    optanks: {
        Class.cannon = {
            PARENT: "genericTank",
            LABEL: "Cannon",
            DANGER: 6,
            BODY: {
                SPEED: 1.2 * base.SPEED,
                FOV: 1.5 * base.FOV,
            },
            GUNS: [
                {
                    POSITION: [28, 14, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder, oldgunvals.destroyer, {speed: 4, maxSpeed: 4, reload: 0.5, recoil: 2}]),
                        TYPE: "bullet",
                    },
                },
                {
                    POSITION: [15, 14, -1.2, 0, 0, 0, 0],
                },
            ],
        }
            
        Class.cracklord = {
            PARENT: "genericTank",
            LABEL: "Escobar",
            DANGER: 7,
            STAT_NAMES: statnames.drone,
            BODY: {
                SPEED: 1.2 * base.SPEED,
                FOV: 1.1 * base.FOV,
            },
            MAX_CHILDREN: 8,
            GUNS: [
                ...weaponArray({
                POSITION: [6, 12, 1.2, 8, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, { speed: 3, maxSpeed: 3 }]),
                    TYPE: "drone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true
                }
                }, 4),
                ...weaponArray({
                    POSITION: [8, 5, 0.001, 8, 0, 0, 0],
                }, 4)
            ]
            }
        
        Class.australia = {
            PARENT: "genericTank",
            LABEL: "Australia",
            DANGER: 7,
            STAT_NAMES: statnames.drone,
            BODY: {
                SPEED: base.SPEED * 0.8,
                FOV: 1.1,
            },
            GUNS: [
                {
                    POSITION: [5, 11, 1, 10.5, 0, 0, 0],
                },
                {
                    POSITION: [2, 14, 1, 15.5, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.factory]),
                        TYPE: ["minion", { GUNS: Class.boomer.GUNS }],
                        MAX_CHILDREN: 6,
                        STAT_CALCULATOR: "drone",
                        AUTOFIRE: true,
                        SYNCS_SKILLS: true,
                    },
                },
                {
                    POSITION: [12, 14, -1.4, 0, 0, 0, 0],
                },
            ],
        }

        Class.turretBoxTurret = makeTurret({
            HAS_NO_RECOIL: true,
            GUNS: [
                {
                    POSITION: [16, 5, 1, 0, -5, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minionGun, oldgunvals.turret, oldgunvals.power, oldgunvals.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                        TYPE: "bullet",
                        WAIT_TO_CYCLE: true
                    },
                },
                {
                    POSITION: [16, 5, 1, 0, 5, 0, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.minionGun, oldgunvals.turret, oldgunvals.power, oldgunvals.autoTurret, { density: 0.1, speed: 0.5, range: 1.5 }]),
                        TYPE: "bullet",
                        WAIT_TO_CYCLE: true
                    },
                },
            ],
        }, {extraStats: [], hasAI: false, canRepel: true})
        Class.turretBox = {
            PARENT: "setTrap",
            LABEL: "Sentry Turret",
            DIE_AT_RANGE: true,
            TURRETS: [
                {
                    POSITION: [16, 0, 0, 0, 360, 1],
                    TYPE: "turretBoxTurret",
                },
            ],
        }
        Class.mechanic = {
            PARENT: "genericTank",
            DANGER: 7,
            LABEL: "Mechanic",
            STAT_NAMES: statnames.trap,
            BODY: {
                SPEED: 0.75 * base.SPEED,
                FOV: 1.15 * base.FOV,
            },
            GUNS: [
                {
                    POSITION: [5, 11, 1, 10.5, 0, 0, 0],
                },
                {
                    POSITION: [3, 14, -1.2, 15.5, 0, 0, 0],
                },
                {
                    POSITION: [2, 14, 1.3, 18, 0, 0, 0],
                    PROPERTIES: {
                        MAX_CHILDREN: 6,
                        SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.setTrap]),
                        TYPE: "turretBox",
                        NO_LIMITATIONS: true,
                        SYNCS_SKILLS: true,
                        DESTROY_OLDEST_CHILD: true,
                        STAT_CALCULATOR: "block"
                    },
                },
                {
                    POSITION: [4, 14, -1.2, 8, 0, 0, 0],
                },
            ],
        }

        Class.shotswarm = {
            PARENT: "genericTank",
            LABEL: "Shotswarm",
            DANGER: 7,
            GUNS: [
                ...weaponMirror([{
                    POSITION: [4, 3, 1, 11, 3, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                },
                {
                    POSITION: [1, 4, 1, 12, -1, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                },
                {
                    POSITION: [1, 3, 1, 13, 1, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                },
                {
                    POSITION: [1, 2, 1, 13, 2, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                }], 0),
                {
                    POSITION: [4, 4, 1, 13, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                },
                {
                    POSITION: [15, 14, 0.7, 6, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.machineGun, oldgunvals.shotgun, oldgunvals.fake, {damage: 2, maxSpeed: 3}]),
                        TYPE: "swarm"
                    }
                },
                {
                    POSITION: [8, 14, -1.3, 4, 0, 0, 0]
                }
            ]
        }

        Class.agonizerTurret = makeTurret("overgunner")
        Class.agonizer = {
            PARENT: "genericTank",
            DANGER: 7,
            LABEL: "Agonizer",
            BODY: {
                SPEED: 1.2 * base.SPEED,
                FOV: 1.1 * base.FOV,
            },
            GUNS: [
                {
                    POSITION: [42, 6.5, 1, 0, 0, 0, 0],
                },
                {
                    POSITION: [6, 8.5, -1.5, 8, 0, 0, 0]
                }
            ],
            TURRETS: [{
                POSITION: [6, 42, 0, 0, 360, 1],
                TYPE: [
                    "agonizerTurret",
                    { INDEPENDENT: true }
                ],
            },
                {
                    POSITION: [6, 32, 0, 0, 360, 1],
                    TYPE: [
                        "agonizerTurret",
                        { INDEPENDENT: true }
                    ],
                },
                {
                    POSITION: [6, 22, 0, 0, 360, 1],
                    TYPE: [
                        "agonizerTurret",
                        { INDEPENDENT: true }
                    ],
                },
            ],
        }
        Class.agonizer = makeBird(Class.agonizer, "Pelicanbar") 

        Class.crow5 = makeRadialAuto("crowbarTurret", { isTurret: true, danger: 14, label: "Crow-5", count: 5 })
        Class.auto9 = makeRadialAuto("autoTankGun", { isTurret: true, danger: 14, label: "Auto-9", count: 9, size: 11 / 2, x: 9 })
        Class.auto9.SIZE = 24

        Class.fumigatorTrapAura = makeAura(3, 6)
        Class.fumigatorTrap = {
            PARENT: "trap",
            TURRETS: [{
                POSITION: [9, 0, 0, 0, 360, 1],
                TYPE: "fumigatorTrapAura",
            }]
        }
        
        Class.fumigator = {
            PARENT: "genericTank",
            DANGER: 7,
            LABEL: "Fumigator",
            STAT_NAMES: statnames.trap,
            BODY: {
                FOV: 1.15,
            },
            GUNS: [
                {
                    POSITION: [24, 8, 1, 0, 0, 0, 0],
                },
                {
                    POSITION: [4, 8, 1.3, 22, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.minigun, oldgunvals.barricade]),
                        TYPE: "fumigatorTrap",
                        STAT_CALCULATOR: "trap"
                    },
                },
                {
                    POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.minigun, oldgunvals.barricade]),
                        TYPE: "fumigatorTrap",
                        STAT_CALCULATOR: "trap",
                    },
                },
                {
                    POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.minigun, oldgunvals.barricade]),
                        TYPE: "fumigatorTrap",
                        STAT_CALCULATOR: "trap",
                    },
                },
            ],
            TURRETS: [{
                POSITION: [8, 26, 0, 0, 0, 0],
                TYPE: ["genericTank", {COLOR: 0}],
            }]
        }

        Class.cyclonedrive = makeDrive("cyclone")
        Class.pentadrive = makeDrive("pentaShot")

        Class.ohGodAura = makeAura(2, 1.2)
        Class.ohGodTurret = makeTurret("cyclonedrive")
        Class.ohGod = {
            PARENT: "genericTank",
            DANGER: 7,
            LABEL: "Oh God",
            SHAPE: makePolygon({ sides: 100, hollow: true, hollowMultiplier: 0.9}),
            BODY: {
                SPEED: 1.2 * base.SPEED,
                FOV: 1.1 * base.FOV,
            },
            GUNS: [
                ...weaponArray([
                    {
                        POSITION: [15, 7, 1, 0, 0, 0, 0],
                    },
                    {
                        POSITION: [3, 7, 1.7, 15, 0, 0, 0],
                        PROPERTIES: {
                            SHOOT_SETTINGS: combineStats([oldgunvals.trap, oldgunvals.hexaTrapper]),
                            TYPE: "trap",
                            STAT_CALCULATOR: "trap",
                        },
                    },
                ], 7, 4/7),
                {
                    POSITION: [12, 11, 1, 0, 0, 0, 0]
                },
                {
                    POSITION: [42, 6.5, 1, 0, 0, 0, 0],
                },
                {
                    POSITION: [6, 8.5, -1.5, 8, 0, 0, 0]
                },
                {
                    POSITION: [21, 14, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder, oldgunvals.destroyer]),
                        TYPE: "bullet",
                    },
                },
                ...weaponMirror({
                    POSITION: [19, 2, 1, 0, -2.5, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pelleter, oldgunvals.power, oldgunvals.twin, { speed: 0.7, maxSpeed: 0.7 }, oldgunvals.flankGuard, { recoil: 1.8 }]),
                        TYPE: "bullet"
                    }
                }),
            ],
            TURRETS: [{
                POSITION: [6, 42, 0, 0, 360, 1],
                TYPE: [
                    "ohGodTurret",
                    { INDEPENDENT: true }
                ],
            },
                {
                    POSITION: [6, 32, 0, 0, 360, 1],
                    TYPE: [
                        "ohGodTurret",
                        { INDEPENDENT: true }
                    ],
                },
                {
                    POSITION: [6, 22, 0, 0, 360, 1],
                    TYPE: [
                        "ohGodTurret",
                        { INDEPENDENT: true }
                    ],
                },
                {
                    POSITION: [9, 0, 0, 0, 360, 1],
                    TYPE: "ohGodAura",
                }
            ],
        }
        Class.ohGod = makeOver("ohGod", "Oh God")
        Class.ohGod = makeGuard("ohGod", "Oh God")
        Class.ohGod = makeBird("ohGod", "Oh God")
        Class.ohGod = makeAuto("ohGod", "Oh God")
        Class.ohGod = makeDrive("ohGod", "Oh God")

        Class.rocknaut = {
            PARENT: "genericDreadnoughtOfficialV2",
            TYPE: "wall",
            DAMAGE_CLASS: 1,
            LABEL: "Rocknaut",
            SHAPE: -9.5,
            DANGER: 99,
            BODY: {
                SPEED: base.SPEED * 0.55,
                FOV: base.FOV * 0.95,
                RESIST: base.RESIST,
                DENSITY: base.DENSITY * 3.5,
                ACCELERATION: base.ACCEL * 0.4,
                PUSHABILITY: 0,
                HEALTH: 10000,
                SHIELD: 10000,
                REGEN: 1000,
                DAMAGE: 1,
                RESIST: 100,
            },
            VALUE: 0,
            SIZE: 60,
            COLOR: "lightGray",
            GUNS: [
                ...weaponArray([{
                    POSITION: [12, 2, 1, 0, 0, 12, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper]),
                        TYPE: "bullet",
                    },
                },
                {
                    POSITION: [12, 2, 1, 0, 0, -12, 0.5],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper]),
                        TYPE: "bullet",
                    },
                },
                {
                    POSITION: [13, 5, 1, 0, 0, 0, 0],
                    PROPERTIES: {
                        SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder, oldgunvals.destroyer, oldgunvals.annihilator]),
                        TYPE: "bullet",
                    },
                }],9)
            ],
            PROPS: [
                {
                    POSITION: [12, 0, 0, 180, 1],
                    TYPE: "rock",
                }
            ],
            TURRETS: [
                ...weaponArray({
                    POSITION: [2.25, 4.5, 0, 0, 180, 2],
                    TYPE: ["spamAutoTurret", {GUN_STAT_SCALE: {reload: 1.1, health: 0.93, damage: 0.8}}],
                }, 9),
                ...weaponArray({
                    POSITION: [2.25, 8, 0, 36, 180, 2],
                    TYPE: ["spamAutoTurret", {GUN_STAT_SCALE: {reload: 1.1, health: 0.93, damage: 0.8}}],
                }, 9)
            ]
        }
    } 

    Class.traitor = {
        PARENT: "genericTank",
        LABEL: "Traitor",
        DANGER: 30,
        GUNS: [
            {
                POSITION: {
                    LENGTH: 24,
                    WIDTH: 8.5
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper]),
                    TYPE: "bullet"
                }
            }
        ],
        ON: [
            {
                event: "fire",
                handler: ({ body, gun, globalMasterStore, child, masterStore, gunStore }) => {
                    child.team = -body.team
                },
            }
        ]
    }

    Class.selfKillerBarrel = {
        SHAPE: "M 0 -0.5 L 0 0.5 L 2 0.5 A 1 1 0 0 0 3 -0.5 L 3 -3 A 1 1 0 0 0 2 -4 L 0.5 -4 A 1 1 0 0 0 -0.5 -3 L -0.5 -2.5 L 0.5 -2.5 L 0.5 -3 L 2 -3 L 2 -0.5 Z",
        COLOR: 16,
        MIRROR_MASTER_ANGLE: true
    }
    Class.selfKiller = {
        PARENT: "genericTank",
        LABEL: "Self Killer",
        DANGER: 30,
        GUNS: [
            {
                POSITION: {
                    LENGTH: 5,
                    WIDTH: 10,
                    ANGLE: 90,
                    X: -25
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: {
                    LENGTH: 7,
                    WIDTH: 10,
                    ANGLE: 90,
                    X: -25 + -5
                },
                PROPERTIES: {
                    BORDERLESS: true
                }
            }
        ],
        ON: [
            {
                event: "fire",
                handler: ({ body, gun, globalMasterStore, child, masterStore, gunStore }) => {
                    child.team = -body.team
                },
            }
        ],
        TURRETS: [{
            POSITION: [20, 0, 0, 0, 0, 0],
            TYPE: ["selfKillerBarrel", { COLOR: 16 }],
        }]
    }
        
    const BENDER_MAX_BEND_ANGLE = 270
    Class.barrelCover = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        BORDERLESS: true,
        COLOR: 16,
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
                PROPERTIES: {
                    BORDERLESS: true,
                }
            }
        ],
    }
    Class.barrelCoverFire = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        BORDERLESS: true,
        COLOR: 16,
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
                PROPERTIES: {
                    BORDERLESS: true,
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.fake]),
                    TYPE: "bullet"
                }
            }
        ],
    }
    Class.benderSegment1 = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, { recoil: 0 }]),
                    TYPE: "bullet"
                }
            }
        ],
    }
    Class.benderSegment2 = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
            }
        ],
        TURRETS: [{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(5/5), 0],
            TYPE: "benderSegment1",
        },{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(5/5), 1],
            TYPE: "barrelCoverFire",
        }],
    }
    Class.benderSegment3 = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
            }
        ],
        TURRETS: [{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(4/5), 0],
            TYPE: "benderSegment2",
        },{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(4/5), 1],
            TYPE: "barrelCover",
        }],
    }
    Class.benderSegment4 = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
            }
        ],
        TURRETS: [{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(3/5), 0],
            TYPE: "benderSegment3",
        },{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(3/5), 1],
            TYPE: "barrelCover",
        }],
    }
    Class.benderSegment5 = {
        PARENT: 'genericTank',
        BODY: { FOV: 2 },
        //SHAPE: [[-2,-1],[1,-1],[1,1],[-2,1]],
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 20,
                },
            }
        ],
        TURRETS: [{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(2/5), 0],
            TYPE: "benderSegment4",
        },{
            POSITION: [20, 20, 0, 0, BENDER_MAX_BEND_ANGLE*(2/5), 1],
            TYPE: "barrelCover",
        }],
    }
    Class.bender = {
        PARENT: "genericTank",
        LABEL: "Bender",
        FACING_TYPE: "locksFacing",
        TURRETS: [{
            POSITION: [10, 10, 0, 0, BENDER_MAX_BEND_ANGLE*(1/5), 0],
            TYPE: "benderSegment5",
        },{
            POSITION: [10, 10, 0, 0, BENDER_MAX_BEND_ANGLE*(1/5), 0],
            TYPE: "barrelCover",
        }]
    }

    Class.imposter = {
        PARENT: "genericTank",
        LABEL: "Imposter",
        SHAPE: 0,
        SIZE: 12,
        COLOR: null,
        ON: [
            {
                event: "kill",
                handler: ({ body, entity }) => {
                    const definitionLabel = entity.defs[0]
                    const definition = Class[definitionLabel]
                    if (definition && definition.PARENT && definition.PARENT === "genericTank") {
                        body.define({
                            ...Class.genericTank,
                            ...Class.imposter,
                            GUNS: [],
                            ...definition,
                            CONTROLLERS: Class.genericTank.CONTROLLERS,
                            MOTION_TYPE: Class.genericTank.MOTION_TYPE,
                            FACING_TYPE: Class.genericTank.FACING_TYPE,
                            LABEL: definition.LABEL ? `Imposter (${definition.LABEL})` : `Imposter`,
                            
                        })
                    }
                },  
            },
            {
                event: "death",
                handler: (body, killers, killTools) => {
                    body.define(Class.imposter)
                }
            }
        ],
        GUNS: [
            {
                POSITION: {
                    LENGTH: 20,
                    WIDTH: 10,
                },
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic]),
                    TYPE: "bullet"
                }
            }
        ],
    }
}

Class.menu_dogeisCutTanks = makeMenu("DogeisCut Tanks")
Class.menu_dogeisCutTanks.UPGRADES_TIER_0 = ["menu_dogeisCutTanks_tests", "menu_dogeisCutTanks_fun", "menu_dogeisCutTanks_bosses"]
Class.menu_addons.UPGRADES_TIER_0.push("menu_dogeisCutTanks");

    Class.menu_dogeisCutTanks_tests = makeMenu("Tests")
    Class.menu_dogeisCutTanks_tests.UPGRADES_TIER_0 = ["sgn", "zapwire", "toverseer", "softBoxSpawnerGenerator", "grappler"]

    Class.menu_dogeisCutTanks_fun = makeMenu("Fun")
    Class.menu_dogeisCutTanks_fun.UPGRADES_TIER_0 = ["menu_dogeisCutTanks_fun_opTanks", "omegaObliterator", "traitor", "selfKiller", "bender", "imposter"]

        Class.menu_dogeisCutTanks_fun_opTanks = makeMenu("OP Tanks")
        Class.menu_dogeisCutTanks_fun_opTanks.UPGRADES_TIER_0 = ["cannon", "cracklord", "australia", "mechanic", "shotswarm", "agonizer", "crow5", "auto9", "fumigator", "cyclonedrive", "pentadrive", "ohGod", "rocknaut"]
    
    Class.menu_dogeisCutTanks_bosses = makeMenu("Bosses")
    Class.menu_dogeisCutTanks_bosses.UPGRADES_TIER_0 = ["dogeiscutBoss", "idkWhatToCallThis"]


Class.basic.UPGRADES_TIER_1.push()
    Class.basic.UPGRADES_TIER_2.push()
        Class.smasher.UPGRADES_TIER_3.push("irradiator")
        Class.healer.UPGRADES_TIER_3.push()

    Class.twin.UPGRADES_TIER_2.push()
        Class.twin.UPGRADES_TIER_3.push("pigeon")
        Class.doubleTwin.UPGRADES_TIER_3.push()
        Class.tripleShot.UPGRADES_TIER_3.push()

    Class.sniper.UPGRADES_TIER_2.push()
        Class.sniper.UPGRADES_TIER_3.push()
        Class.assassin.UPGRADES_TIER_3.push()
        Class.hunter.UPGRADES_TIER_3.push()
        Class.rifle.UPGRADES_TIER_3.push()
        Class.marksman.UPGRADES_TIER_3.push()

    Class.machineGun.UPGRADES_TIER_2.push()
        Class.machineGun.UPGRADES_TIER_3 ??= [];
        Class.machineGun.UPGRADES_TIER_3.push("clunker")
        Class.minigun.UPGRADES_TIER_3.push("jetrusher", "batterifier")
        Class.gunner.UPGRADES_TIER_3.push()
        Class.sprayer.UPGRADES_TIER_3.push()

    Class.flankGuard.UPGRADES_TIER_2.push()
        Class.flankGuard.UPGRADES_TIER_3.push()
        Class.hexaTank.UPGRADES_TIER_3.push()
        Class.triAngle.UPGRADES_TIER_3.push("pigeon", "nuisance")
        Class.auto3.UPGRADES_TIER_3.push()

    Class.director.UPGRADES_TIER_2.push()
        Class.director.UPGRADES_TIER_3.push()
        Class.overseer.UPGRADES_TIER_3.push()
        Class.cruiser.UPGRADES_TIER_3.push()
        Class.underseer.UPGRADES_TIER_3.push()
        Class.spawner.UPGRADES_TIER_3.push()

    Class.pounder.UPGRADES_TIER_2.push()
        Class.pounder.UPGRADES_TIER_3.push("batterifier", "clunker")
        Class.clunker.UPGRADES_TIER_3 = ["kludger", "disruptor"]
        Class.destroyer.UPGRADES_TIER_3.push("kludger")
        Class.artillery.UPGRADES_TIER_3.push()
        Class.launcher.UPGRADES_TIER_3.push()

    Class.trapper.UPGRADES_TIER_2.push()
        Class.trapper.UPGRADES_TIER_3.push()
        Class.builder.UPGRADES_TIER_3.push("radar")
        Class.triTrapper.UPGRADES_TIER_3.push("boobyTrapper")
        Class.trapGuard.UPGRADES_TIER_3.push()

    Class.desmos.UPGRADES_TIER_2.push()
        Class.helix.UPGRADES_TIER_3.push()

if (enableUnfinishedTanks) {

Class.basic.UPGRADES_TIER_1.push("random")

}