const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, makeTurret, makeAura, makeMenu, dereference, weaponMirror } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js');

const ADDON_PREFIX = "dcde_"

const ARMS_RACE = false
/*
Class.desmos = {
    PARENT: "genericTank",
    LABEL: "Desmos",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
				WIDTH: 8,
				ASPECT: -4/3,
				X: 0,
				Y: 0,
				ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 1.5, -6.25, 90, 0],
            POSITION: {
                LENGTH: 3.75,
				WIDTH: 10,
				ASPECT: 2.125,
				X: 1.5,
				Y: -6.25,
				ANGLE: 90,
                DELAY: 0
            }
        })
    ]
}
*/

Class[ADDON_PREFIX + "photon"] = {
    PARENT: "genericTank",
    LABEL: "Photon",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8 / 3,
                ASPECT: -4 / 3,
                Y: 4,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8 / 3,
                ASPECT: -4 / 3,
                Y: -4,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, g.gunner]),
                TYPE: ["bullet", {CONTROLLERS: [['snake', {invert: true}]]}]
            }
        },
        {
            POSITION: {
                LENGTH: 21,
                WIDTH: 8 / 3,
                ASPECT: -4 / 3,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.twin, g.gunner]),
                TYPE: "bullet"
            }
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 2, -6.25, 90, 0]
        })
    ]
}

Class[ADDON_PREFIX + "neutron"] = {
    PARENT: "genericTank",
    LABEL: "Neutron",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
				WIDTH: 12,
				ASPECT: -4/3,
				X: 0,
				Y: 0,
				ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.pounder]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 1.5, -6.25, 90, 0],
            POSITION: {
                LENGTH: 3.75,
				WIDTH: 10,
				ASPECT: 2.125,
				X: 3.5,
				Y: -6.25,
				ANGLE: 90,
                DELAY: 0
            }
        })
    ]
}

Class[ADDON_PREFIX + "proton"] = {
    PARENT: "genericTank",
    LABEL: "Proton",
    STAT_NAMES: statnames.desmos,
    GUNS: [
        {
            POSITION: {
                LENGTH: 20,
				WIDTH: 14,
				ASPECT: -4/3,
				X: 0,
				Y: 0,
				ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.desmos, g.pounder, g.destroyer]),
                TYPE: ["bullet", {CONTROLLERS: ['snake']}]
            }
        },
        ...weaponMirror({
            POSITION: [3.75, 10, 2.125, 1.5, -6.25, 90, 0],
            POSITION: {
                LENGTH: 3.75,
				WIDTH: 10,
				ASPECT: 2.125,
				X: 4.5,
				Y: -6.25,
				ANGLE: 90,
                DELAY: 0
            }
        })
    ]
}

Class.desmos.UPGRADES_TIER_2.push(ADDON_PREFIX + "neutron")
    Class.helix.UPGRADES_TIER_3.push(ADDON_PREFIX + "photon")
    Class[ADDON_PREFIX + "neutron"].UPGRADES_TIER_3 = [ADDON_PREFIX + "proton"]

if (ARMS_RACE) {
    Class.desmos.UPGRADES_TIER_2.push()
        Class.helix.UPGRADES_TIER_3.push()
            Class.triplex.UPGRADES_TIER_4.push()
            Class.quadruplex.UPGRADES_TIER_4.push()
            Class[ADDON_PREFIX + "photon"].UPGRADES_TIER_4.push()
        Class[ADDON_PREFIX + "neutron"].UPGRADES_TIER_3.push()
}