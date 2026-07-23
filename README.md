# 🛡️ WAYPOINT | Tactical C2 & ISR UAV Fleet Control Platform

> **High-End Defense Tech Command & Control (C2) / ISR Swarm Management Dashboard**  
> Engineered with strict military UI specifications, zero-clutter modular grids, real-time spatial telemetry, and standardized tactical color systems (`STANAG / NATO-inspired` dark theme).

---

## 🎯 Overview & Philosophy

**WAYPOINT** is a tactical battlefield management system (BMS) and UAV swarm orchestration interface designed for military operators, tactical commanders, and ISR (Intelligence, Surveillance, and Reconnaissance) analysts.

Unlike generic consumer dashboards or game interfaces, WAYPOINT enforces **Defense-Grade UI/UX Principles**:
- **Information Hierarchy**: Low-contrast, dimmed labels paired with bold high-contrast primary metrics to minimize cognitive overload under stress.
- **Modular Docking Grid**: Resizable, draggable, and persistent widget panels (`react-rnd` + `Zustand`) engineered like modern fighter cockpit Multi-Function Displays (MFDs).
- **Spatial Precision**: Interactive GIS tactical map layers using `Leaflet` & `@turf/turf` supporting NATO/MIL-STD tactical iconography, sensor coverage heatmaps, geofencing, and real-time waypoint routing.
- **High-Density Fire Support & Telemetry**: Instant status badges, critical threshold warnings, battery degradation tracking, signal strength telemetry, and automated handoff procedures.

---

## 🛠️ Tech Stack & Architecture

### **Core Frontend & Frameworks**
* **React 19** + **TypeScript 5.8**: Enterprise type-safety, concurrent rendering mode, and modular component design.
* **Vite 6**: Hyper-fast build tooling and instant Hot Module Replacement runtime.
* **Tailwind CSS v4**: Modern CSS engine utilizing custom tactical utility tokens and strict dark-palette CSS variables.
* **Zustand 5**: Atomic, lightweight global state management with local persistence for widget positions, drone telemetry, and tactical map layers.
* **Motion (`motion/react`)**: High-performance hardware-accelerated animations for emergency alert state transitions and panel drawer interactions.

### **Geospatial & Mapping (GIS)**
* **Leaflet 1.9** + **React-Leaflet 5**: Accelerated interactive tactical map engine.
* **Leaflet Draw**: Dynamic spatial geofencing, target designation, and operational perimeter planning.
* **Turf.js (`@turf/turf`)**: Real-time spatial calculations, distance metrics, buffer zones, and trajectory pathing.

### **AI & Server Components**
* **Express.js 4**: Node.js backend infrastructure serving real-time telemetry APIs and proxying secure server-side communications.
* **@google/genai (Gemini API)**: Server-side Google Gemini integration for automated tactical threat triage, mission risk assessment, and anomaly diagnostics.

---

## ⚡ Key Features & Capabilities

### 🚁 1. UAV Fleet Control (`UAVFleetPanel`)
- **Engineered Summary Grid**: 3-column strict summary grid (Total, Airborne, Critical) with micro-labels and dynamic status indicators.
- **Status Badges & Telemetry**: Dedicated indicators (`PATROL`, `RTB`, `OFFLINE`, `LOW BATT`, `WARNING`) with color-coded signal strength and battery progress meters.
- **Emergency Handoff Protocol**: One-click critical drone failover trigger (`[ INITIATE HANDOFF ]`) for automated recovery or secondary operator transfer.

### 🎯 2. Fire Support & Artillery Coordination (`FireSupportPanel`)
- **Artillery & Rocket Readiness**: Real-time weapon status breakdown (Cannons, Rockets) with precision, high-explosive, and smoke capacity bars.
- **Circular Status Gauges**: Cockpit-inspired circular gauges for Air Support vectors (`ROTARY`, `FIXED`, `UAS`).
- **Planned Fire Missions Queue**: Timed mission queue with target grid references, forward observer (FO) assignments, and designation methods (Laser Spotting, Surveillance Feed).

### 🗺️ 3. Tactical Map & Spatial Command (`TacticalMap`)
- **Layer Controls**: Dynamic toggles for Satellite, Dark Topo, Synthetic Aperture Radar (SAR), FLIR thermal views, Base Symbols, Supply Routes, and Key Civil Infrastructure.
- **Threat Rings & Coverage Radii**: Real-time visualization of ISR sensor bubbles, EW jamming zones, and air defense umbrella perimeters.
- **Interactive Waypoint Planner**: Live drag-and-drop waypoint plotting for UAV flight corridors.

### 📺 4. Live Multi-Camera Feeds (`VideoFeedsPanel`)
- **EO/IR Thermal Feeds**: Dual-channel Electro-Optical / Infrared livestream simulator with telemetry overlay (altitude, heading, pitch/roll, crosshair targeting).
- **Target Tracking HUD**: Real-time object identification boxes with confidence metrics and geo-coordinates.

### ⚙️ 5. Tactical Design System (`DesignSystemPanel`)
- **Color Tokens**: Standardized 4-layer spatial dark surface palette (`#0b0f14` base map, `#151c24` widget dark, `#1e2732` panel surface, `#273341` interactive hover).
- **Typography & Font Rules**: Monospaced font hierarchy (`JetBrains Mono`) for zero alignment drift across dynamic numerical feeds.

---

## 📁 Repository Structure

```
├── src/
│   ├── components/           # Generic tactical UI primitives (Buttons, Modals, Badges)
│   ├── features/
│   │   ├── camera/           # EO/IR video feed overlays & HUD targeting
│   │   ├── drones/           # UAV Fleet panel, status monitors, and telemetry components
│   │   ├── fire-support/     # Fire support coordination, artillery readiness, mission queue
│   │   ├── installations/    # Base infrastructure, radar stations, and supply depots
│   │   ├── map/              # Leaflet GIS canvas, layer controls, and tactical symbols
│   │   └── settings/         # Tactical Design System tokens & palette inspector
│   ├── hooks/                # Custom React hooks (hotkeys, map listeners, telemetry timers)
│   ├── layout/               # TopBar navigation, status banners, MFD window chrome
│   ├── store/                # Zustand stores (useWidgetStore, useDroneStore, useMapStore)
│   ├── index.css             # Tailwind v4 configuration & Tactical CSS Variables
│   ├── main.tsx              # Application entry point
│   └── App.tsx               # Primary tactical dashboard workspace layout
├── server.ts                 # Express backend server & Gemini AI integration
├── package.json              # Project dependencies & operational scripts
└── metadata.json             # AI Studio app metadata
```

---

## 🚦 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/waypoint-uav-c2.git
   cd waypoint-uav-c2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🎨 Design Guidelines & Standards

When extending or building new widgets for WAYPOINT, adhere to these guidelines:

1. **Strict Monospaced Data**: Numerical telemetry and timestamps MUST use `font-mono` (`JetBrains Mono`).
2. **Layer Brightness Delta**: Container backgrounds must remain within $\le 7\%$ brightness variance of their parent canvas to maintain night-vision / light-safe legibility.
3. **No Unsolicited Eye Candy**: Avoid decorative glassmorphism, glowing borders, or arbitrary gradients. All colors denote semantic tactical status (Green = Nominal, Amber = Caution/RTB, Red = Critical/Offline, Cyan = Primary Select).

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---
*WAYPOINT Defense Tech UI System — Precision Engineering for Battlefield Management Systems.*
