Here is the comprehensive **Product Requirement Document (PRD)** translated into English, refined for the Next.js/Shadcn stack, and including a detailed section on the **JSON Data Schema** for scenario management.

---

# Product Requirement Document (PRD): CyberTabletop

| Attribute | Details |
| --- | --- |
| **Project Name** | CyberTabletop (Codename: *BreachSim*) |
| **Version** | 1.0 (MVP) |
| **Status** | Draft / Approval Pending |
| **Date** | February 9, 2026 |
| **Owner** | Product Owner |

---

## 1. Executive Summary

**CyberTabletop** is an interactive web platform designed to gamify cybersecurity incident response training. Through realistic "Tabletop Exercises," users assume critical roles (CISO, SOC, DFIR) and make high-pressure decisions. The core objective is to balance three fundamental metrics: **Security**, **Business Continuity**, and **Reputation**.

### 1.1 Business Goals

* **Awareness:** Drastically improve understanding of incident response procedures.
* **Measurability:** Provide concrete feedback on decision-making quality.
* **Safe Environment:** Create a "safe-to-fail" simulation where errors have learning value but no real-world cost.

---

## 2. Target Audience

* **Primary:** IT Teams, Junior/Mid-level Security Analysts, Management (C-Suite awareness).
* **Secondary:** Cybersecurity students, non-technical staff (for phishing modules).

---

## 3. User Flow & Core Loop

1. **Onboarding:** User lands on the Dashboard.
2. **Scenario Selection:** User selects a crisis (e.g., "Ransomware Attack").
3. **Role Selection:** User chooses a persona (e.g., "CISO").
4. **Briefing:** Fictional context is displayed (e.g., "09:00 AM, production servers encrypted").
5. **Game Loop (Repeats 5-10 times per scenario):**
* **Inject:** New information or event arrives.
* **Decision:** User has  seconds to choose between 3-4 options.
* **Feedback:** System explains the consequence.
* **Score Update:** Real-time update of Security, Business, and Reputation metrics.


6. **Debriefing:** Final screen with total score, badge earned (e.g., "Hero" or "Disaster"), and decision log.

---

## 4. Functional Requirements

### 4.1 Scenario Dashboard

* **Grid Layout:** Visual display of available scenarios.
* **Card Metadata:** Each scenario card must show Title, Difficulty, Estimated Duration, and Description.
* **MVP Scenarios:** Ransomware Crisis, Data Breach, Phishing Campaign, Shadowvault (Shadow IT).

### 4.2 Role System

Users select a role that frames the simulation:

* **CISO (Chief Information Security Officer):** Strategic decisions, balancing Reputation vs. Security.
* **SOC Analyst:** Operational decisions, log analysis, focus on Security.
* **DFIR (Digital Forensics & Incident Response):** Technical investigation, focus on Containment/Recovery.

### 4.3 The Game Engine

* **Timer:** Countdown for every question (e.g., 30s). Timeout defaults to a negative "Inaction" choice.
* **Scoring Triad:**
* **SEC (Security):** System integrity.
* **BIZ (Business):** Revenue and operations.
* **REP (Reputation):** Public trust.


* **Logic:** A "Paranoid" choice (shutdown everything) boosts SEC but kills BIZ. A "Negligent" choice keeps BIZ high but tanks SEC.

---

## 5. Technical Stack

* **Frontend:** **Next.js 15 (App Router)**.
* *Server Components* for dashboard/static content.
* *Server Actions* for answer validation and score submission.


* **Styling:** **Tailwind CSS v4** (Dark Mode Default).
* **UI Library:** **shadcn/ui** (Latest).
* *Core Components:* Card, Progress, Toast, Badge, Accordion, AlertDialog.


* **Icons:** **Lucide React**.
* **State Management:** **React Context** or **Zustand** (for the active game session state).

---

## 6. Data Strategy: Portable Scenario JSON

To ensure extensibility and ease of content creation, the application will not hardcode scenarios. Instead, it will ingest a standardized **JSON Schema**. This allows instructional designers to write scenarios in a text editor or CMS and import them directly into the engine.

### 6.1 Data Requirements

* **Modularity:** The engine must parse any valid JSON file matching the schema.
* **Hot-Swapping:** Ability to add new scenarios by simply dropping a JSON file into the `/data/scenarios` directory (or fetching from an API).

### 6.2 JSON Schema Example

Below is the strict structure required for a scenario file (e.g., `ransomware-001.json`).

```json
{
  "meta": {
    "id": "scenario_001_ransomware",
    "title": "Operation Blackout: Ransomware",
    "description": "A critical server in HR has been encrypted. The attackers are demanding 50 BTC. How do you respond?",
    "difficulty": "Hard",
    "duration_minutes": 15,
    "tags": ["Ransomware", "Negotiation", "Crisis Mgmt"],
    "version": "1.0"
  },
  "configuration": {
    "playable_roles": ["CISO", "SOC_LEAD", "IT_MANAGER"],
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
      "context": "SOC Alert: Highly anomalous traffic detected outbound from the HR file server to a known C2 IP address in Eastern Europe.",
      "question": "What is your immediate containment strategy?",
      "timer_seconds": 30,
      "options": [
        {
          "id": "opt_a",
          "label": "Sever the internet connection for the entire HQ immediately.",
          "feedback_text": "Effective containment, but you just halted all business operations. The CEO is furious.",
          "impact": {
            "security": 20,
            "business": -40,
            "reputation": -5
          }
        },
        {
          "id": "opt_b",
          "label": "Isolate only the HR VLAN and begin forensic imaging.",
          "feedback_text": "Good balance. You contained the threat without stopping the sales department.",
          "impact": {
            "security": 10,
            "business": -5,
            "reputation": 0
          }
        },
        {
          "id": "opt_c",
          "label": "Monitor the traffic for 15 more minutes to gather intelligence.",
          "feedback_text": "Critical Error. In those 15 minutes, the malware spread to the Finance subnet.",
          "impact": {
            "security": -30,
            "business": 0,
            "reputation": -10
          }
        }
      ]
    },
    {
      "id": "step_02",
      "order": 2,
      "timestamp_display": "Day 1 - 10:30 AM",
      "context": "The attackers have posted a sample of employee data on a leak site. Journalists are calling.",
      "question": "How do you handle the external communication?",
      "timer_seconds": 45,
      "options": [
        {
          "id": "opt_a",
          "label": "Issue a holding statement: 'We are aware of an issue and investigating.'",
          "feedback_text": "Standard procedure. Keeps panic low but acknowledges the situation.",
          "impact": { "security": 0, "business": 0, "reputation": -5 }
        },
        {
          "id": "opt_b",
          "label": "Deny everything until the investigation is complete.",
          "feedback_text": "Bad move. The leak is already public. You look dishonest.",
          "impact": { "security": 0, "business": 0, "reputation": -40 }
        }
      ]
    }
  ]
}

```

---

## 7. UI/UX Mapping (Shadcn Implementation)

| Feature | Shadcn Component | Tailwind Utility Context |
| --- | --- | --- |
| **Scenario Card** | `Card`, `CardHeader`, `CardContent` | `hover:border-emerald-500 transition-all` |
| **Difficulty Tag** | `Badge` | `bg-red-900 text-red-200` (for Hard) |
| **Score Bars** | `Progress` | `[&>.indicator]:bg-green-500` (Custom CSS var) |
| **Timer** | `Progress` | Animated width transition from 100% to 0% |
| **Feedback Modal** | `AlertDialog` | `backdrop-blur-sm` |
| **Event Log** | `ScrollArea` | `h-[400px] w-full border-l` |

---

## 8. Definition of Done (MVP)

1. [ ] System can parse and load the JSON example provided above.
2. [ ] User can complete a full playthrough of "Scenario 001".
3. [ ] Score updates (SEC/BIZ/REP) are visually reflected in the UI after every choice.
4. [ ] Game Over state triggers if any metric hits 0%.
5. [ ] Victory state triggers at the end of JSON steps if metrics > 0%.
6. [ ] Responsive design verified on Desktop and Laptop screens.