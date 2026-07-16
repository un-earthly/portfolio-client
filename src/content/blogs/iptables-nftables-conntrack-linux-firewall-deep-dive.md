---
title: "Iptables, Nftables, and Conntrack: What's Actually Enforcing Your Security Group"
date: 2026-07-16
tags: [Linux, iptables, nftables, netfilter, conntrack, firewall, AWS, security groups, DevOps, infrastructure]
metaDescription: A complete technical breakdown of Linux packet filtering: netfilter hooks, iptables tables and chains, the iptables to nftables migration, how conntrack actually tracks connection state, stateless vs stateful filtering, and a real case study of a local firewall rule silently undoing a correctly configured AWS security group.
readTime: 15
type: technical
excerpt: A security group is a suggestion the moment traffic crosses the network interface. The kernel makes the real decision, packet by packet, through netfilter, iptables or nftables, and a connection tracking table that remembers every flow your server has ever touched. This is that layer, in full.
cover: '/blog-covers/iptables-nftables-conntrack-linux-firewall-deep-dive.svg'
---
Part 1 of this series ended on a security group. Correctly scoped, correctly attached, doing exactly what the console said it would do. And still, in the case that opened that post, traffic got through that shouldn't have.

The reason wasn't the security group. It was one layer down, on the instance itself, where a rule nobody remembered writing was quietly overriding a rule everybody had just carefully reviewed.

Most audits stop at the AWS console. They check the security group, confirm the CIDR blocks look sane, tick the box, move on. What almost nobody checks is what the operating system itself is doing with that traffic once it actually lands on the network interface. And on Linux, that decision is not made by AWS. It's made by a kernel subsystem called netfilter, configured through iptables or nftables, backed by a table called conntrack that remembers every connection the machine has ever seen.

This post goes under the cloud abstraction, into the layer that's actually pulling the trigger.

## What Netfilter Actually Is

Netfilter is not a firewall. It's the framework inside the Linux kernel that lets other things build firewalls. iptables, nftables, ufw, firewalld, Docker's networking layer, Kubernetes' kube-proxy in iptables mode: every one of these is a userspace tool that writes rules into netfilter. The kernel is the thing actually evaluating packets. The tools are just different pens writing on the same paper.

Netfilter works by exposing five fixed points in the path a packet takes through the kernel's networking stack. These are called hooks, and every single packet that touches the machine passes through some subset of them, in a fixed order, whether you've configured anything or not.

```
                     ┌─────────────┐
   incoming packet → │ PREROUTING  │
                     └──────┬──────┘
                            │
                 routing decision
                            │
              ┌─────────────┴─────────────┐
              │                           │
      destined for this host      destined elsewhere
              │                           │
        ┌─────▼─────┐              ┌──────▼──────┐
        │   INPUT   │              │   FORWARD   │
        └─────┬─────┘              └──────┬──────┘
              │                           │
      local process handles it            │
              │                           │
        ┌─────▼─────┐                     │
        │  OUTPUT   │                     │
        └─────┬─────┘                     │
              │                           │
              └─────────────┬─────────────┘
                            │
                     ┌──────▼──────┐
                     │ POSTROUTING │
                     └──────┬──────┘
                            │
                      packet leaves
```

INPUT is the one people think about most, because it's "traffic coming into this server." But FORWARD matters just as much on any box doing routing, NAT, or running Docker, because Docker containers live behind a bridge network and their traffic passes through FORWARD, not INPUT. This is the single most common reason people get confused debugging container networking: they're checking INPUT rules for traffic that never touches INPUT at all.

## Iptables: Tables, Chains, and the Order Things Actually Happen In

iptables is the older, more widely deployed interface to netfilter, and it's still what you'll find on the majority of production Linux servers in 2026, even with nftables positioned as its replacement. Understanding it means understanding two nested concepts: tables and chains.

A table groups rules by what kind of decision they make. There are four that matter:

- **filter**: the actual allow/drop/reject decisions. This is what people mean when they say "firewall rules."
- **nat**: rewrites source or destination addresses. This is how a Docker container with a private IP becomes reachable on a public port.
- **mangle**: modifies packet headers for things like QoS marking.
- **raw**: runs before conntrack even starts tracking a connection, used to exempt specific traffic from connection tracking entirely.

Each table contains chains, and each chain maps to one of the netfilter hooks. The filter table has INPUT, OUTPUT, and FORWARD chains. The nat table has PREROUTING and POSTROUTING chains (this is where Docker's port mapping rules actually live). A rule you write always belongs to a specific table and a specific chain, and the table determines what class of decision that rule is allowed to make.

Here's what an actual production filter table looks like when you ask the kernel directly instead of trusting a dashboard:

```bash
sudo iptables -L -v -n --line-numbers
```

```
Chain INPUT (policy DROP 12 packets, 890 bytes)
num   pkts bytes target     prot opt in     out     source               destination
1      847K  62M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:443
2      412K  31M ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0            tcp dpt:22
3     2.1M  180M ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
4        88  6600 ACCEPT     tcp  --  eth0   *       0.0.0.0/0            0.0.0.0/0            tcp dpt:5432
```

Two things matter here more than the specific rules. First, the policy on the chain is DROP, meaning anything that doesn't match a rule above is silently dropped by default, the same allow-only philosophy AWS security groups use. Second, and this is the part that catches people, is rule 4: `tcp dpt:5432` with no source restriction, on `eth0`. Someone opened Postgres to the world on the instance's local firewall, independent of whatever the security group says. If the security group for that instance also happens to allow 5432 broadly, for "temporary debugging" that nobody rolled back, you now have two independent misconfigurations that individually might not have mattered, and together define your actual exposure.

Rules are evaluated top to bottom, and the first match wins. Order isn't cosmetic, it's the entire logic of the ruleset. A DROP rule sitting above an ACCEPT rule for the same traffic makes that ACCEPT rule dead code that will never fire, and nothing in `iptables -L` warns you about that. You have to read the order yourself.

## Nftables: The Replacement Nobody Fully Migrated To

nftables was built to replace iptables, arptables, and ip6tables with one unified syntax, and it's been the default backend on most major distributions (Debian, RHEL, Ubuntu) for years now. But "default backend" doesn't mean "what's actually running." A huge number of production servers were provisioned years ago with iptables rules that were never rewritten, and the compatibility layer (`iptables-nft`) quietly translates old iptables commands into nftables rules underneath, which means two engineers can be looking at what they think is the same firewall and be using completely different tools to inspect it.

The core difference that matters practically: nftables lets you express what used to take four separate iptables rules (one per protocol, one per direction) as a single rule with a set.

```bash
sudo nft list ruleset
```

```
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        ct state established,related accept
        tcp dport { 22, 443 } accept
        ip protocol icmp accept
    }
}
```

That `{ 22, 443 }` is a native set. In old iptables syntax, that's two separate rules minimum, sometimes duplicated again for a second protocol family. Fewer rules means fewer places for the ordering trap above to hide, and nftables' native ability to define named sets means you can update one set (say, an allow-list of admin IPs) in one place instead of hunting down every rule that references it.

The practical takeaway: know which one is actually running on the box you're auditing before you start reading rules. `iptables -V` will tell you if you're on the nf_tables backend even while typing iptables syntax. If you're auditing a fleet, check for both, because a "we migrated to nftables" line in a runbook doesn't mean every host in the fleet got the memo.

## Conntrack: The Table That Makes "Stateful" Possible

This is the part of the stack that does the most work while being talked about the least.

When people say a security group or a firewall is "stateful," what they actually mean is: there exists a table somewhere that remembers a connection was opened, so the return traffic doesn't need its own explicit rule. On Linux, that table is conntrack, and it's what makes rule 3 in the iptables output above (`state RELATED,ESTABLISHED`) possible at all.

Every time a new connection starts, the kernel creates an entry in the conntrack table before a single filter rule gets evaluated for the response traffic. That entry tracks the connection's state through a lifecycle:

- **NEW**: first packet of a connection the kernel hasn't seen before.
- **ESTABLISHED**: the kernel has seen traffic in both directions; a full handshake completed.
- **RELATED**: a new connection that's logically tied to an existing one, the classic example being the separate data connection FTP opens alongside its control connection.
- **INVALID**: a packet that doesn't fit any known connection or violates protocol expectations, like a TCP packet with the ACK flag set arriving with no matching SYN ever seen.

You can read this table directly, live, on any running server:

```bash
sudo conntrack -L | head -5
```

```
tcp   6 431999 ESTABLISHED src=10.0.1.42 dst=10.0.1.15 sport=51882 dport=5432 src=10.0.1.15 dst=10.0.1.42 sport=5432 dport=51882 [ASSURED] mark=0 use=1
tcp   6 108 TIME_WAIT src=203.0.113.9 dst=10.0.1.15 sport=61423 dport=443 src=10.0.1.15 dst=203.0.113.9 sport=443 dport=61423 [ASSURED] mark=0 use=1
udp   17 29 src=10.0.1.15 dst=169.254.169.254 sport=44012 dport=80 src=169.254.169.254 dst=10.0.1.15 sport=80 dport=44012 [ASSURED] mark=0 use=1
```

Each of those lines is a live flow the kernel is holding in memory, with a timeout counter (that middle number, in seconds) counting down. This is exactly the same mechanism AWS describes when it says a security group is stateful, except AWS's version runs at the hypervisor layer, on infrastructure you'll never SSH into, while this version runs inside your own instance's kernel, visible and editable by anyone with root.

Two operational failure modes come out of this table specifically, and both are far more common in production than a misread ACCEPT rule:

**Table exhaustion.** conntrack has a maximum size (`net.netfilter.nf_conntrack_max`, commonly defaulting to a number in the low hundreds of thousands). A server under a connection flood, or one running a badly behaved service that opens far more short-lived connections than it closes, can fill this table. Once it's full, the kernel starts dropping new connections outright, and the failure looks identical to a firewall rule blocking traffic, except no firewall rule is involved at all. `dmesg` will usually show `nf_conntrack: table full, dropping packet` when this happens, and it's one of the first things worth checking when a service that "should" be reachable intermittently isn't.

**Timeout mismatches.** Idle TCP connections get reaped from the table after a timeout (`net.netfilter.nf_conntrack_tcp_timeout_established`, often defaulting to a number in the tens of thousands of seconds, but frequently tuned much lower on hardened images). If a client holds a connection open longer than that timeout, the entry silently disappears from conntrack while the TCP session is still technically alive on both ends. The next packet on that "established" connection now looks NEW to the kernel, and if your rule set only has an ACCEPT for `RELATED,ESTABLISHED` state with no explicit rule for that specific port, it gets dropped. This produces the maddening bug report of "the connection was fine, then randomly dropped after sitting idle for a while," which usually has nothing to do with the application and everything to do with a conntrack timeout nobody tuned for the workload.

## Stateless vs. Stateful, Concretely

This is the distinction Part 1 touched on from the AWS side. Here's what it actually looks like at the packet level.

A stateless filter (this is what a Network ACL is in AWS, and what a raw, conntrack-free iptables ruleset would be) evaluates every single packet in total isolation. It has no memory of what came before. To allow a normal web request and its response, you need two rules: one allowing inbound on port 443, and a second allowing outbound from an ephemeral port range, because the filter has no concept of "this outbound packet is a reply to that inbound one." NACLs in AWS are stateless for exactly this reason, and it's why NACL rulesets are so much more painful to write correctly than security group rulesets.

A stateful filter, backed by conntrack, only needs the first rule. The moment that inbound SYN packet is accepted, conntrack creates an entry, and every subsequent packet in that flow, in either direction, gets matched against the `ESTABLISHED` state rule instead of needing its own explicit allow. This is strictly more convenient and it is also the exact mechanism that makes rule ordering mistakes catastrophic instead of merely annoying, because one bad DROP placed before the ESTABLISHED check can sever every active connection on the box in one edit.

## Where a Correct Security Group Gets Quietly Undone

Here's the case that actually matters, assembled from the pattern that shows up repeatedly in production incidents, not a hypothetical.

An engineer configures a security group correctly: inbound 443 from anywhere, inbound 22 restricted to a specific bastion IP, everything else denied by default. Textbook. It passes review.

Weeks later, someone installs Docker on that same instance to run a sidecar service. Docker, by default, manages its own iptables rules to handle container networking and port publishing, and it inserts them directly into the FORWARD and NAT chains, ahead of rules that were already there. If that sidecar container gets started with `-p 5432:5432` for local debugging and never gets stopped, Docker has just opened a path to port 5432 that bypasses the reasoning the security group review was based on entirely. The security group still shows exactly what it showed during review. Nothing in the AWS console changed. The exposure exists one layer down, written by a tool whose job was never firewall policy in the first place, just container networking convenience.

This is precisely the pattern this series is named for. The ownership gap isn't a technical flaw in security groups or in iptables. It's the assumption that reviewing one layer means you've reviewed the system. Nobody owns the intersection between "what AWS allows" and "what the OS actually enforces," so nobody checks it, until an audit or an incident forces the question.

## Auditing Both Layers, Not Just One

A security group review that stops at the console is half an audit. The other half runs on the instance itself:

```bash
# What's actually in the filter table, in the order it's evaluated
sudo iptables -S

# Or on an nftables host
sudo nft list ruleset

# What Docker has silently inserted into your ruleset
sudo iptables -t nat -L DOCKER -n -v

# Live connections the kernel is currently tracking
sudo conntrack -L -o extended

# How close the conntrack table is to its ceiling
cat /proc/sys/net/netfilter/nf_conntrack_count
cat /proc/sys/net/netfilter/nf_conntrack_max
```

None of these commands require anything beyond SSH access and root. The reason they don't get run isn't difficulty, it's that the AWS console makes the security group visible and reviewable by default, while the OS-level rules are invisible unless someone deliberately goes looking. Visibility, not complexity, is the actual gap.

## What's Next

Security groups and NACLs sit at the VPC edge. iptables, nftables, and conntrack sit on the instance. Between those two layers, on any non-trivial production setup, there's usually a load balancer, and load balancers introduce their own connection-handling behavior that neither of the first two layers accounts for. That's the next piece of this series: what a load balancer actually does to a connection before your instance ever sees it, and where that changes what "stateful" even means.

If you haven't read the piece this one builds on, Part 1 is here: [The Security Group Nobody Remembers Opening](https://alamin-md.xyz/blogs/aws-security-groups-deep-dive-stateful-firewall)