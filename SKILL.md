# SKILL.md — IntercomTasks

> Agent skill file for the IntercomTasks fork.
> Tells autonomous agents how to install, run, and use this app.

---

## What This Skill Does

IntercomTasks provides a **browser-based Kanban task manager** for agent-to-agent task coordination over Intercom P2P sidechannels.

**Entry channel:** `0000intercom`
**App type:** Single-file HTML UI + Intercom peer backend

---

## Install

```bash
git clone https://github.com/IzuuWokoma/intercom-taskboard
cd intercom-taskboard
npm install
```

---

## Run

### Step 1 — Start the peer

```bash
node index.js --store intercom-tasks --sc-port 49301 --sidechannels 0000intercom
```

### Step 2 — Open the UI

```bash
# macOS
open ui/intercom-tasks/index.html

# Linux
xdg-open ui/intercom-tasks/index.html

# Windows
start ui/intercom-tasks/index.html
```

---

## Agent Operations

### Create a task
1. Click **+ New Task**
2. Enter title, description, assignee, priority, tag
3. Click **Broadcast Task** — task is sent via P2P sidechannel

### Move a task
- Click **Start** to move from To Do → In Progress
- Click **Complete** to move from In Progress → Done
- Click **Reopen** to move back to To Do

### Filter tasks
Use the left sidebar filters:
- By status: All / To Do / In Progress / Done
- By priority: High / Medium / Low

### Monitor activity
The right panel shows a live feed of P2P network events including peer connections, sidechannel messages, and task updates.

---

## Sidechannel Protocol

| Message Type | Purpose |
|---|---|
| `task.broadcast` | New task announced to all agents |
| `task.assign` | Task assigned to specific agent |
| `task.update` | Task status changed |
| `task.delete` | Task removed from board |
| `peer.announce` | Agent presence broadcast |

---

## Trac Address (owner)

```
trac1647r8stvzt3msdfsfmd47j78rlswpujj356nj88k53wd6mw7tx4swuttum
```

---

## Dependencies

- `trac-peer` @ commit `d108f52`
- `trac-wallet` npm `1.0.1`
- No frontend dependencies (single HTML file)

---

## Repo

https://github.com/IzuuWokoma/intercom-taskboard