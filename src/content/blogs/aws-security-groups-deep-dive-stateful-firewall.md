---
title: "Security Groups Explained: The Firewall Rule That Outlives Every Project"
date: 2026-07-04
tags: [AWS, security groups, stateful firewall, connection tracking, VPC, NACL, cloud security, DevOps, infrastructure]
metaDescription: A complete technical deep dive into AWS security groups: stateful vs stateless filtering, connection tracking, rule anatomy, security groups vs NACLs, real production configurations, audit commands, and why misconfigured rules survive project handoffs.
readTime: 14
type: technical
excerpt: A security group is a stateful firewall attached to your instance's network interface. This is a complete breakdown: what it is, why it works the way it does, how packet evaluation actually happens, real production examples, and the delivery handoff pattern that turns a temporary rule into a breach.
cover: '/blog-covers/aws-security-groups-deep-dive-stateful-firewall.svg'
tldr: "A security group is a stateful, allow-only virtual firewall attached to a network interface, not an instance or subnet. It tracks connections, so allowing inbound traffic automatically allows the matching reply, and all rules are evaluated together with no ordering, so one permissive rule anywhere silently overrides every careful rule beside it. The mechanism is simple. The risk comes from the lifecycle: rules opened under deadline pressure in the console, with no description and no owner, that outlive the project they were opened for."
faqs: If a security group has no deny rules, how do I block a specific malicious IP?::You can't, with a security group alone. Security groups are allow-only. To block a specific CIDR range you need a NACL deny rule at the subnet boundary, which is stateless and evaluated by rule number. | Does deleting a security group rule immediately close an active connection?::No. Connection tracking means an already-established connection keeps flowing until it closes naturally or the conntrack entry expires. Removing the rule only blocks new connections. To kill a live session you need to terminate the connection itself or use a stateless NACL deny, which applies immediately. | Why does the outbound rule matter if security groups are stateful?::Return traffic bypasses outbound rules automatically, but traffic your instance initiates does not. Tightening outbound rules limits what a compromised instance can reach or exfiltrate to, which is exactly the traffic that matters during an incident. | We're a freelance/agency team shipping infra for clients. What's the actual fix for the handoff problem?::Either leave a handoff document listing every open rule, its reason, and who to contact, or keep a retainer where someone is still watching the account. The twenty-minute audit in this post is the minimum bar before any handoff.
---

> **TL;DR**: A security group is a stateful, allow-only virtual firewall attached to a network interface, not an instance or subnet. It tracks connections, so allowing inbound traffic automatically allows the matching reply, and all rules are evaluated together with no ordering, so one permissive rule anywhere silently overrides every careful rule beside it. The mechanism is simple. The risk comes from the lifecycle: rules opened under deadline pressure in the console, with no description and no owner, that outlive the project they were opened for.

---

## What Is a Security Group, Actually?

The one-line answer: a security group is a virtual, stateful firewall that controls inbound and outbound traffic at the network interface level of your cloud resources.

Every word in that sentence carries weight, so let's break it down.

**Virtual** means there is no firewall appliance. No box, no dedicated software running inside your instance. The filtering happens in the hypervisor layer, outside your operating system. Your Ubuntu server never sees the packets that a security group drops. They're gone before they reach the kernel's network stack. This is why `iptables -L` on your EC2 instance shows you nothing about security group rules. They live in a different layer entirely.

<svg width="100%" viewBox="0 0 680 380" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>The layers a packet crosses before reaching an application</title>
  <desc>A vertical stack showing route table, NACL, security group, OS firewall, and application layers a packet passes through</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
  </style>
  <defs>
    <marker id="arrL" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#888780" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text class="lbl" x="20" y="24">Internet</text>
  <line x1="70" y1="30" x2="70" y2="55" stroke="#888780" stroke-width="1.5" marker-end="url(#arrL)"/>

  <rect x="20" y="58" width="640" height="46" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="40" y="80" font-size="12">Route Table (VPC)</text>
  <text class="sub" x="40" y="97">Which subnet does this go to?</text>
  <line x1="70" y1="104" x2="70" y2="120" stroke="#888780" stroke-width="1.5" marker-end="url(#arrL)"/>

  <rect x="20" y="122" width="640" height="46" rx="8" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1"/>
  <text class="lbl" x="40" y="144" font-size="12">NACL (subnet boundary)</text>
  <text class="sub" x="40" y="161">Stateless. Checks both directions.</text>
  <line x1="70" y1="168" x2="70" y2="184" stroke="#888780" stroke-width="1.5" marker-end="url(#arrL)"/>

  <rect x="20" y="186" width="640" height="46" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.4"/>
  <text class="lbl" x="40" y="208" font-size="12">Security Group (ENI)</text>
  <text class="sub" x="40" y="225">Stateful. This post.</text>
  <line x1="70" y1="232" x2="70" y2="248" stroke="#888780" stroke-width="1.5" marker-end="url(#arrL)"/>

  <rect x="20" y="250" width="640" height="46" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1"/>
  <text class="lbl" x="40" y="272" font-size="12">OS firewall (iptables / nftables / ufw)</text>
  <text class="sub" x="40" y="289">Inside your instance. Most teams never configure this.</text>
  <line x1="70" y1="296" x2="70" y2="312" stroke="#888780" stroke-width="1.5" marker-end="url(#arrL)"/>

  <rect x="20" y="314" width="640" height="46" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="lbl" x="40" y="342" font-size="12">Your application (:3000)</text>
</svg>

**Stateful** is the most important word and the most misunderstood. It means the security group tracks connections, not just packets. If an inbound rule allows traffic in, the response traffic is automatically allowed out, regardless of what your outbound rules say. We'll go deep on this in the How section, because connection tracking is the mechanism that makes security groups feel "magic" until the day it surprises you.

**Network interface level** means the rules attach to the ENI (Elastic Network Interface), not to the instance, not to the subnet. One instance can have multiple ENIs with different security groups. One security group can be attached to hundreds of ENIs. This attachment model is why a single sloppy rule can expose an entire fleet.

### Anatomy of a Rule

A security group rule has exactly four meaningful parts:

| Type | Protocol | Port Range | Source |
|---|---|---|---|
| SSH | TCP | 22 | `203.0.113.42/32` — one IP |
| HTTPS | TCP | 443 | `0.0.0.0/0` — the internet |
| Custom | TCP | 5432 | `sg-0abc123def` — another security group |

That third row is the feature most people underuse: **the source can be another security group.** Instead of saying "allow Postgres from IP 10.0.1.5," you say "allow Postgres from anything wearing the `api-server` security group." Instances come and go, IPs change, autoscaling spins up new machines, and the rule keeps working because it references identity, not address. This one feature is the difference between security groups that rot and security groups that scale.

Two structural facts complete the picture:

1. **Security groups are allow-only.** There are no deny rules. Everything is denied by default, and rules only ever punch holes. This means the risk surface is exactly the sum of your rules. You cannot accidentally deny legitimate traffic with a bad rule, but every rule you add is a door.
2. **All rules are evaluated together.** There's no ordering, no priority, no "first match wins." If any rule allows the packet, the packet passes. This is radically different from iptables or NACLs, and it means a permissive rule anywhere in the group silently overrides every careful narrow rule beside it.

That second point is where audits go wrong:

<svg width="100%" viewBox="0 0 680 300" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>All rules in a security group are evaluated together, any match allows the packet</title>
  <desc>Three rules on the api-prod security group, an SSH packet from an unknown external IP matches only the permissive rule 3 and is allowed through</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
    .allow { font-family: ui-monospace, monospace; font-size: 11px; fill: #A32D2D; font-weight: 700; }
  </style>
  <defs>
    <marker id="arrR" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#888780" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text class="lbl" x="20" y="24">Security group: api-prod</text>
  <rect x="20" y="38" width="300" height="34" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="0.8"/>
  <text class="mono" x="34" y="60">Rule 1: TCP 22 from 10.0.0.0/16 (internal)</text>
  <rect x="20" y="78" width="300" height="34" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="0.8"/>
  <text class="mono" x="34" y="100">Rule 2: TCP 443 from 0.0.0.0/0 (web API)</text>
  <rect x="20" y="118" width="300" height="34" rx="6" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.2"/>
  <text class="mono" x="34" y="140">Rule 3: TCP 22 from 0.0.0.0/0 (added March)</text>

  <text class="sub" x="360" y="30">Packet: SSH from 185.220.x.x (unknown, external)</text>
  <line x1="450" y1="40" x2="180" y2="72" stroke="#B4B2A9" stroke-width="1.2"/>
  <text class="sub" x="130" y="60" text-anchor="middle">no match</text>
  <line x1="450" y1="40" x2="180" y2="112" stroke="#B4B2A9" stroke-width="1.2"/>
  <text class="sub" x="130" y="100" text-anchor="middle">no match</text>
  <line x1="450" y1="40" x2="180" y2="152" stroke="#E24B4A" stroke-width="2" marker-end="url(#arrR)"/>
  <text class="allow" x="330" y="112" text-anchor="middle">MATCH → ALLOW</text>

  <line x1="170" y1="152" x2="170" y2="210" stroke="#E24B4A" stroke-width="2" marker-end="url(#arrR)"/>
  <rect x="60" y="212" width="220" height="40" rx="8" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.2"/>
  <text class="lbl" x="170" y="237" text-anchor="middle" font-size="12">Packet reaches sshd</text>
  <text class="sub" x="20" y="280">Rule 1 looks responsible. Rule 3 makes Rule 1 decorative.</text>
</svg>

Rule 1 looks responsible. Rule 3 makes Rule 1 decorative. This is why "we have a restricted SSH rule" means nothing until you've read every rule in the group.

---

## Why Do Security Groups Work This Way?

Three design decisions define security groups, and each one exists for a reason worth understanding.

### Why stateful?

Before stateful firewalls, admins had to write rules for both directions of every conversation. Allow inbound TCP 443, and also allow outbound TCP from port 443 to ephemeral ports 1024-65535, because that's where the client's response goes. Get the ephemeral range wrong and connections mysteriously hang. Multiply that by every service and the ruleset becomes unmaintainable, which in practice means people open everything.

Stateful filtering solves this with connection tracking: the firewall remembers "instance X accepted a connection from client Y on port 443" and automatically permits the reply traffic for that specific connection. Your ruleset describes intent ("this server serves HTTPS") instead of packet mechanics.

### Why default-deny, allow-only?

Because the alternative fails badly at scale. In a deny-rule system, security depends on rule ordering, and a misordered rule fails open. In an allow-only system, forgetting a rule fails closed: something legitimate breaks, someone notices, someone adds the rule. Annoying, but visible. The failure mode of allow-only is a support ticket. The failure mode of misordered deny rules is a breach nobody sees.

### Why attach to the interface instead of the subnet?

Because workloads move and subnets are geography, not identity. Attaching security to the ENI means the policy travels with the workload. Your database's rules are the database's rules whether it lives in subnet A or gets migrated to subnet B during a re-architecture. It also enables the SG-references-SG pattern from earlier, which is fundamentally an identity-based security model wearing a firewall costume.

### Security Groups vs NACLs

They look similar in the console. They are not similar.

| | Security Group | NACL |
|---|---|---|
| Attaches to | ENI (instance-level) | Subnet boundary |
| State | Stateful | Stateless |
| Rule types | Allow only | Allow and deny |
| Evaluation | All rules together | Numbered order, first match wins |
| Return traffic | Automatic | Needs explicit rule |
| Typical use | Primary control for every workload | Coarse blast-radius limits, IP blocking |

The practical guidance: security groups are your primary tool for everything. NACLs earn their keep in two cases: blocking a known-hostile IP range (security groups can't deny), and enforcing subnet-level guarantees like "nothing in the data subnet talks to the internet, period," as a backstop against a fat-fingered security group. If you're writing per-application NACL rules, you're using the wrong tool.

---

## When Do Security Group Rules Get Created? The Lifecycle Nobody Manages

Here's where this stops being an AWS documentation summary and becomes the actual point of this post.

Every security group rule is born in one of a few moments, and each birth context predicts whether the rule will ever die:

| Born during | Documented? | Ever removed? |
|---|---|---|
| Initial architecture | Usually | N/A (kept) |
| Infrastructure-as-code change | Yes, in the PR | Yes, in the next PR |
| Debugging session | Never | Rarely |
| Deadline crunch | Never | Almost never |
| "Just for the demo" | Never | Never |

The rules created in the top two rows are fine. They live in Terraform or CloudFormation, they have a commit message, they get reviewed, and removing them is a normal code change.

The bottom three rows are where breaches come from. These rules are created in the console, under time pressure, by someone whose actual task is something else. Opening the rule takes thirty seconds. The mental note to close it evaporates the moment the deadline passes.

Now add the delivery handoff. In freelance and agency work, a project has a hard boundary: it ships, the client is happy, the invoice is paid, the team moves on. Every console-created rule from the crunch phase is now orphaned. The people who know why port 6379 is open have moved to the next client. The client's team, if there is one, inherits a security group they didn't write and are afraid to touch, because removing a rule they don't understand might break production.

In-house teams don't avoid this because they're better engineers. They avoid it because they still own the system next quarter. Ownership after delivery is the entire difference. The rule doesn't know the project ended. It keeps doing exactly what it was told, for an audience that was supposed to be temporary, forever.

---

## How It Actually Works: Connection Tracking at the Packet Level

Let's trace real traffic. Your NestJS API runs on an EC2 instance, security group allows inbound TCP 443 from `0.0.0.0/0`. A user in Dhaka opens the app.

<svg width="100%" viewBox="0 0 680 320" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Connection tracking for an inbound HTTPS connection</title>
  <desc>A three-step sequence showing the SYN packet checked against inbound rules, a conntrack entry created, and reply traffic matched against that entry instead of outbound rules</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
    .mono { font-family: ui-monospace, monospace; font-size: 11px; fill: #2C2C2A; }
  </style>
  <defs>
    <marker id="arrC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#378ADD" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <text class="lbl" x="20" y="24">CLIENT 103.4.x.x:51234</text>
  <text class="lbl" x="500" y="24">SERVER :443</text>

  <line x1="180" y1="40" x2="480" y2="40" stroke="#378ADD" stroke-width="2" marker-end="url(#arrC)"/>
  <text class="sub" x="330" y="35" text-anchor="middle">1. SYN</text>
  <rect x="180" y="52" width="300" height="46" rx="6" fill="#E6F1FB" stroke="#378ADD" stroke-width="1"/>
  <text class="mono" x="330" y="70" text-anchor="middle">Inbound rule: TCP 443 from 0.0.0.0/0</text>
  <text class="mono" x="330" y="88" text-anchor="middle">MATCH — conntrack entry created</text>

  <rect x="140" y="110" width="400" height="60" rx="6" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="mono" x="160" y="130">proto=TCP src=103.4.x.x:51234 dst=:443</text>
  <text class="mono" x="160" y="148">state=SYN_SENT → ESTABLISHED</text>

  <line x1="480" y1="190" x2="180" y2="190" stroke="#1D9E75" stroke-width="2" marker-end="url(#arrC)"/>
  <text class="sub" x="330" y="185" text-anchor="middle">2. SYN-ACK (reply)</text>
  <rect x="180" y="200" width="300" height="46" rx="6" fill="#EAF3DE" stroke="#1D9E75" stroke-width="1"/>
  <text class="mono" x="330" y="218" text-anchor="middle">Outbound rules NOT checked</text>
  <text class="mono" x="330" y="236" text-anchor="middle">Matches conntrack entry — pass</text>

  <text class="sub" x="20" y="290">3. All further packets in both directions match the conntrack entry.</text>
  <text class="sub" x="20" y="306">Rules aren't consulted again until the connection closes and the entry expires.</text>
</svg>

Three consequences of this mechanism catch people in production:

**1. Removing a rule doesn't kill live connections.** If an attacker has an established SSH session and you delete the SSH rule, tracked connections may persist until they close. Rule removal stops new connections. For an active incident, you need to kill the connection itself (or use an untracked rule pattern / NACL deny, which is stateless and applies immediately).

**2. Outbound rules matter less than people think, until they matter completely.** Most security groups ship with the default "allow all outbound." Because return traffic bypasses outbound rules anyway, tightening outbound only affects connections your instance initiates. That's exactly the traffic that matters during a compromise: malware phoning home, data exfiltration, a cryptominer pulling its payload. An instance that can only initiate outbound to your database security group and your package mirror is a dramatically worse host for an attacker than one with open egress.

**3. The security group can't save you from what runs inside.** Filtering happens at the ENI. If two processes on the same instance talk over localhost, no security group is involved. If your app is proxied through nginx on the same box, the security group sees only nginx's port.

### Implementation: what good actually looks like

Here's a realistic three-tier setup expressed as Terraform, using the SG-references-SG pattern:

```hcl
resource "aws_security_group" "alb" {
  name   = "alb-prod"
  vpc_id = var.vpc_id

  ingress {
    description = "Public HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # correct: it's a public load balancer
  }
}

resource "aws_security_group" "api" {
  name   = "api-prod"
  vpc_id = var.vpc_id

  ingress {
    description     = "App traffic from ALB only"
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]   # identity, not IP
  }
}

resource "aws_security_group" "db" {
  name   = "db-prod"
  vpc_id = var.vpc_id

  ingress {
    description     = "Postgres from API tier only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }
}
```

<svg width="100%" viewBox="0 0 680 220" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>The trust chain created by security-group-to-security-group references</title>
  <desc>Internet reaches the ALB security group on 443, the ALB security group reaches the API security group on 3000, the API security group reaches the database security group on 5432, no rule references a raw IP</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 13px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
  </style>
  <defs>
    <marker id="arrT" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#888780" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="10" y="80" width="90" height="46" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="55" y="107" text-anchor="middle" font-size="12">Internet</text>
  <line x1="100" y1="103" x2="160" y2="103" stroke="#888780" stroke-width="1.5" marker-end="url(#arrT)"/>
  <text class="sub" x="130" y="95" text-anchor="middle">:443 from anyone</text>

  <rect x="162" y="70" width="120" height="66" rx="8" fill="#E6F1FB" stroke="#378ADD" stroke-width="1.2"/>
  <text class="lbl" x="222" y="98" text-anchor="middle" font-size="12">sg: alb</text>
  <text class="sub" x="222" y="118" text-anchor="middle">:443</text>
  <line x1="284" y1="103" x2="344" y2="103" stroke="#888780" stroke-width="1.5" marker-end="url(#arrT)"/>
  <text class="sub" x="314" y="95" text-anchor="middle">:3000 from alb SG</text>

  <rect x="346" y="70" width="120" height="66" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1.2"/>
  <text class="lbl" x="406" y="98" text-anchor="middle" font-size="12">sg: api</text>
  <text class="sub" x="406" y="118" text-anchor="middle">:3000</text>
  <line x1="468" y1="103" x2="528" y2="103" stroke="#888780" stroke-width="1.5" marker-end="url(#arrT)"/>
  <text class="sub" x="498" y="95" text-anchor="middle">:5432 from api SG</text>

  <rect x="530" y="70" width="120" height="66" rx="8" fill="#FAEEDA" stroke="#BA7517" stroke-width="1.2"/>
  <text class="lbl" x="590" y="98" text-anchor="middle" font-size="12">sg: db</text>
  <text class="sub" x="590" y="118" text-anchor="middle">:5432</text>

  <text class="sub" x="20" y="175">The database has no rule that references an IP address. It cannot be reached from the</text>
  <text class="sub" x="20" y="191">internet even if someone fat-fingers a route table. Autoscaling the API tier requires</text>
  <text class="sub" x="20" y="207">zero security group changes.</text>
</svg>

Notice what's absent: SSH. Modern setups use SSM Session Manager or EC2 Instance Connect, which need no inbound port at all. If you must have SSH, it's `/32` to a bastion or VPN CIDR, never `0.0.0.0/0`, and ideally it's a rule you add for the session and remove after.

Notice also every rule has a `description`. This sounds like bureaucracy until it's the only artifact standing between "opened for the March 3rd load test, safe to remove" and "nobody knows, nobody dares."

---

## Real-Life Examples: How This Fails in Production

**The exposed Redis instance.** A team stands up Redis for a job queue. To let a developer inspect it from their laptop during debugging, someone opens TCP 6379 to `0.0.0.0/0` "for an hour." Redis, by default and by philosophy, ships with no authentication, because it assumes it lives on a trusted network. Internet-wide scanners like Shodan and masscan sweep the entire IPv4 space continuously; an open 6379 is typically discovered within hours, not months. The standard outcome is a cryptominer installed via Redis's own `CONFIG SET` and cron-write tricks. Nothing was "hacked." Every system did exactly what its configuration said.

**The database that outlived its migration.** During a data migration, a contractor adds an inbound rule on the RDS security group: TCP 5432 from their office IP. Reasonable. The migration finishes on a Friday, the contract ends, the rule stays. Two years later the "office IP" belongs to whoever leases that address block now. The client discovers the rule during a SOC 2 audit, where `0.0.0.0/0` or unexplained CIDR rules on database ports are automatic findings, surfacing at the worst possible moment: during their own compliance push, with nobody left who remembers the rule's story.

**The staging environment that became load-bearing.** An agency spins up staging with everything open ("it's just staging") including the app's debug port. Staging quietly starts holding a copy of production data for realistic testing. The environment now has production-grade data with demo-grade perimeter, and it appears in zero security reviews because everyone's mental model still says "it's just staging."

Different projects, same shape: a rule created for a moment, in a system nobody owned after the moment passed.

---

## Auditing: The Twenty-Minute Version

If you've inherited infrastructure, or shipped some and walked away, here is the audit that actually finds problems:

```bash
# 1. Every rule open to the entire internet, with ports
aws ec2 describe-security-groups \
  --filters "Name=ip-permission.cidr,Values=0.0.0.0/0" \
  --query 'SecurityGroups[*].{Name:GroupName,ID:GroupId,Ports:IpPermissions[*].[FromPort,ToPort]}' \
  --output table

# 2. Unattached security groups (dead rules waiting to be reused)
aws ec2 describe-security-groups \
  --query 'SecurityGroups[?length(Tags)==`0`].[GroupId,GroupName]' \
  --output table
# then cross-check attachment:
aws ec2 describe-network-interfaces \
  --query 'NetworkInterfaces[*].Groups[*].GroupId' --output text | tr '\t' '\n' | sort -u

# 3. From inside the instance: what is actually listening?
sudo ss -tlnp
```

Then apply this decision tree to every finding from command 1:

<svg width="100%" viewBox="0 0 680 320" role="img" xmlns="http://www.w3.org/2000/svg">
  <title>Decision tree for a rule open to the entire internet</title>
  <desc>Starting from a rule open to 0.0.0.0/0, check if it is a public web port, then check for a written reason, then check if that reason still holds, ending in keep or close</desc>
  <style>
    .lbl { font-family: -apple-system, system-ui, sans-serif; font-size: 12px; fill: #444441; font-weight: 500; }
    .sub { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; fill: #5F5E5A; }
  </style>
  <defs>
    <marker id="arrD" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M2 1L8 5L2 9" fill="none" stroke="#888780" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </marker>
  </defs>
  <rect x="240" y="8" width="200" height="40" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="340" y="32" text-anchor="middle">Rule open to 0.0.0.0/0</text>

  <line x1="340" y1="48" x2="340" y2="70" stroke="#888780" stroke-width="1.3" marker-end="url(#arrD)"/>
  <rect x="220" y="72" width="240" height="40" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="340" y="96" text-anchor="middle">Public 80/443 on web tier?</text>

  <line x1="270" y1="112" x2="140" y2="150" stroke="#639922" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="150" y="135">yes</text>
  <rect x="60" y="152" width="140" height="34" rx="8" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="lbl" x="130" y="174" text-anchor="middle">Fine.</text>

  <line x1="410" y1="112" x2="500" y2="150" stroke="#888780" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="500" y="135">no</text>
  <rect x="380" y="152" width="260" height="40" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="510" y="176" text-anchor="middle">Written reason (description/IaC/ticket)?</text>

  <line x1="450" y1="192" x2="380" y2="230" stroke="#888780" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="390" y="215">yes</text>
  <rect x="300" y="232" width="200" height="40" rx="8" fill="#F1EFE8" stroke="#B4B2A9" stroke-width="0.8"/>
  <text class="lbl" x="400" y="256" text-anchor="middle">Is the reason still true?</text>

  <line x1="330" y1="272" x2="270" y2="300" stroke="#639922" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="270" y="292" text-anchor="middle">yes</text>
  <rect x="200" y="296" width="150" height="20" rx="6" fill="#EAF3DE" stroke="#639922" stroke-width="1"/>
  <text class="sub" x="275" y="310" text-anchor="middle">Keep, set review date</text>

  <line x1="460" y1="272" x2="520" y2="300" stroke="#E24B4A" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="520" y="292" text-anchor="middle">no</text>
  <rect x="470" y="296" width="120" height="20" rx="6" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1"/>
  <text class="sub" x="530" y="310" text-anchor="middle">Close it</text>

  <line x1="570" y1="192" x2="620" y2="230" stroke="#E24B4A" stroke-width="1.3" marker-end="url(#arrD)"/>
  <text class="sub" x="620" y="215" text-anchor="middle">no</text>
  <rect x="530" y="232" width="140" height="40" rx="8" fill="#FCEBEB" stroke="#E24B4A" stroke-width="1.2"/>
  <text class="lbl" x="600" y="250" text-anchor="middle" font-size="11">CLOSE IT TODAY</text>
  <text class="sub" x="600" y="264" text-anchor="middle" font-size="10">undocumented + open</text>
</svg>

The rule of thumb underneath the tree: **a rule with no story defaults to closed.** If closing it breaks something, you'll find out fast, loudly, and fixably. If leaving it open goes wrong, you find out slowly, silently, and expensively.

AWS also gives you two free force multipliers here: **VPC Flow Logs** tell you whether a suspicious rule is even carrying traffic (a world-open port with zero flow log hits in 90 days is safe to close), and **AWS Config** rules like `restricted-ssh` and `restricted-common-ports` will flag world-open management ports continuously so this audit isn't a one-time heroic effort.

---

## The Takeaway

Security groups are simple machines: stateful, allow-only, identity-capable, attached to interfaces. Everything dangerous about them comes not from the mechanism but from the lifecycle, specifically the gap between the person who opens a rule and the person (often nobody) who owns it afterward.

That gap is structural in freelance and agency work. Delivery ends ownership, but configuration doesn't expire with the invoice. If you ship infrastructure for clients, the fix is a handoff document listing every open rule and its reason, or a retainer where someone is still watching. If you've inherited infrastructure, the fix is the twenty-minute audit above, run this week, before the next feature.

The businesses that don't get breached aren't the ones with the fanciest tooling. They're the ones where someone can answer, for every open port, one question: why?

Next in this series: stateless filtering from the inside. We go under security groups into the Linux layer, iptables, nftables, and conntrack, and see the actual machinery that cloud firewalls abstract away.
