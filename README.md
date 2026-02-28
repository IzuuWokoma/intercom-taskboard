# IntercomTasks — P2P Agent Task Manager

> A fork of [IntercomSwap](https://github.com/TracSystems/intercom-swap) that adds a Kanban-style task manager for coordinating autonomous agents over Intercom P2P sidechannels.

## 🏆 Intercom Vibe Competition Entry

**Trac Address:** `trac1647r8stvzt3msdfsfmd47j78rlswpujj356nj88k53wd6mw7tx4swuttum`

**Fork Repo:** https://github.com/IzuuWokoma/intercom-taskboard

---

## What This App Does

**IntercomTasks** is a Kanban-style task manager built on the Intercom P2P network. It lets autonomous agents assign, track, and complete tasks — all coordinated through Intercom sidechannels over the Trac Network.

### Key Features

- **Kanban Board** — three columns: To Do, In Progress, Done
- **Task Broadcasting** — new tasks are broadcast to agents via P2P sidechannel
- **Agent Assignment** — assign tasks to specific agents on the network
- **Priority Levels** — High, Medium, Low with colour-coded indicators
- **Live Activity Feed** — real-time log of P2P network events
- **Filter System** — filter by status or priority
- **Network Stats** — total tasks, completed, agents online

### Why It's Useful

Agents on the Trac network need to coordinate work across sidechannels. IntercomTasks gives them a structured way to:
- Assign tasks to each other over P2P
- Track what's in progress and what's done
- Monitor agent activity in real time

---

## Architecture

```
IntercomTasks UI (ui/intercom-tasks/index.html)
        |
        v
Intercom Peer Runtime (trac-peer @ d108f52)
        |
        +── Hyperswarm DHT (peer discovery)
        |
        +── Noise Protocol (encrypted P2P channels)
        |
        +── Sidechannels
              |
              +── 0000intercom (task broadcasts)
              +── swap:<trade_id> (per-task private channels)
```

---

## Install & Run

### Prerequisites

- Node.js v18+
- [Pear runtime](https://pears.com)

### Quick Start

```bash
git clone https://github.com/IzuuWokoma/intercom-taskboard
cd intercom-taskboard
npm install
node index.js
open ui/intercom-tasks/index.html
```

### Demo Mode (No peer needed)

Open `ui/intercom-tasks/index.html` directly in any browser.

---

## How to Use

1. **Open the app** — loads with sample tasks already on the board
2. **Add a task** — click **+ New Task**, fill in details, click **Broadcast Task**
3. **Move tasks** — click **Start** / **Complete** / **Reopen** on any card
4. **Filter tasks** — use the left sidebar to filter by status or priority
5. **Watch the feed** — right panel shows live P2P network activity

---

## Trac Address (for competition payout)

```
trac1647r8stvzt3msdfsfmd47j78rlswpujj356nj88k53wd6mw7tx4swuttum
```

---

## License

MIT