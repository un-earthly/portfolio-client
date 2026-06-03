---
title: I Built a Multi-Agent AI System That Runs My Business While I Sleep
date: 2025-10-05
tags: [AI agents, multi-agent systems, LLM, automation, local AI, Ollama, Telegram, software engineering]
metaDescription: How I built a four-agent AI system using local LLMs (Ollama), Telegram, and a kanban board to automate business operations — without spending a dollar on API calls.
readTime: 16
type: technical
excerpt: I run a small incense brand alongside my engineering work. I don't have time to be the operator. So I built agents to do it — a four-agent system on local LLMs with zero cloud AI cost, running on my own hardware.
---

I run a small incense brand called Insencetic alongside my engineering work. I don't have time to be the operator. So I built agents to do it.

This isn't a tutorial about GPT wrappers. This is about building a real multi-agent system with local LLMs, persistent state, and actual task delegation — running on my own hardware, zero cloud AI costs.

## The Stack

**Hardware:** Home Ubuntu server (Ryzen 5700G APU, 24GB unified RAM) running Ollama with `qwen3:14b` as the primary reasoning model and `gemma4:e4b` for lightweight content tasks.

**Infrastructure:**

```
┌─────────────────────────────────────────────────────────┐
│                   Agent Orchestration                    │
│                                                         │
│  Telegram ──► CEO Agent ──► PM Agent ──► Planka (board) │
│                                  │                      │
│                          ┌───────┴────────┐             │
│                     Marketing          Content          │
│                      Agent              Agent           │
│                          │                │             │
│                    Planka cards    Planka cards          │
│                    (marketing)     (content)             │
│                                                         │
│  All agents read/write Planka as shared state           │
│  No shared context windows — state flows through cards  │
└─────────────────────────────────────────────────────────┘
```

- **OpenClaw** — multi-agent orchestration framework handling agent lifecycle and routing
- **Planka** — self-hosted kanban (open-source Trello equivalent) as the shared state layer
- **Telegram** — the human interface (I send goals, receive qualified updates)
- **Ollama** — local LLM inference, no API keys, no data leaving the server
- **SearXNG** — self-hosted meta-search for real-time data access

## The Agent Architecture

Four agents. Strict role separation. Role leakage — where one agent starts doing another's job — is the primary failure mode in multi-agent systems.

### CEO Agent

Receives high-level goals via Telegram, reviews the Planka board state, delegates to the PM in natural language. Does **not** create cards. This boundary matters: a CEO agent that writes directly to the kanban collapses the hierarchy. The purpose of the CEO layer is goal interpretation and priority assignment, not execution planning.

```python
class CEOAgent:
    system_prompt = """
    You are the CEO of Insencetic, a boutique incense brand with three product lines:
    Noir (dark/woody), Bloom (floral/light), Ember (resin/incense-forward).

    Your role:
    - Receive strategic goals from the human operator
    - Review the current Planka board state
    - Delegate ONE clear objective to the PM agent per session
    - Never create cards yourself
    - Always frame delegation as business outcomes, not tasks

    Current board state will be provided as JSON.
    Respond with a single structured delegation message.
    """

    async def delegate(self, human_goal: str, board_state: BoardState) -> Delegation:
        context = f"""
        Goal from operator: {human_goal}
        Current sprint: {board_state.active_sprint}
        In-progress: {board_state.in_progress_count} cards
        Blocked: {board_state.blocked_count} cards
        """
        response = await ollama.chat(
            model="qwen3:14b",
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": context}
            ]
        )
        return parse_delegation(response["message"]["content"])
```

### PM Agent

Owns all card creation on Planka. Takes CEO delegation, breaks every objective into three or more concrete tasks, assigns to the right agent, sets due dates. The PM agent is the most heavily prompted — it must enforce the rule that vague goals produce concrete, atomic, assignable cards.

```python
CARD_SCHEMA = {
    "title": str,           # max 80 chars, action-oriented
    "assignee": Literal["marketing", "content", "ceo"],
    "due_date": str,        # ISO 8601
    "context": str,         # what the assignee needs to execute
    "success_criteria": str # how we know this card is done
}

class PMAgent:
    async def create_cards(self, delegation: Delegation) -> list[Card]:
        prompt = f"""
        Delegation from CEO: {delegation.objective}
        Business context: {delegation.context}

        Break this into 3-5 atomic tasks. Each task must be:
        - Completable in under 2 hours
        - Assigned to exactly one agent (marketing or content)
        - Have measurable success criteria

        Return a JSON array matching this schema:
        {json.dumps(CARD_SCHEMA, indent=2)}
        """
        raw = await ollama.chat(model="qwen3:14b", messages=[
            {"role": "user", "content": prompt}
        ])
        cards = json.loads(extract_json(raw["message"]["content"]))
        return [self.planka.create_card(**card) for card in cards]
```

### Marketing and Content Agents

These are the execution layer. They poll their Planka queues, pick up cards in `To Do` state, execute, and move cards to `Done`. The key design choice: they write output to **files**, not back to Planka. The operator (me) does the final review before anything goes live.

```python
class ContentAgent:
    async def process_card(self, card: Card) -> None:
        prompt = f"""
        Task: {card.title}
        Context: {card.context}
        Success criteria: {card.success_criteria}

        Write the content. Be specific to Insencetic's voice:
        sophisticated, sensory-focused, never corporate.
        """
        content = await ollama.chat(model="gemma4:e4b",  # lighter model for content
            messages=[{"role": "user", "content": prompt}])

        # Write to review queue, never directly to publish
        output_path = f"./review_queue/{card.id}_{slugify(card.title)}.md"
        with open(output_path, "w") as f:
            f.write(content["message"]["content"])

        self.planka.move_card(card.id, "Pending Review")
        self.telegram.notify(f"Content ready for review: {card.title}")
```

## The Key Design Decisions

### Planka as Shared Memory

Agents don't share context windows. They share state through the kanban board. This solves the fundamental multi-agent coordination problem: how do agents know what other agents are doing without coupling their prompts?

Each Planka card is a unit of work with:
- Assignee (which agent owns it)
- Status (`To Do` → `In Progress` → `Pending Review` → `Done`)
- Context field (everything the assigned agent needs to execute)
- Comments (agent execution logs and output paths)

An agent picking up a card reads exactly what it needs. No prompt pollution from other agents' work. No shared memory race conditions.

### Instant-Send Routing

Earlier versions batched Telegram notifications to reduce noise. It created lag and made the system feel unresponsive. I switched to instant-send with dual destinations:

- Qualified signals (content ready, blocking issue, cost threshold hit) → my DM
- Everything else (routine status updates, card movements) → a dump channel I review weekly

The routing logic is a simple classifier prompt on the notification text. False positives in DM are acceptable; false negatives (missing a blocking issue) are not. The classifier is biased toward over-notifying.

### Local LLMs for Privacy and Cost

Everything runs on my own hardware. No data leaves the server. No API bill.

`qwen3:14b` at Q4_K_M quantization fits in ~9GB RAM with the APU's unified memory. Response latency is ~3-8 seconds per call. For background automation, that's fine. The model handles complex delegation and planning well.

`gemma4:e4b` (4-bit) handles content drafts and marketing copy. Faster, lighter, adequate for creative tasks with a strong system prompt.

## What Actually Works (And What Doesn't)

Works well:
- Structured delegation chains: high-level goal → concrete cards → filed output
- Content drafts: 70-80% usable with one pass of human editing
- Status tracking: the kanban board is always an accurate picture of active work

Still rough:
- Real-time data requiring freshness (solved partially with SearXNG integration for search)
- Multi-step reasoning where `qwen3:14b` drifts from the original constraint
- Anything requiring brand voice calibration beyond what fits in a system prompt

## The Honest Outcome

I removed myself as the bottleneck for operational tasks. The agents handle the pipeline from goal to reviewable output. I do final review, not first draft. For a side business running alongside a full-time engineering role, that's the difference between active and dormant.

The architectural lesson: the value of a multi-agent system is not that agents are smart. It's that you've encoded a process — with roles, contracts, and state — that runs without your attention. The intelligence is in the design of the process, not the LLM.

That's the real value proposition of agentic systems — not replacing human judgment, but eliminating the busywork that sits in front of it.

---

I'm currently taking on a small number of contract engagements. If you're building agentic systems, need AI integrated into an existing product, or want to explore what local LLMs can do for your workflow — [get in touch](/contact). I work well with technical founders and engineering leads who want a practitioner, not a consultant who demos ChatGPT.
