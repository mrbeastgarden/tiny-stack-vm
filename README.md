# tiny-stack-vm — make.fun entry

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/mrbeastgarden/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/mrbeastgarden/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

Entry for the make.fun bounty
[Build a tiny stack virtual machine, 22 November 2026](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
(`tiny-stack-vm-01-run-20261122`).

## What it does

`main.ts` runs every program of the set on a fresh implementation of the
tiny stack ISA: 32-bit wrapping arithmetic, a 256-value stack, a 64-deep
call stack, 256 words of memory, ten traps with their own exit codes, and
the 1M step / 64 KiB output limits. It reads `/input/<id>/program.bin` +
`input.bin` and writes `/output/<id>/stdout.bin` + `exit.txt`. Node 22,
standard library only, no network.

## Measured locally (22 Nov 2026)

- Practice set: **1,000,000** (40/40 instances, 40,000/40,000 points).
- Differential fuzz vs the kit's reference VM: 3,000 random programs,
  0 divergences; 22 directed edge cases (INT_MIN/-1, unsigned ops, shifts
  ≥ 32, PUSH8 sign, EXIT -1, all ten traps, step/output limits), 22/22.
- Two runs write byte-identical output.
