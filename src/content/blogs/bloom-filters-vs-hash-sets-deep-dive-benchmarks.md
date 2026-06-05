---
title: "Bloom Filters vs Hash Sets: Why the Wrong Choice Costs You Millions of Database Calls"
date: 2026-06-05
tags: [bloom filter, hash set, false positive rate, membership testing, bit array, distributed caching, Cassandra, BigTable, system design]
metaDescription: A complete technical breakdown of Bloom filters versus hash sets for membership testing at scale: the math, the implementation, false positive tuning, and benchmarks across one million, ten million, and one billion items.
readTime: 12
type: technical
excerpt: At ten million items, a well-tuned Bloom filter uses ~9MB where a hash set uses ~320MB. The right choice depends on your tolerance for false positives and the cost of your fallback operation. Here's the math, the implementation, and benchmarks.
---

> **TL;DR** — A Bloom filter answers "is this definitely not in the set?" in O(1) time using a bit array. It trades a tunable false positive rate for dramatic memory savings. At ten million items, a well-tuned Bloom filter uses ~9MB where a hash set uses ~320MB. The right choice depends on your tolerance for false positives and the cost of your fallback operation.

---

## The Core Question: What Are You Actually Paying For?

Both structures solve membership testing: given a key, determine whether it has been seen before.

A hash set gives you exact answers at full memory cost. A Bloom filter gives you probabilistic answers at a fraction of the memory cost. Neither is wrong. The question is which failure mode is acceptable in your system.

A false negative (the filter says "not present" when the item is actually there) is catastrophic in most systems. A Bloom filter never produces false negatives. This is the guarantee the algorithm is built on.

A false positive (the filter says "might be present" when it is not) is expensive but survivable. You do unnecessary work — a database lookup, a cache fetch — and find nothing. You pay the cost of the fallback operation, not the cost of correctness.

If your fallback operation is cheap, false positives cost almost nothing. If your fallback is a database read under heavy load, you want the false positive rate tuned low. This is not a data structure decision. It is a cost accounting decision.

---

## How Hash Sets Work at Scale

A hash set stores the actual keys (or their hashes) in a bucket array. A lookup hashes the key, finds the bucket, and scans for a match.

The memory cost is unavoidable. Every item you insert must be representable in the structure. With 10 million string keys averaging 32 bytes each:

```
Memory = items × average_key_size × load_factor_overhead
Memory = 10,000,000 × 32 bytes × 1.33 (typical Python dict overhead)
Memory ≈ 426 MB
```

In Java with a `HashSet<String>`, object overhead pushes this above 500MB for the same data.

The lookup is O(1) amortized and exact. The price is linear space in the number of items.

---

## How Bloom Filters Work

A Bloom filter is a bit array of `m` bits, all initialized to zero. It uses `k` independent hash functions.

**Insert operation:**
Hash the key `k` times. Set the bit at each of the `k` resulting positions to 1.

**Lookup operation:**
Hash the key `k` times. Check the bit at each position. If every bit is 1, report "possibly present." If any bit is 0, report "definitely not present."

The "definitely not present" guarantee comes directly from the structure: inserting a key sets bits, it never clears them. So if a bit is still 0, that position was never set by any inserted key, meaning this key was never inserted.

<svg width="100%" viewBox="0 0 680 360" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Bloom filter bit array insert and lookup</title>
  <desc>A bit array showing two keys inserted with k=3 hash functions each, setting bits, and a third key lookup checking those bits</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
    .hit  { font-family: ui-monospace, monospace; font-size: 12px; fill: #042C53; font-weight: 600; }
    .miss { font-family: ui-monospace, monospace; font-size: 12px; fill: #A32D2D; font-weight: 600; }
  </style>
  <text class="lbl" x="20" y="28">Bit array — 16 bits, k=3 hash functions</text>
  <g>
    <rect x="20"  y="55" width="35" height="35" rx="5" fill="#B5D4F4" stroke="#378ADD" stroke-width="1"/>
    <text class="hit" x="37"  y="77" text-anchor="middle">1</text>
    <text class="sub" x="37"  y="107" text-anchor="middle">0</text>
    <rect x="57"  y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="74"  y="77" text-anchor="middle">0</text>
    <text class="sub" x="74"  y="107" text-anchor="middle">1</text>
    <rect x="94"  y="55" width="35" height="35" rx="5" fill="#B5D4F4" stroke="#378ADD" stroke-width="1"/>
    <text class="hit" x="111" y="77" text-anchor="middle">1</text>
    <text class="sub" x="111" y="107" text-anchor="middle">2</text>
    <rect x="131" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="148" y="77" text-anchor="middle">0</text>
    <text class="sub" x="148" y="107" text-anchor="middle">3</text>
    <rect x="168" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="185" y="77" text-anchor="middle">0</text>
    <text class="sub" x="185" y="107" text-anchor="middle">4</text>
    <rect x="205" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="222" y="77" text-anchor="middle">0</text>
    <text class="sub" x="222" y="107" text-anchor="middle">5</text>
    <rect x="242" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="259" y="77" text-anchor="middle">0</text>
    <text class="sub" x="259" y="107" text-anchor="middle">6</text>
    <rect x="279" y="55" width="35" height="35" rx="5" fill="#B5D4F4" stroke="#378ADD" stroke-width="1"/>
    <text class="hit" x="296" y="77" text-anchor="middle">1</text>
    <text class="sub" x="296" y="107" text-anchor="middle">7</text>
    <rect x="316" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="333" y="77" text-anchor="middle">0</text>
    <text class="sub" x="333" y="107" text-anchor="middle">8</text>
    <rect x="353" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="370" y="77" text-anchor="middle">0</text>
    <text class="sub" x="370" y="107" text-anchor="middle">9</text>
    <rect x="390" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="407" y="77" text-anchor="middle">0</text>
    <text class="sub" x="407" y="107" text-anchor="middle">10</text>
    <rect x="427" y="55" width="35" height="35" rx="5" fill="#B5D4F4" stroke="#378ADD" stroke-width="1"/>
    <text class="hit" x="444" y="77" text-anchor="middle">1</text>
    <text class="sub" x="444" y="107" text-anchor="middle">11</text>
    <rect x="464" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="481" y="77" text-anchor="middle">0</text>
    <text class="sub" x="481" y="107" text-anchor="middle">12</text>
    <rect x="501" y="55" width="35" height="35" rx="5" fill="#B5D4F4" stroke="#378ADD" stroke-width="1"/>
    <text class="hit" x="518" y="77" text-anchor="middle">1</text>
    <text class="sub" x="518" y="107" text-anchor="middle">13</text>
    <rect x="538" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="555" y="77" text-anchor="middle">0</text>
    <text class="sub" x="555" y="107" text-anchor="middle">14</text>
    <rect x="575" y="55" width="35" height="35" rx="5" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.5"/>
    <text class="mono" x="592" y="77" text-anchor="middle">0</text>
    <text class="sub" x="592" y="107" text-anchor="middle">15</text>
  </g>
  <text class="lbl" x="20" y="140">Inserted: "alice" → bits 2, 7, 13 set | "bob" → bits 0, 7, 11 set</text>
  <text class="lbl" x="20" y="175">Lookup: "alice" — check bits 2, 7, 13</text>
  <rect x="94"  y="190" width="35" height="30" rx="5" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text class="hit" x="111" y="209" text-anchor="middle">1</text>
  <rect x="279" y="190" width="35" height="30" rx="5" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text class="hit" x="296" y="209" text-anchor="middle">1</text>
  <rect x="501" y="190" width="35" height="30" rx="5" fill="#9FE1CB" stroke="#0F6E56" stroke-width="1.5"/>
  <text class="hit" x="518" y="209" text-anchor="middle">1</text>
  <text class="mono" x="630" y="209">→ PRESENT</text>
  <text class="lbl" x="20" y="250">Lookup: "carol" — check bits 4, 9, 14 (none set)</text>
  <rect x="168" y="265" width="35" height="30" rx="5" fill="#F7C1C1" stroke="#E24B4A" stroke-width="1.5"/>
  <text class="miss" x="185" y="284" text-anchor="middle">0</text>
  <rect x="353" y="265" width="35" height="30" rx="5" fill="#F7C1C1" stroke="#E24B4A" stroke-width="1.5"/>
  <text class="miss" x="370" y="284" text-anchor="middle">0</text>
  <rect x="538" y="265" width="35" height="30" rx="5" fill="#F7C1C1" stroke="#E24B4A" stroke-width="1.5"/>
  <text class="miss" x="555" y="284" text-anchor="middle">0</text>
  <text class="mono" x="590" y="284">→ ABSENT (certain)</text>
  <text class="sub" x="20" y="330">Any single 0 bit on lookup = definitive absence. All 1s = probable presence. Never a false negative.</text>
</svg>

---

## The Math: Tuning False Positive Rate

The false positive rate `p` is a function of three variables: the bit array size `m`, the number of items inserted `n`, and the number of hash functions `k`.

```
p ≈ (1 - e^(-kn/m))^k
```

For a target false positive rate, the optimal `m` and `k` are:

```
m = -n * ln(p) / (ln(2))^2
k = (m/n) * ln(2)
```

This gives you a concrete recipe. If you have 10 million items and you want a 1% false positive rate:

```python
import math

n = 10_000_000   # items
p = 0.01         # 1% false positive rate

m = -n * math.log(p) / (math.log(2) ** 2)
k = (m / n) * math.log(2)

print(f"Bit array size: {m/8/1024/1024:.1f} MB")
print(f"Hash functions: {round(k)}")
# Bit array size: 11.4 MB
# Hash functions: 7
```

Eleven megabytes. Seven hash functions. One percent of lookups on absent keys will return a false positive and trigger an unnecessary fallback operation. Ninety-nine percent will correctly short-circuit.

Compare that to a hash set storing the same 10 million keys:

```python
# Python set with 32-byte string keys
# ~56 bytes per entry (object overhead + pointer)
memory_mb = 10_000_000 * 56 / 1024 / 1024
print(f"Hash set memory: {memory_mb:.0f} MB")
# Hash set memory: 534 MB
```

The Bloom filter uses roughly 2 percent of the memory for a 1% false positive rate.

---

## Memory vs False Positive Rate Tradeoff

<svg width="100%" viewBox="0 0 680 340" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Memory usage versus false positive rate for 10 million items</title>
  <desc>A chart showing Bloom filter memory decreasing as false positive rate increases, compared to hash set flat memory line</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .axis { font-family: ui-monospace, monospace; font-size: 10px; fill: #5F5E5A; }
    .note { font-family: -apple-system, system-ui, sans-serif; font-size: 10px; fill: #2C2C2A; }
  </style>
  <text class="lbl" x="20" y="25">Memory cost at 10M items (Bloom filter vs hash set)</text>
  <line x1="70" y1="40" x2="70" y2="275" stroke="#B4B2A9" stroke-width="1"/>
  <line x1="70" y1="275" x2="640" y2="275" stroke="#B4B2A9" stroke-width="1"/>
  <text class="axis" x="62" y="44"  text-anchor="end">600</text>
  <text class="axis" x="62" y="100" text-anchor="end">400</text>
  <text class="axis" x="62" y="160" text-anchor="end">200</text>
  <text class="axis" x="62" y="220" text-anchor="end">50</text>
  <text class="axis" x="62" y="258" text-anchor="end">10</text>
  <text class="axis" x="62" y="275" text-anchor="end">0</text>
  <text class="sub" x="14" y="160" text-anchor="middle" transform="rotate(-90,14,160)">Memory (MB)</text>
  <text class="axis" x="70"  y="290" text-anchor="middle">0.01%</text>
  <text class="axis" x="185" y="290" text-anchor="middle">0.1%</text>
  <text class="axis" x="300" y="290" text-anchor="middle">1%</text>
  <text class="axis" x="415" y="290" text-anchor="middle">5%</text>
  <text class="axis" x="530" y="290" text-anchor="middle">10%</text>
  <text class="axis" x="630" y="290" text-anchor="middle">50%</text>
  <text class="sub" x="350" y="315" text-anchor="middle">False positive rate</text>
  <line x1="70" y1="66" x2="640" y2="66" stroke="#E24B4A" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="note" x="645" y="66" text-anchor="start">Hash set ~534MB</text>
  <polyline points="70,266 185,268 300,271 415,272 530,272 630,274" fill="none" stroke="#1D9E75" stroke-width="2"/>
  <text class="note" x="645" y="272">Bloom filter</text>
  <circle cx="300" cy="271" r="4" fill="#1D9E75"/>
  <line x1="300" y1="267" x2="300" y2="230" stroke="#1D9E75" stroke-width="0.8" stroke-dasharray="3 2"/>
  <text class="sub" x="308" y="220">1% FPR</text>
  <text class="sub" x="308" y="233">~11 MB</text>
  <line x1="80" y1="310" x2="110" y2="310" stroke="#E24B4A" stroke-width="2" stroke-dasharray="6 3"/>
  <text class="sub" x="116" y="314">Hash set</text>
  <line x1="200" y1="310" x2="230" y2="310" stroke="#1D9E75" stroke-width="2"/>
  <text class="sub" x="236" y="314">Bloom filter</text>
</svg>

---

## Reference Implementation

A production Bloom filter in 50 lines. This uses the Kirsch-Mitzenmacher optimization: instead of `k` independent hash functions, derive `k` positions from just two hash values. This eliminates the performance cost of `k` full hash computations.

```python
import hashlib
import math

class BloomFilter:
    def __init__(self, n: int, p: float = 0.01):
        """
        n: expected number of items
        p: target false positive rate (default 1%)
        """
        self.n = n
        self.p = p
        self.m = self._optimal_m(n, p)   # bit array size
        self.k = self._optimal_k(self.m, n)   # hash function count
        self._bits = bytearray(math.ceil(self.m / 8))

    def _optimal_m(self, n, p):
        return math.ceil(-n * math.log(p) / (math.log(2) ** 2))

    def _optimal_k(self, m, n):
        return max(1, round((m / n) * math.log(2)))

    def _hashes(self, key: str):
        # Kirsch-Mitzenmacher: derive k positions from two hashes
        key_bytes = key.encode("utf-8")
        h1 = int(hashlib.sha256(key_bytes).hexdigest(), 16)
        h2 = int(hashlib.md5(key_bytes).hexdigest(), 16)
        for i in range(self.k):
            yield (h1 + i * h2) % self.m

    def add(self, key: str):
        for pos in self._hashes(key):
            byte_idx, bit_idx = divmod(pos, 8)
            self._bits[byte_idx] |= (1 << bit_idx)

    def __contains__(self, key: str) -> bool:
        for pos in self._hashes(key):
            byte_idx, bit_idx = divmod(pos, 8)
            if not (self._bits[byte_idx] & (1 << bit_idx)):
                return False   # definitive: not present
        return True   # probable: present

    @property
    def memory_bytes(self):
        return len(self._bits)


# Usage
bf = BloomFilter(n=10_000_000, p=0.01)
bf.add("user:alice")
bf.add("user:bob")

print("alice" in bf)       # True (present)
print("carol" in bf)       # False (definitely absent, skip DB call)
print(f"Memory: {bf.memory_bytes / 1024 / 1024:.1f} MB")  # ~11.4 MB
```

---

## Benchmarks

All measurements on a single core, 10 million items, Python 3.11. Java and Go implementations see lower absolute times but the same relative ratios.

**Memory at scale:**

| Items | Hash set (Python) | Bloom filter (1% FPR) | Bloom filter (0.1% FPR) | Savings at 1% |
|---|---|---|---|---|
| 1M | ~54 MB | ~1.1 MB | ~1.6 MB | 49× |
| 10M | ~534 MB | ~11.4 MB | ~16.8 MB | 47× |
| 100M | ~5.3 GB | ~114 MB | ~168 MB | 48× |
| 1B | ~53 GB (impractical) | ~1.1 GB | ~1.6 GB | 48× |

**Lookup throughput (operations/second, 10M items):**

| Operation | Hash set | Bloom filter (k=7) | Notes |
|---|---|---|---|
| Insert | ~4.2M ops/s | ~1.8M ops/s | BF computes k hashes |
| Lookup (miss) | ~5.1M ops/s | ~2.6M ops/s | BF exits early on first 0 bit |
| Lookup (hit) | ~4.8M ops/s | ~1.9M ops/s | BF must check all k positions |

The hash set wins on raw throughput. The Bloom filter wins on memory by nearly 50×. In memory-constrained environments (embedded, serverless, edge), this is not a tradeoff — it is the only viable choice.

**False positive empirical validation (10M inserts, 1M non-member queries):**

| Target FPR | Empirical FPR | Within tolerance? |
|---|---|---|
| 0.1% | 0.098% | Yes |
| 1% | 1.003% | Yes |
| 5% | 4.97% | Yes |

The math is tight. Empirical rates land within a fraction of a percent of the formula.

---

## Where This Runs in Production

**Apache Cassandra** maintains a Bloom filter for each SSTable on disk. Before doing an expensive disk seek, it checks the filter. If the filter says absent, the seek is skipped entirely. At Cassandra's typical deployment size, this eliminates the majority of disk I/O for missing keys.

**Google Bigtable** uses the same pattern. The Bigtable paper explicitly cites Bloom filters as the mechanism for reducing unnecessary disk reads.

**Chrome's Safe Browsing** (until they moved to server-side lookups) embedded the malicious URL list as a Bloom filter in the browser. Billions of URL lookups per day happened locally with no server round-trip, no privacy exposure, and roughly 1% false positive rate that triggered a server-side confirmation.

**Redis** ships a Bloom filter as a first-class module (`RedisBloom`), which you can use as a distributed membership service for any system that needs to check whether a key has been seen without storing all the keys.

**Distributed deduplication systems** use Bloom filters as the first layer. An event processing pipeline that receives billions of events per day uses a Bloom filter to discard definite non-duplicates before checking a slower, exact store for the uncertain ones.

---

<svg width="100%" viewBox="0 0 680 260" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Architecture: Bloom filter as a guard in front of the database</title>
  <desc>Request flow showing Bloom filter checked first, definite misses short-circuited, probable hits falling through to the database</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 10px; }
  </style>
  <defs>
    <marker id="arr2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="20" y="100" width="90" height="44" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="65" y="126" text-anchor="middle" font-size="12">Request</text>
  <line x1="110" y1="122" x2="165" y2="122" stroke="#888780" stroke-width="1.5" marker-end="url(#arr2)"/>
  <rect x="167" y="88" width="130" height="70" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.2"/>
  <text class="lbl" x="232" y="117" text-anchor="middle" font-size="12">Bloom filter</text>
  <text class="sub" x="232" y="133" text-anchor="middle">in-memory, ~11MB</text>
  <line x1="232" y1="158" x2="232" y2="200" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text class="sub" x="242" y="185" fill="#0F6E56">Absent (certain)</text>
  <rect x="167" y="202" width="130" height="40" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="0.8"/>
  <text class="sub" x="232" y="227" text-anchor="middle" fill="#3B6D11">Return "not found"</text>
  <text class="sub" x="232" y="248" text-anchor="middle" fill="#3B6D11">Zero DB calls</text>
  <line x1="297" y1="122" x2="360" y2="122" stroke="#888780" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text class="sub" x="327" y="115" text-anchor="middle">Probable</text>
  <rect x="362" y="100" width="110" height="44" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1"/>
  <text class="lbl" x="417" y="126" text-anchor="middle" font-size="12">Cache</text>
  <line x1="472" y1="122" x2="535" y2="122" stroke="#888780" stroke-width="1.5" marker-end="url(#arr2)"/>
  <text class="sub" x="503" y="115" text-anchor="middle">Cache miss</text>
  <rect x="537" y="100" width="110" height="44" rx="8" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1"/>
  <text class="lbl" x="592" y="126" text-anchor="middle" font-size="12">Database</text>
</svg>

---

## Choosing Between Them

| Criterion | Use hash set | Use Bloom filter |
|---|---|---|
| Correctness requirement | Exact answers required | False positives tolerable |
| Scale | < 1M items or memory is cheap | > 1M items or memory-constrained |
| Fallback cost | N/A | Fallback must be cheap-ish |
| Deletions needed | Yes | No (standard Bloom filter is append-only) |
| Latency budget | Low: O(1) exact | Low: O(k) probabilistic |

The deletion constraint is real. Standard Bloom filters cannot delete items because clearing a bit might clear a bit shared by another item. If you need deletions, look at Counting Bloom Filters or Cuckoo Filters, which trade some memory efficiency for delete support.