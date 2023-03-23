class MT19937_64 {
  mt;
  mti;

  constructor() {
    this.mt = new Array(312).fill(0n);
    this.mti = 313;
  }

  setSeed(seed: bigint) {
    this.mt[0] = seed & 0xffffffffffffffffn;
    for (let i = 1; i < 312; i++) {
      this.mt[i] = (6364136223846793005n * (this.mt[i - 1] ^ (this.mt[i - 1] >> 62n)) + BigInt(i)) & 0xffffffffffffffffn
    }
    this.mti = 312;
  }

  int64() {
    if (this.mti >= 312) {
      if (this.mti == 313) this.setSeed(5489n);
      for (let k = 0; k < 311; k++) {
        const y = (this.mt[k] & 0xFFFFFFFF80000000n) | (this.mt[k + 1] & 0x7fffffffn);
        if (k < 312 - 156) {
          this.mt[k] = this.mt[k + 156] ^ (y >> 1n) ^ ((y & 1n) == 0n ? 0n : 0xB5026F5AA96619E9n);
        } else {
          this.mt[k] = this.mt[k + 156 - 624 + this.mt.length] ^ (y >> 1n) ^ ((y & 1n) == 0n ? 0n : 0xB5026F5AA96619E9n);
        }
      }
      const yy = (this.mt[311] & 0xFFFFFFFF80000000n) | (this.mt[0] & 0x7fffffffn);
      this.mt[311] = this.mt[155] ^ (yy >> 1n) ^ ((yy & 1n) == 0n ? 0n : 0xB5026F5AA96619E9n);
      this.mti = 0;
    }
    let x = this.mt[this.mti];
    this.mti += 1;
    x ^= (x >> 29n) & 0x5555555555555555n;
    x ^= (x << 17n) & 0x71D67FFFEDA60000n;
    x ^= (x << 37n) & 0xFFF7EEE000000000n;
    x ^= (x >> 43n);
    return x;
  }
}

export default function generateKey(): Buffer {
  const generator = new MT19937_64();
  generator.setSeed(BigInt(2));
  const generator2 = new MT19937_64();
  generator2.setSeed(generator.int64());
  generator2.int64();

  const key = Buffer.alloc(4096);
  for (let i = 0; i < 4096; i += 8)
    key.writeBigUInt64BE(generator2.int64(), i);
  return key;
}