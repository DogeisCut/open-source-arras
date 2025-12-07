const { combineStats, skillSet, makeAuto, weaponArray, weaponMirror } = require('../facilitators.js')
const { base, statnames, dfltskl, smshskl } = require('../constants.js')
const g = require('../gunvals.js')

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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership, { reload: 3 }]),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.bigCheese, g.mothership, {maxSpeed: 0.5}]),
                TYPE: "drone",
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.bigCheese, g.mothership, {maxSpeed: 0.5}]),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.mothership]),
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
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.mothership, { range: 1/15, speed: 1/2, maxSpeed: 2 }]),
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
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, g.mothership, { range: 1/15, speed: 1/2, maxSpeed: 2 }]),
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
    GUNS: weaponArray([
        {
            POSITION: [32/2, 8/3, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, g.mothership]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5/1.5, 8/3, -1.4, 8, 0, 0, 0],
        },
    ], 9, 1/9),
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
                SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese, g.mothership, {size: 0.8}]),
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
            SPEED: base.SPEED/1.8,
            HEALTH: 250,
            PUSHABILITY: 3,
            DENSITY: 0.4,
            DAMAGE: 0.5,
        },
        HITS_OWN_TYPE: "pushOnlyTeam",
    }

    g.dcmr_scout = { reload: 2, health: 2, damage: 1.1, speed: 0.9, maxSpeed: 0.8}

    Class.dcmr_expender = {
        PARENT: "dcmr_genericScout",
        LABEL: "Expender",
        GUNS: [
            ...weaponMirror({
                POSITION: [18 / 1.5, 10 / 1.5, 1, 0, 5 / 1.5, 0, 0.5],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dcmr_scout]),
                    TYPE: "bullet"
                }
            }, 0),
            {
                POSITION: [21 / 1.5, 10 / 1.5, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.triplet, g.dcmr_scout]),
                    TYPE: "bullet"
                }
            }
        ],
        UPGRADES_TIER_1: []
    }
}

Class.developer.UPGRADES_TIER_0.push("dcmr_mother", "dcmr_expender")

Class.dcmr_mother.UPGRADES_TIER_1.push("dcmr_bigMama", "dcmr_caretaker", "dcmr_invasion", "dcmr_protector", "dcmr_residence")

Class.dcmr_expender.UPGRADES_TIER_1.push()