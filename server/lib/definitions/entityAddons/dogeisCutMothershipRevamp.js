const { combineStats, skillSet, makeAuto, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
const g = require('../gunvals.js')

/* Issues:
- Motherships seem to lose FOV when upgradinoldgunvals.
- Motherships can damage each other (both via ramming and bullets/drones/minions)
- Scouts get kills in the name of the mothership
- Scout eggs are really uninteresting
- Scout AI is super robotic, agressive, and stupid.
- Scouts can ram motherships for shit tons of damage.
- Scouts are killed after the mothership upgrades
- Theres no global pushing force keeping the motherships apart.
*/

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

Class.dcmr_originalMothership = {
    PARENT: "genericTank",
    LABEL: "Mothership",
    NAME: "Mothership",
    DANGER: 10,
    SIZE: Class.genericTank.SIZE * (12 / 3),
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: {
        REGEN: 0.5,
        FOV: 1,
        SHIELD: 0,
        ACCEL: 0.2,
        SPEED: 0.3,
        HEALTH: 4000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 1.5,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 3.1,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 22.5,
                DELAY: 0
			},
            PROPERTIES: {
                MAX_CHILDREN: 1,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 3.1,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 45,
                DELAY: 1 / 32
			},
            PROPERTIES: {
                MAX_CHILDREN: 1,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.mothership]),
                TYPE: ["drone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 8, 1/16)
}

Class.dcmr_genericMothership = {
    PARENT: "genericTank",
    LABEL: "Unknown Mothership",
    NAME: "Mothership",
    REROOT_UPGRADE_TREE: "dcmr_mother",
    DANGER: 10,
    SIZE: Class.genericTank.SIZE * (12 / 3),
    SHAPE: 16,
    STAT_NAMES: statnames.drone,
    VALUE: 5e5,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    BODY: {
        REGEN: 0.5,
        FOV: 1,
        SHIELD: 0,
        ACCEL: 0.2,
        SPEED: 0.3,
        HEALTH: 4000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 1.5,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    TURRETS: [
        {
            POSITION: {SIZE: 10, X: 0, Y: 0, ANGLE: 0, ARC: 360, LAYER: 1},
            TYPE: "dcmr_mothershipScoutSpawner",
        }
    ]
}

Class.dcmr_mothershipScoutSpawner = {
    PARENT: "genericTank",
    NAME: "Scout Spawner",
    SIZE: Class.genericTank.SIZE * (12 / 3) / 2,
    SHAPE: 8,
    COLOR: -1,
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    FACING_TYPE: ["spin", { speed: -0.02 }],
    INDEPENDENT: true,
    GUNS: weaponArray([ 
        {
            POSITION: [22, 9, 0.8, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 11, 0.8, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 9, 0.8, 21, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 1,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.mothership, { reload: 3 }]),
                TYPE: "dcmr_scoutEgg",
                AUTOFIRE: true,
                WAIT_TO_CYCLE: true,
            }
        },
        {
            POSITION: [2, 4, 0.8, 17, 0, 0, 0],
        },
        {
            POSITION: [2, 4, -0.8, 15, 0, 0, 0],
        },
    ], 3, 1/3)
}

Class.dcmr_droneDeco = {
    SHAPE: 3,
    COLOR: -1
}
Class.dcmr_betaDrone = {
    PARENT: "drone",
    PROPS: [
        {
            POSITION: { SIZE: 10, X: 0, Y: 0, ANGLE: 60, ARC: 0, LAYER: 1 },
            TYPE: "dcmr_droneDeco"
        }
    ]
}
Class.dcmr_alphaDrone = {
    PARENT: "drone",
    PROPS: [
        {
            POSITION: { SIZE: 10, X: 0, Y: 0, ANGLE: 60, ARC: 0, LAYER: 1 },
            TYPE: "dcmr_droneDeco"
        },
        {
            POSITION: { SIZE: 5, X: 0, Y: 0, ANGLE: 0, ARC: 0, LAYER: 1 },
            TYPE: "dcmr_droneDeco"
        }
    ]
}

Class.dcmr_mother = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Mother",
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 5.3,
				WIDTH: 6.2,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 45,
                DELAY: 0
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.bigCheese, oldgunvals.mothership, {maxSpeed: 0.5}]),
                TYPE: "dcmr_alphaDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: {
				LENGTH: 5.3,
				WIDTH: 6.2,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 90,
                DELAY: 1 / 16
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.bigCheese, oldgunvals.mothership, {maxSpeed: 0.5}]),
                TYPE: ["dcmr_alphaDrone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 4, 1 / 8),
    UPGRADES_TIER_1: []
}

Class.dcmr_bigMama = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Big Mama",
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 3.1,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 22.5,
                DELAY: 0
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.mothership]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 3.1,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 45,
                DELAY: 1 / 32
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.overseer, oldgunvals.mothership]),
                TYPE: ["drone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 8, 1/16)
}

Class.dcmr_caretaker = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Caretaker",
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 2.8,
				ASPECT: 1,
				X: 8,
				Y: 0,
                ANGLE: 45,
                DELAY: 0
			}
        },
        {
            POSITION: {
				LENGTH: 3.3,
				WIDTH: 3.1,
				ASPECT: 1,
				X: 8,
				Y: 0,
                ANGLE: 45,
                DELAY: 0
			}
        },
        {
            POSITION: {
				LENGTH: 0.3,
				WIDTH: 3.1,
				ASPECT: 1,
				X: 12,
				Y: 0,
                ANGLE: 45,
                DELAY: 0
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.factory, oldgunvals.babyfactory, oldgunvals.mothership]),
                TYPE: "minion",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        },
        
        
        {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 2.8,
				ASPECT: 1,
				X: 8,
				Y: 0,
                ANGLE: 90,
                DELAY: 1 / 16
			}
        },
        {
            POSITION: {
				LENGTH: 3.3,
				WIDTH: 3.1,
				ASPECT: 1,
				X: 8,
				Y: 0,
                ANGLE: 90,
                DELAY: 1 / 16
			}
        },
        {
            POSITION: {
				LENGTH: 0.3,
				WIDTH: 3.1,
				ASPECT: 1,
				X: 12,
				Y: 0,
                ANGLE: 90,
                DELAY: 1 / 16
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.factory, oldgunvals.babyfactory, oldgunvals.mothership]),
                TYPE: ["minion", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 4, 1/8)
}

Class.dcmr_invasion = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Invasion",
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 3,
				WIDTH: 3.1/2,
				ASPECT: 0.7,
				X: 8,
				Y: 0,
                ANGLE: 22.5/2,
                DELAY: 0
			},
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([oldgunvals.swarm, oldgunvals.battleship, oldgunvals.mothership, { range: 1/15, speed: 1/2, maxSpeed: 2 }]),
                TYPE: "swarm",
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true,
            }
        }, {
            POSITION: {
				LENGTH: 3,
				WIDTH: 3.1/2,
				ASPECT: 0.7,
				X: 8,
				Y: 0,
                ANGLE: 22.5,
                DELAY: 1 / 64
			},
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([oldgunvals.swarm, oldgunvals.battleship, oldgunvals.mothership, { range: 1/15, speed: 1/2, maxSpeed: 2 }]),
                TYPE: ["swarm", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "swarm",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 16, 1/32)
}

Class.dcmr_protector = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Protector",
    BODY: {
        REGEN: 0.6,
        FOV: 1.2,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [32/2, 8/3, 1, 0, 0, (1/9)/2, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper, oldgunvals.assassin, oldgunvals.mothership]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5/1.5, 8/3, -1.4, 8, 0, (1/9)/2, 0],
            },
            {
                POSITION: [28/2, 7/3, 1, 0, 0, (1/9), (1/9)/2],
                PROPERTIES: {
                    AUTOFIRE: true,
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.sniper, oldgunvals.assassin, oldgunvals.mothership]),
                    TYPE: "bullet",
                },
            },
            {
                POSITION: [5/1.5, 7/3, -1.4, 8, 0, (1/9), (1/9)/2],
            },
        ], 9, 1 / 9),
    ],
}

Class.dcmr_residenceBody = {
    LABEL: "",
    FACING_TYPE: ["spin", { speed: 0.02 }],
    COLOR: "black",
    SHAPE: 12,
    SIZE: 12,
    INDEPENDENT: true
}
Class.dcmr_residence = {
    PARENT: "dcmr_genericMothership",
    LABEL: "Residence",
    BODY: {
        ACCEL: 0.3,
        SPEED: 0.5,
        HEALTH: 4500,
        PUSHABILITY: 0.12,
        DENSITY: 0.3,
        DAMAGE: 2,
    },
    GUNS: weaponArray([
        {
            POSITION: {
				LENGTH: 4.3,
				WIDTH: 5.2,
				ASPECT: 1.2,
				X: 8,
				Y: 0,
                ANGLE: 90,
                DELAY: 1 / 16
			},
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([oldgunvals.drone, oldgunvals.bigCheese, oldgunvals.mothership, {size: 0.8, maxSpeed: 0.75}]),
                TYPE: ["dcmr_betaDrone", {
                        AI: {skynet: true},
                        INDEPENDENT: true,
                        BODY: {FOV: 2},
                    }],
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true,
            }
        }
    ], 4, 1 / 4),
    TURRETS: [
        {
            POSITION: [24.5, 0, 0, 0, 360, 0],
            TYPE: "dcmr_residenceBody"
        },
        {
            POSITION: {SIZE: 10, X: 0, Y: 0, ANGLE: 0, ARC: 360, LAYER: 1},
            TYPE: "dcmr_mothershipScoutSpawner",
        }
    ]
}

// Actually gains like 6 evenly spaced auto turrets 
Class.dcmr_autoMother = {
}


scouts: {
    Class.dcmr_scoutEgg = {
        PARENT: "genericTank",
        SHAPE: 9,
        INDEPENDENT: true,
        //PERSISTS_AFTER_DEATH: true, // causes dupe scouts :(
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    setTimeout(() => {
                        body.define("dcmr_expender")
                        body.isMothership = true
                        body.define({ ACCEPTS_SCORE: false })
                        body.controllers.push(new ioTypes.nearestDifferentMaster(body, {}, global.gameManager), new ioTypes.mapTargetToGoal(body), new ioTypes.wanderAroundMap(body, {lookAtGoal: true}));
                        body.refreshBodyAttributes();
                    }, 1000 * 3)
                }
            }
        ]
    }

    Class.dcmr_genericScout = {
        PARENT: "genericTank",
        LABEL: "Unknown Scout",
        NAME: "Scout",
        REROOT_UPGRADE_TREE: "dcmr_expender",
        SYNC_WITH_TANK: true,
        FACING_TYPE: ["smoothToTarget", { smoothness: 10 }],
        DANGER: 8,
        SIZE: Class.genericTank.SIZE * (12 / 3) / 3,
        SHAPE: 9,
        STAT_NAMES: statnames.drone,
        VALUE: 5e4,
        SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
        BODY: {
            REGEN: 0.75,
            FOV: 1,
            SHIELD: 0.3,
            SPEED: base.SPEED/2.8,
            HEALTH: 250,
            PUSHABILITY: 3,
            DENSITY: 0.4,
            DAMAGE: 0.5,
        },
        HITS_OWN_TYPE: "pushOnlyTeam",
    }

    oldgunvals.dcmr_scout = { reload: 2, health: 2, damage: 1.1, speed: 0.9, maxSpeed: 0.8}

    Class.dcmr_expender = {
        PARENT: "dcmr_genericScout",
        LABEL: "Expender",
        GUNS: [
            ...weaponMirror({
                POSITION: [18 / 1.5, 10 / 1.5, 1, 0, 5 / 1.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.twin, oldgunvals.triplet, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            {
                POSITION: [21 / 1.5, 10 / 1.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.twin, oldgunvals.triplet, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ],
        UPGRADES_TIER_1: []
    }

    Class.dcmr_engulpher = {
        PARENT: "dcmr_genericScout",
        LABEL: "Engulpher",
        GUNS: [
            ...weaponMirror({
                POSITION: [18 / 1.5, 10 / 1.5, 1.3, 0, 5 / 1.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.swarm, oldgunvals.battleship, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            {
                POSITION: [21 / 1.5, 10 / 1.5, 1.3, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.swarm, oldgunvals.battleship, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ],
    }

    Class.dcmr_crusherBody = {
        LABEL: "",
        FACING_TYPE: ["spin", { speed: 0.08 }],
        COLOR: "black",
        SHAPE: 8,
        SIZE: 12,
        INDEPENDENT: true
    }
    Class.dcmr_crusher = {
        PARENT: "dcmr_genericScout",
        LABEL: "Crusher",
        BODY: {
            REGEN: 0.8,
            FOV: 1,
            SHIELD: 0.5,
            SPEED: base.SPEED/0.8,
            HEALTH: 200,
            PUSHABILITY: 2,
            DENSITY: 0.5,
            DAMAGE: 4.5,
        },
        TURRETS: [
            {
                POSITION: [22.5, 0, 0, 0, 360, 0],
                TYPE: "dcmr_crusherBody"
            },
        ]
    }

    Class.dcmr_defender = {
        PARENT: "dcmr_genericScout",
        LABEL: "Defender",
        GUNS: [
            ...weaponMirror({
                POSITION: [15 / 1.5, 8 / 1.5, 1, 0, 10 / 1.5, 0, 0.0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.twin, oldgunvals.tripleShot, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            ...weaponMirror({
                POSITION: [18 / 1.5, 10 / 1.5, 1, 0, 5 / 1.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.twin, oldgunvals.tripleShot, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            {
                POSITION: [21 / 1.5, 10 / 1.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.twin, oldgunvals.tripleShot, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ]
    }

    Class.dcmr_speedster = {
        PARENT: "dcmr_genericScout",
        LABEL: "Speedster",
        GUNS: [
            ...weaponMirror({
                POSITION: [18 / 1.5, 10 / 1.5, 1, 0, 5 / 1.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.flankGuard, oldgunvals.twin, oldgunvals.triplet, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            ...weaponMirror({
                POSITION: [16 / 1.5, 10 / 1.5, 1, 0, -2, 150, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.flankGuard, oldgunvals.triAngle, oldgunvals.thruster]),
                    TYPE: "bullet"
                }
            }, 0),
            ...weaponMirror({
                POSITION: [17 / 1.5, 10 / 1.5, 1, 0, 0, 150, 0.25],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.flankGuard, oldgunvals.triAngle, oldgunvals.thruster]),
                    TYPE: "bullet"
                }
            }, 0),
            {
                POSITION: [21 / 1.5, 10 / 1.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.flankGuard, oldgunvals.twin, oldgunvals.triplet, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ],
    }

    Class.dcmr_roller = {
        PARENT: "dcmr_genericScout",
        LABEL: "Roller",
        GUNS: [
            {
                POSITION: [21 / 1.5, 18 / 1.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([oldgunvals.basic, oldgunvals.pounder, oldgunvals.destroyer, oldgunvals.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ]
    }
}

Class.developer.UPGRADES_TIER_0.push("dcmr_mother", "dcmr_expender")

Class.dcmr_mother.UPGRADES_TIER_1.push("dcmr_bigMama", "dcmr_caretaker", "dcmr_invasion", "dcmr_protector", "dcmr_residence")

Class.dcmr_expender.UPGRADES_TIER_1.push("dcmr_defender", "dcmr_crusher", "dcmr_roller", "dcmr_speedster", "dcmr_engulpher")