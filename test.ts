import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Bitfield } from "./mod.ts";

/** Concatenates given buffers. */
function concat(bufs: Uint8Array[]): Uint8Array {
  const total: number = bufs.reduce(
    (acc, cur): number => acc + cur.byteLength,
    0
  );
  const buf: Uint8Array = new Uint8Array(total);
  let offset: number = 0;
  for (const b of bufs) {
    buf.set(b, offset);
    offset += b.byteLength;
  }
  return buf;
}

test({
  name: "set and get",
  fn(): void {
    const bits: Bitfield = new Bitfield();
    assertEquals(bits.get(0), false, "first bit is false");
    bits.set(0, true);
    assertEquals(bits.get(0), true, "first bit is true");
    assertEquals(bits.get(1), false, "second bit is false");
    bits.set(0, false);
    assertEquals(bits.get(0), false, "first bit is reset");
  }
});

test({
  name: "set large and get",
  fn(): void {
    const bits: Bitfield = new Bitfield();
    assertEquals(bits.get(9999999999999), false, "large bit is false");
    bits.set(9999999999999, true);
    assertEquals(bits.get(9999999999999), true, "large bit is true");
    assertEquals(bits.get(9999999999999 + 1), false, "large bit + 1 is false");
    bits.set(9999999999999, false);
    assertEquals(bits.get(9999999999999), false, "large bit is reset");
  }
});

test({
  name: "get and set buffer",
  fn(): void {
    const bits: Bitfield = new Bitfield({ trackUpdates: true });
    assertEquals(bits.pages.get(0, true), undefined);
    assertEquals(
      bits.pages.get(Math.floor(9999999999999 / 8 / 1024), true),
      undefined
    );
    bits.set(9999999999999, true);
    const bits2: Bitfield = new Bitfield();
    var upd = bits.pages.lastUpdate();
    bits2.pages.set(Math.floor(upd.offset / 1024), upd.buffer);
    assertEquals(bits2.get(9999999999999), true, "bit is set");
  }
});

test({
  name: "toBuffer",
  fn(): void {
    const bits: Bitfield = new Bitfield();
    assertEquals(bits.toBuffer(), new Uint8Array(0));
    bits.set(0, true);
    assertEquals(bits.toBuffer(), bits.pages.get(0).buffer);
    bits.set(9000, true);
    assertEquals(
      bits.toBuffer(),
      concat([bits.pages.get(0).buffer, bits.pages.get(1).buffer])
    );
  }
});

test({
  name: "pass in buffer",
  fn(): void {
    const bits: Bitfield = new Bitfield();
    bits.set(0, true);
    bits.set(9000, true);
    const clone: Bitfield = new Bitfield(bits.toBuffer());
    assertEquals(clone.get(0), true);
    assertEquals(clone.get(9000), true);
  }
});

test({
  name: "set small buffer",
  fn(): void {
    const buf: Uint8Array = new Uint8Array(1);
    buf[0] = 255;
    const bits: Bitfield = new Bitfield(buf);
    assertEquals(bits.get(0), true);
    assertEquals(bits.pages.get(0).buffer.length, bits.pageSize);
  }
});

runIfMain(import.meta, { parallel: true });
