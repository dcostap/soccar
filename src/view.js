// Presentation values. These classes do not advance simulation state.
export const ViewVector = class ViewVector {
  x;
  y;
  z;
  constructor(e = 0, t = 0, n = 0) {
    ((this.x = e), (this.y = t), (this.z = n));
  }
  set(e, t, n) {
    return ((this.x = e), (this.y = t), (this.z = n), this);
  }
  copy(e) {
    return ((this.x = e.x), (this.y = e.y), (this.z = e.z), this);
  }
  clone() {
    return new ViewVector(this.x, this.y, this.z);
  }
  add(e) {
    return ((this.x += e.x), (this.y += e.y), (this.z += e.z), this);
  }
  sub(e) {
    return ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this);
  }
  addScaled(e, t) {
    return (
      (this.x += e.x * t),
      (this.y += e.y * t),
      (this.z += e.z * t),
      this
    );
  }
  scale(e) {
    return ((this.x *= e), (this.y *= e), (this.z *= e), this);
  }
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  normalize() {
    let e = this.length();
    return (e > 1e-12 && this.scale(1 / e), this);
  }
  crossVectors(e, t) {
    let n = e.y * t.z - e.z * t.y,
      r = e.z * t.x - e.x * t.z,
      i = e.x * t.y - e.y * t.x;
    return ((this.x = n), (this.y = r), (this.z = i), this);
  }
  subVectors(e, t) {
    return (
      (this.x = e.x - t.x),
      (this.y = e.y - t.y),
      (this.z = e.z - t.z),
      this
    );
  }
  lerp(e, t) {
    return (
      (this.x += (e.x - this.x) * t),
      (this.y += (e.y - this.y) * t),
      (this.z += (e.z - this.z) * t),
      this
    );
  }
  distanceTo(e) {
    let t = this.x - e.x,
      n = this.y - e.y,
      r = this.z - e.z;
    return Math.sqrt(t * t + n * n + r * r);
  }
};
export const ViewRotation = class ViewRotation {
  x;
  y;
  z;
  w;
  constructor(e = 0, t = 0, n = 0, r = 1) {
    ((this.x = e), (this.y = t), (this.z = n), (this.w = r));
  }
  set(e, t, n, r) {
    return ((this.x = e), (this.y = t), (this.z = n), (this.w = r), this);
  }
  copy(e) {
    return (
      (this.x = e.x),
      (this.y = e.y),
      (this.z = e.z),
      (this.w = e.w),
      this
    );
  }
  clone() {
    return new ViewRotation(this.x, this.y, this.z, this.w);
  }
  normalize() {
    let e = Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    );
    return e === 0
      ? (this.set(0, 0, 0, 1), this)
      : ((e = 1 / e),
        (this.x *= e),
        (this.y *= e),
        (this.z *= e),
        (this.w *= e),
        this);
  }

  slerp(e, t) {
    let n = this.w * e.w + this.x * e.x + this.y * e.y + this.z * e.z,
      r = e.x,
      i = e.y,
      a = e.z,
      o = e.w;
    if (
      (n < 0 && ((n = -n), (r = -r), (i = -i), (a = -a), (o = -o)), n > 0.9995)
    )
      return (
        (this.x += (r - this.x) * t),
        (this.y += (i - this.y) * t),
        (this.z += (a - this.z) * t),
        (this.w += (o - this.w) * t),
        this.normalize()
      );
    let s = Math.acos(n),
      c = Math.sqrt(1 - n * n),
      l = Math.sin((1 - t) * s) / c,
      u = Math.sin(t * s) / c;
    return (
      (this.x = this.x * l + r * u),
      (this.y = this.y * l + i * u),
      (this.z = this.z * l + a * u),
      (this.w = this.w * l + o * u),
      this
    );
  }
};

export function createWorldView() {
  return {
    tick: 0,
    ball: {
      pos: new ViewVector(),
      vel: new ViewVector(),
      angVel: new ViewVector(),
    },
    cars: [],
    pads: [],
    events: [],
  };
}
export function createCarView() {
  return {
    pos: new ViewVector(),
    vel: new ViewVector(),
    angVel: new ViewVector(),
    rot: new ViewRotation(),
    mat: { e: new Float64Array(9) },
    forward: new ViewVector(),
    left: new ViewVector(),
    up: new ViewVector(),
    controls: {},
    lastControls: {},
    worldContact: { normal: new ViewVector() },
    velImpulseCache: new ViewVector(),
    bumpCooldowns: new Map(),
    events: {},
    wheels: Array.from({ length: 4 }, () => ({
      local: new ViewVector(),
      contactPoint: new ViewVector(),
      contactNormal: new ViewVector(),
    })),
    get forwardSpeed() {
      return this.vel.dot(this.forward);
    },
  };
}
