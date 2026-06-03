---
title: Stop Using TypeScript Like It's JavaScript With Spellcheck
date: 2025-08-25
tags: [TypeScript, JavaScript, type safety, software engineering, web development, developer tools, best practices]
metaDescription: Most developers are using TypeScript wrong — treating it as optional documentation rather than a structural tool. Here's what real TypeScript usage looks like and why it matters.
readTime: 11
type: hot-take
excerpt: The 'any' type is a lie you tell TypeScript so it stops asking questions. Every codebase I've walked into that claimed to be "written in TypeScript" has had the same anti-patterns. Here's what TypeScript looks like when used as an architecture tool.
---

The `any` type is a lie you tell TypeScript so it stops asking questions.

Every codebase I've walked into that claimed to be "written in TypeScript" has had the same pattern: `any` scattered through the API boundary, `@ts-ignore` comments on anything complex, and type definitions that are technically correct but structurally useless.

That's not TypeScript. That's JavaScript with extra steps and a false sense of safety.

## The Actual Value of TypeScript

TypeScript's value is not catching typos. It's **making impossible states unrepresentable**.

Design your data model so that a whole class of bugs cannot exist by construction — not because you tested for them, not because you remembered to check, but because the compiler will not build a program that makes them possible.

The difference between TypeScript as spellcheck and TypeScript as architecture tool:

```typescript
// Spellcheck TypeScript — the anti-pattern
function processPayment(data: any) {
  // TypeScript has no idea what 'data' is.
  // You get autocomplete on 'data.' but it lies.
  // Runtime errors are exactly as likely as in plain JS.
  return data.transactionId; // silently undefined if failed
}

// Architecture TypeScript — making impossible states unrepresentable
type PaymentResult =
  | { status: "success"; transactionId: string; settledAt: Date }
  | { status: "failed"; reason: "insufficient_funds" | "card_expired" | "fraud_hold" }
  | { status: "pending"; estimatedSettlement: Date; reference: string };

function processPayment(payload: ValidatedPaymentPayload): Promise<PaymentResult> {
  // The return type is a discriminated union.
  // The caller CANNOT access transactionId without first checking status === "success".
  // The compiler enforces this. No runtime check needed.
}

// Calling code is forced to handle all cases:
const result = await processPayment(payload);

if (result.status === "success") {
  console.log(result.transactionId); // ✓ valid
} else if (result.status === "failed") {
  handleFailure(result.reason);      // ✓ reason is narrowed
} else {
  scheduleRetry(result.reference);   // ✓ reference is available
}

// result.transactionId outside the success branch → compile error
// That's the point.
```

## Patterns That Actually Use the Type System

### Branded Types for Domain Primitives

```typescript
// Without branded types: string is string — IDs are interchangeable
function assignOrderToUser(orderId: string, userId: string): void { ... }
assignOrderToUser(userId, orderId); // wrong order, TypeScript doesn't care

// With branded types: structurally incompatible
type OrderId = string & { readonly __brand: "OrderId" };
type UserId  = string & { readonly __brand: "UserId" };

function createOrderId(raw: string): OrderId { return raw as OrderId; }
function createUserId(raw: string): UserId   { return raw as UserId; }

function assignOrderToUser(orderId: OrderId, userId: UserId): void { ... }

const oid = createOrderId("ord_123");
const uid = createUserId("usr_456");

assignOrderToUser(uid, oid); // ← compile error: argument types are incompatible
assignOrderToUser(oid, uid); // ✓ correct
```

### Exhaustive Union Handling

```typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "rect"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":   return Math.PI * shape.radius ** 2;
    case "rect":     return shape.width * shape.height;
    case "triangle": return 0.5 * shape.base * shape.height;
    default:
      // The never check: if a new shape is added to the union
      // and this function isn't updated, this line causes a compile error.
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

When a new `Shape` variant is added, every `switch` with the exhaustive check breaks at compile time. Not at runtime. Not in QA. At compile time, on the engineer who added the new variant.

### State Machines as Types

```typescript
// An HTTP request can't be both loading and error simultaneously.
// Encode this constraint in the type.

type RequestState<T> =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; data: T; fetchedAt: Date }
  | { phase: "error"; message: string; retryable: boolean };

// The UI component can only access data when phase === "success".
// There's no way to accidentally render undefined data.
function renderUser(state: RequestState<User>): JSX.Element {
  if (state.phase === "loading") return <Spinner />;
  if (state.phase === "error")   return <ErrorMessage msg={state.message} />;
  if (state.phase === "idle")    return <EmptyState />;
  // TypeScript now knows state.data exists and is User
  return <UserCard user={state.data} />;
}
```

## Why This Matters in Teams

When a new engineer touches the payment flow six months from now, the types are the documentation that doesn't go stale. The compiler is the reviewer that never gets busy.

A type annotation that documents intent is valuable. A type annotation that **enforces** intent structurally is irreplaceable.

The engineers who complain that TypeScript is slow and annoying are the ones using it as spellcheck. The engineers who structure their domain types first and let the implementation follow — they find that TypeScript eliminates an entire class of bugs before QA ever runs.

> Use the type system. Actually use it.
