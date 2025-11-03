// Adds lines and contraints
// Have fun!
// By: DogeisCut

function alignLineEntity(body) {
    const se = body.store.lineStartEntity
    const ee = body.store.lineEndEntity
    if (se && ee) {
        const s = new Vector(se.x + se.xMotion, se.y + se.yMotion)
        const e = new Vector(ee.x + ee.xMotion, ee.y + ee.yMotion)
        const es = new Vector(e.x - s.x, e.y - s.y)
        body.x = (s.x + e.x) / 2
        body.y = (s.y + e.y) / 2
        body.facing = es.direction 
        body.SIZE = es.length / 2
        if (se.isDead() || ee.isDead() || se.isGhost || ee.isGhost) {
            body.destroy()
        }
    } else {
        body.destroy()
    }
}

Class.line = {
    LABEL: "Line",
    SHAPE: "M -1 0 L 1 0 Z",
    FACING_TYPE: "",
    MOTION_TYPE: "",
    NO_SIZE_ANIMATION: true,
    CAN_GO_OUTSIDE_ROOM: true,
    CAN_BE_ON_LEADERBOARD: false,
    ACCEPTS_SCORE: false,
    DRAW_HEALTH: false,
    HITS_OWN_TYPE: "never",
    IGNORED_BY_AI: true,
    ARENA_CLOSER: true,
    IS_IMMUNE_TO_TILES: true,
    NO_COLLISIONS: true,
    BODY: {
        PUSHABILITY: 0,
        SPEED: 5,
        FOV: 2.5,
        DAMAGE: 0,
        HEALTH: 1e100,
        SHIELD: 1e100,
        REGEN: 1e100,
    },
    ON: [
        {
            event: "define",
            handler: ({ body }) => {
                body.store.lineStartEntity ??= null
                body.store.lineEndEntity ??= null
            },
        },
        {
            event: "tick",
            handler: ({ body }) => alignLineEntity(body)
        },
    ]
}

Class.springConstraint = {
    PARENT: "line",
    ON: [
        {
            event: "define",
            handler: ({ body }) => {
                body.store.lineStartEntity ??= null
                body.store.lineEndEntity ??= null
                body.store.springConstraintLength ??= 100
                body.store.springConstraintStrength ??= 0.1
                body.store.springConstraintDampening ??= 0.05
                body.store.springConstraintCompressable ??= false
            },
        },
        {
            event: "tick",
            handler: ({ body }) => {
                const E1 = body.store.lineStartEntity;
                const E2 = body.store.lineEndEntity;
                
                if (!E1 || !E2) return;

                const LENGTH = body.store.springConstraintLength;
                const STRENGTH = body.store.springConstraintStrength;
                const DAMPENING = body.store.springConstraintDampening;
                const COMPRESSABLE = body.store.springConstraintCompressable;

                const density1 = (E1.DENSITY > 0) ? E1.DENSITY : 1;
                const density2 = (E2.DENSITY > 0) ? E2.DENSITY : 1;

                const rx = E2.x - E1.x;
                const ry = E2.y - E1.y;
                const r = Math.sqrt(rx * rx + ry * ry);
                
                if (r === 0) return;

                const r_hat_x = rx / r;
                const r_hat_y = ry / r;
                
                const extension = r - LENGTH;
                let Fs = STRENGTH * extension;

                if (!COMPRESSABLE && extension < 0) {
                    Fs = 0;
                }

                const v_rel_x = E2.velocity.x - E1.velocity.x;
                const v_rel_y = E2.velocity.y - E1.velocity.y;
                const r_dot = v_rel_x * r_hat_x + v_rel_y * r_hat_y;
                
                const Fd = -DAMPENING * r_dot;
                
                const F_tot = -Fs + Fd;

                const dVx = F_tot * r_hat_x;
                const dVy = F_tot * r_hat_y;
                
                E2.velocity.x += dVx / density2;
                E2.velocity.y += dVy / density2;

                E1.velocity.x -= dVx / density1;
                E1.velocity.y -= dVy / density1;
                
                alignLineEntity(body)
            }
        },
    ]
}

function createLine(startEntity, endEntity, settings = {}) {
    const o = new Entity(startEntity, endEntity)
    o.define({ ...settings, ...Class.line })
    o.store.lineStartEntity = startEntity
    o.store.lineEndEntity = endEntity
    alignLineEntity(o)
    o.refreshBodyAttributes();
    o.life();
    return o
}

function createSpringConstraint(startEntity, endEntity, length = 100, strength = 0.05, dampening = 0.05, compressable = true, settings = {}) {
    const o = new Entity(startEntity, endEntity)
    o.define({ ...settings, ...Class.springConstraint })
    o.store.lineStartEntity = endEntity
    o.store.lineEndEntity = startEntity
    o.store.springConstraintLength = length
    o.store.springConstraintStrength = strength
    o.store.springConstraintDampening = dampening
    o.store.springConstraintCompressable = compressable
    alignLineEntity(o)
    o.refreshBodyAttributes();
    o.life();
    return o
}

export {
    createLine,
    createSpringConstraint
}