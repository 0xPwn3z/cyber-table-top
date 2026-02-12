<div align="center">

# 🛡️ CyberTabletop

### *Gamified Cybersecurity Incident Response Training*

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Train your team to handle cyber crises through immersive, decision-driven simulations.*

[🚀 Live Demo](#) • [📖 Documentation](docs/PRD.md) • [🎯 Create Scenario](#creating-custom-scenarios)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [The Three-Metric System](#the-three-metric-system)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Creating Custom Scenarios](#creating-custom-scenarios)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**CyberTabletop** is an interactive web application that gamifies cybersecurity incident response training. Teams and individuals can step into critical roles (CISO, SOC Analyst, DFIR) and make high-pressure decisions during realistic crisis scenarios like ransomware attacks, data breaches, and insider threats.

Unlike traditional training, CyberTabletop creates a **safe-to-fail environment** where every decision has immediate, measurable consequences across three core organizational pillars:

- **🔒 Security** — System integrity and threat containment
- **💼 Business** — Operational continuity and revenue
- **🌐 Reputation** — Public trust and stakeholder confidence

---

## ✨ Key Features

### 🎮 **Immersive Simulation Engine**
- Real-time decision-making with countdown timers
- Dynamic "inject" system that adapts to your choices
- Branching scenarios with multiple outcomes

### 🎭 **Role-Based Gameplay**
- **CISO**: Strategic leadership, balancing risk vs. business impact
- **SOC Analyst**: Tactical response, log analysis, containment
- **DFIR**: Forensic investigation, root cause analysis, recovery

### 📊 **Live Metrics Dashboard**
- Real-time score bars tracking Security, Business, and Reputation
- Instant feedback on every decision
- Detailed event log for post-incident review

### 🗂️ **JSON-Driven Scenario System**
- Fully modular — add new scenarios without code changes
- Standardized schema for content creators
- Hot-swappable scenario library

### 🌑 **Cyber-Warfare Aesthetic**
- Dark mode-first UI optimized for SOC environments
- 3D animated threat map background
- Terminal-inspired feedback overlays

### 📱 **Production-Ready Architecture**
- Server-side rendering with Next.js 15 App Router
- Type-safe with strict TypeScript
- Optimized for performance and accessibility

---

## ⚖️ The Three-Metric System

Every decision you make affects **three interconnected pillars**:

```
┌─────────────┬────────────────────────────────────────────────────┐
│  Security   │ Threat containment, system integrity, data safety  │
│ (0-100)     │ → Drops when breaches occur or vulnerabilities     │
│             │   are exploited. Game Over at 0.                   │
├─────────────┼────────────────────────────────────────────────────┤
│  Business   │ Revenue, operations, service availability          │
│ (0-100)     │ → Drops when systems go offline or deals are lost. │
│             │   Game Over at 0.                                  │
├─────────────┼────────────────────────────────────────────────────┤
│ Reputation  │ Public trust, media perception, stakeholder        │
│ (0-100)     │   confidence                                       │
│             │ → Drops from data leaks, poor comms, coverups.     │
│             │   Game Over at 0.                                  │
└─────────────┴────────────────────────────────────────────────────┘
```

**Example Trade-off:**
- Shutting down all systems immediately → ⬆️ Security, ⬇️⬇️ Business
- Ignoring the threat to keep operations running → ⬆️ Business, ⬇️⬇️ Security
- Transparent public disclosure → ⬇️ Reputation (short-term), but prevents future penalties

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **3D Graphics** | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) |
| **Deployment** | [Vercel](https://vercel.com/) (recommended) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** / **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/cyber-tabletop.git
cd cyber-tabletop
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
cyber-tabletop/
├── docs/
│   └── PRD.md                    # Product Requirements Document
├── public/                       # Static assets
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Dashboard (scenario selection)
│   │   └── game/[id]/
│   │       ├── page.tsx          # Game session (briefing → gameplay)
│   │       └── setup/
│   │           └── page.tsx      # Onboarding wizard (org context)
│   ├── components/
│   │   ├── dashboard-client.tsx  # Main dashboard UI
│   │   ├── scenario-card.tsx     # Interactive scenario cards
│   │   ├── threat-map-background.tsx # 3D animated globe
│   │   ├── game/                 # Core game components
│   │   │   ├── game-client.tsx   # Game orchestrator
│   │   │   ├── score-bars.tsx    # SEC/BIZ/REP metrics
│   │   │   ├── inject-card.tsx   # Decision prompts
│   │   │   ├── countdown-timer.tsx
│   │   │   ├── feedback-overlay.tsx
│   │   │   └── game-end-screen.tsx
│   │   └── onboarding/           # Setup wizard
│   │       ├── onboarding-wizard.tsx
│   │       ├── sector-step.tsx
│   │       ├── infrastructure-step.tsx
│   │       ├── assets-step.tsx
│   │       └── scenario-briefing.tsx
│   ├── data/
│   │   └── scenarios/            # ⚡ JSON scenario files
│   │       └── ransomware-001.json
│   ├── lib/
│   │   ├── store.ts              # Zustand game state
│   │   ├── onboarding-store.ts   # Onboarding state
│   │   └── scenarios.ts          # Scenario loader
│   ├── types/
│   │   ├── game.ts               # Core type definitions
│   │   └── onboarding.ts
│   └── app/
│       └── globals.css           # Tailwind + custom styles
└── UX/                           # Design references
```

---

## 🎯 Creating Custom Scenarios

CyberTabletop scenarios are defined in **JSON files** located in `src/data/scenarios/`. The engine automatically loads any valid scenario file at runtime.

### Scenario Schema

```json
{
  "meta": {
    "id": "unique_scenario_id",
    "title": "Crisis Title",
    "description": "Brief overview",
    "difficulty": "Easy" | "Medium" | "Hard",
    "duration_minutes": 15,
    "tags": ["Ransomware", "Crisis Mgmt"],
    "version": "1.0"
  },
  "configuration": {
    "playable_roles": ["CISO", "SOC_LEAD", "DFIR"],
    "starting_stats": {
      "security": 90,
      "business": 100,
      "reputation": 100
    }
  },
  "injects": [
    {
      "id": "step_01",
      "order": 1,
      "timestamp_display": "Day 1 - 09:15 AM",
      "context": "Situation description...",
      "question": "What do you do?",
      "timer_seconds": 30,
      "options": [
        {
          "id": "opt_a",
          "label": "Action A",
          "feedback_text": "Consequence of this action",
          "impact": {
            "security": 10,
            "business": -5,
            "reputation": 0
          }
        }
      ]
    }
  ]
}
```

### Adding a New Scenario

1. Create a new JSON file in `src/data/scenarios/` (e.g., `phishing-attack.json`)
2. Follow the schema structure above
3. Restart the dev server
4. The scenario will automatically appear in the dashboard

**📘 Full schema documentation:** See [PRD.md](docs/PRD.md#6-data-strategy-portable-scenario-json)

---

## 💻 Development Workflow

### Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### State Management Architecture

**Draft → Commit → Reset Lifecycle:**

```
Dashboard "Start"  →  Onboarding Wizard  →  INITIATE OPERATION  →  Game Active
     ↓                 (temp store)             (commitOnboarding)       ↓
resetSimulation()     Steps 1-3 + Briefing     Moves to active       resetSimulation()
     ↓                 Data not persisted       session store         Clears everything
  Blank Slate          until committed                                   ↓
                                                                    Back to Dashboard
```

**Key Functions:**
- `commitOnboarding()` — Draft → Active session (called on "INITIATE OPERATION")
- `resetSimulation()` — Full reset (clears onboarding + game state)
- `resetGame()` — Replay same scenario (keeps onboarding context)


## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the existing code style (TypeScript strict mode, Prettier formatting)
4. Write clear commit messages
5. **Test** your changes locally (`npm run build`)
6. Submit a **Pull Request**

### Content Contributions

To add new scenarios:
- Submit a PR with a valid JSON file in `src/data/scenarios/`
- Ensure it follows the schema
- Include a brief narrative description in the PR

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🎓 Learn More

- **Product Requirements:** [docs/PRD.md](docs/PRD.md)
- **Next.js Documentation:** [nextjs.org/docs](https://nextjs.org/docs)
- **Cybersecurity Training Resources:** [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

<div align="center">

**Built with ❤️ by Pwn3z for security professionals who learn by doing.**

*"The best way to prepare for a crisis is to experience one (safely)."*

</div>
