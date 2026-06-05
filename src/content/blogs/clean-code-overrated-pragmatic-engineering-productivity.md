---
title: "Clean Code" Is Killing Your Productivity and Your Team Doesn't Know It
date: 2025-10-15
tags: [clean code, software engineering, pragmatism, developer productivity, technical debt, code quality]
metaDescription: Clean Code is treated as sacred in software engineering. But the cult of clean code is quietly destroying team velocity — here's the case for pragmatic engineering instead.
readTime: 9
type: hot-take
excerpt: Clean Code by Robert Martin has sold millions of copies. It's also responsible for some of the most over-engineered, slow-to-ship codebases I've ever seen. Here's the case for pragmatic engineering over clean code orthodoxy.
---

Clean Code by Robert Martin has sold millions of copies. It's assigned reading at bootcamps. It's the reference engineers cite in code reviews when they reject a PR.

It's also responsible for some of the most over-engineered, slow-to-ship codebases I've ever seen.

I'll say the quiet part out loud: **clean code orthodoxy is a productivity killer dressed up as professionalism.**

## What the Cult Looks Like in Practice

When a team internalises clean code rules as moral imperatives rather than engineering tradeoffs, you get:

- Three-hour PR reviews debating variable names while a bug is in production
- Interfaces and abstract classes wrapping three lines of logic "for extensibility"
- Refactors that make code more "readable" but introduce new failure modes
- Engineers who feel morally superior for catching an impure function, while the feature ships two weeks late

Here's the pattern I've watched play out in real teams:

```typescript
// What the clean code zealot writes:
// "Every function should do one thing"
// "Abstractions prevent duplication"
// "Functions should be < 10 lines"

interface DataTransformer<T, R> {
  transform(input: T): R;
}

class OrderItemPriceExtractor implements DataTransformer<OrderItem, number> {
  transform(item: OrderItem): number {
    return this.extractPrice(item);
  }
  private extractPrice(item: OrderItem): number {
    return item.price;
  }
}

class OrderSubtotalCalculator {
  constructor(private readonly extractor: DataTransformer<OrderItem, number>) {}
  calculate(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + this.extractor.transform(item), 0);
  }
}

// What a pragmatic engineer writes:
function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

The second version is objectively better. It's shorter, has zero indirection, is trivially testable, and does exactly what the name says. The first version is an architecture astronaut's flex.

## The Actual Purpose of Code

The purpose of code is to solve problems reliably and allow future change. That's it.

Sometimes the cleanest solution to a problem is a 200-line function with clear comments and no abstraction. Sometimes a "dirty" hack is the right call because:

- It ships today and gets replaced in the next sprint
- The alternative is two days of refactoring to support a use case that may never come
- The dirty version is actually easier to understand without context

Pragmatic engineering means asking: **what is the actual cost of this decision?** Not "does this violate the single responsibility principle?"

The costs that actually matter:

| | Decision: add abstraction layer |
|---|---|
| Real cost | +2 files, +40 lines, 1 more indirection hop future readers need to trace through |
| Actual benefit | Reduces duplication IF this is called from 3+ places (which it isn't yet) |
| Verdict | Skip it. If the duplication actually appears, refactor then with real information. |

## The Engineers I Respect

The engineers I respect most can write beautiful, clean code — and also write fast, ugly, working code when the situation calls for it. They know the difference.

The clean code cultists don't. For them, every function is an opportunity to demonstrate adherence to the doctrine. That's not engineering. It's performance.

> Ship something that works. Refactor when the pain justifies the cost. Not before.

The code review that catches a real bug is worth ten code reviews that debate naming conventions.


clean-code-overrated-pragmatic-engineering-productivity.md