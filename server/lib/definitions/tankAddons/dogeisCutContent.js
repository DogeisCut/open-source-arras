const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, makeTurret, addAura, menu, dereference } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const { createLine, createSpringConstraint } = require('./constraints.js');
const g = require('../gunvals.js');

/* Projectiles */{
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
                                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.gunner, {shudder: 2.5, spray: 4.5 }]),
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
                        if (other && other !== instance.master && other !== instance && other.stickied == undefined) {
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
                                SHOOT_SETTINGS: combineStats([g.basic, {shudder: 2.5, spray: 4.5 }]),
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
                    body.zapwireLine = createSpringConstraint(body, body.master)
                },  
            },
        ]
    }

    Class.teatheredDrone = {
        PARENT: "drone",
        BODY: {
            DENSITY: base.DENSITY * 1,
        },
        ON: [
            {
                event: "define",
                handler: ({ body }) => {
                    body.zapwireLine = createSpringConstraint(body, body.master, 150, 0.25, 0.01, false)
                },  
            },
        ]
    }

}

/* TANKS */{
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
                                SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.streamliner, g.streamliner, g.sniper]),
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.pounder]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [19, 12, 1, 0, 0, 0, 1 / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.pounder]),
                    TYPE: "bullet"
                }
            },
            {
                POSITION: [17, 12, 1, 0, 0, 0, 2 / 3],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.minigun, g.pounder]),
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.pounder, { size: 0.92 }]),
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.pounder, g.destroyer, { size: 0.92 }]),
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.pounder, g.lowPower, { size: 0.92 }]),
                    NO_LIMITATIONS: true, // i hate this
                    TYPE: "disruptorBullet"
                }
            }
        ],
        TURRETS: [{
            POSITION: [28, 0, 0, 45, 0, 0],
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
                    SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
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
                POSITION: [ 18, 8, 1, 0, 0, -54.73698827040275, 0, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                    TYPE: "setTrap",
                }, }, {
                POSITION: [ 18, 8, 1, 0, 0, 54.73698827040275, 0.2, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.flankGuard]),
                    TYPE: "setTrap",
                }, }, {
                POSITION: [ 2, 8, 1.5, 17, 0, -53.74616226255521, 0, ],
                }, {
                POSITION: [ 2, 8, 1.5, 17, 0, 53.74616226255521, 0, ],
                }, {
                POSITION: [ 13, 7, 1, 7, 0, 0, 0.9, ],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
                    TYPE: "bullet",
                }, }, 
            ],
    };

    Class.pigeon = makeBird("twin", "Pigeon")

    Class.irradiatorAura = addAura(2, 1.2)
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

    Class.nuisanceAura = addAura(2, 1.2)
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
                    SHOOT_SETTINGS: combineStats([g.basic]),
                    NO_LIMITATIONS: true,
                    TYPE: "zapwireBullet",
                }
            }
        ]
    }

    Class.toverseer = {
        PARENT: "genericTank",
        LABEL: "Dog Walker",
        DANGER: 6,
        STAT_NAMES: statnames.drone,
        BODY: {
            SPEED: 0.9 * base.SPEED,
            FOV: 1.1 * base.FOV,
        },
        MAX_CHILDREN: 1,
        GUNS: weaponArray({
            POSITION: [6, 12, 1.2, 8, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
                TYPE: "teatheredDrone",
                NO_LIMITATIONS: true,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                WAIT_TO_CYCLE: true
            }
        }, 2)
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
}

Class.dogeisCutTanks = menu("DogeisCut Tanks")
Class.dogeisCutTanks.UPGRADES_TIER_0 = ["sgn", "zapwire", "toverseer", "softBoxSpawnerGenerator"]
Class.addons.UPGRADES_TIER_0.push("dogeisCutTanks");

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
        Class.autoTrapper.UPGRADES_TIER_3.push()
    
    Class.desmos.UPGRADES_TIER_2.push()
        Class.helix.UPGRADES_TIER_3.push()