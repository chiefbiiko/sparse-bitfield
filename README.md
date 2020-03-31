# sparse-bitfield

Bitfield implementation that allocates a series of 1kb buffers to support sparse bitfields
without allocating a massive buffer. This is a port of [mafintosh's npm module](https://github.com/mafintosh/sparse-bitfield).

This module is mostly useful if you need a big bitfield where you won't nessecarily set every bit.

all credit to the original author [mafintosh](https://github.com/mafintosh)

[![ci](https://github.com/chiefbiiko/sparse-bitfield/workflows/ci/badge.svg?branch=master)](https://github.com/chiefbiiko/sparse-bitfield/actions)

## usage

``` js
import { Bitfield } from "https://denopkg.com/chiefbiiko/sparse-bitfield@v0.1.0/mod.ts"

const bits: Bitfield = new Bitfield()

bits.set(0, true) // set first bit
bits.set(1, true) // set second bit
bits.set(1000000000000, true) // set the 1.000.000.000.000th bit
```

Running the above example will allocate two 1kb buffers internally.
Each 1kb buffer can hold information about 8192 bits so the first one will be used to store information about the first two bits and the second will be used to store the 1.000.000.000.000th bit.

## api

#### `const bits: Bitfield = bitfield(options?: BitfieldOptions)`

Create a new bitfield. Options include

``` js
{
  pageSize: 1024, // how big should the partial buffers be
  buffer: anExistingBitfield,
  trackUpdates: false // track when pages are being updated in the pager
}
```

#### `bits.set(index: number, value: boolean): boolean`

Set a bit to true or false.

#### `bits.get(index: number): boolean`

Get the value of a bit.

#### `bits.pages`

A [memory-pager](https://github.com/chiefbiiko/memory-pager) instance that is managing the underlying memory.
If you set `trackUpdates` to true in the constructor you can use `.lastUpdate()` on this instance to get the last updated memory page.

#### `bits.toBuffer(): Uint8Array`

Get a single buffer representing the entire bitfield.

## license

[MIT](./LICENSE)