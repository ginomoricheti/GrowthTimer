# **GrowthTimer**

*A goal-oriented Pomodoro application to track and achieve your professional learning objectives.*

[![GitHub release](https://img.shields.io/github/v/release/ginomoricheti/GrowthTimer?color=blue&style=flat-square)](https://github.com/ginomoricheti/GrowthTimer/releases/tag/v0.1.0)
[![Download for Windows](https://img.shields.io/badge/Download-Windows%20EXE-blue)](https://github.com/ginomoricheti/GrowthTimer/releases/latest/download/app.exe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Issues](https://img.shields.io/github/issues/ginomoricheti/GrowthTimer?style=flat-square&color=red)](https://github.com/ginomoricheti/GrowthTimer/issues)
[![Backend with Rust](https://img.shields.io/badge/Made%20with-Rust-orange?style=flat-square)](https://www.rust-lang.org/)
[![Frontend with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square)](https://react.dev/)

## **Overview**

GrowthTimer helps you structure your focus time, set measurable goals, and visualize progress — perfect for developers, students, and professionals working toward certifications or skill mastery.

---

## **Features**

* **Pomodoro Timer** – Fully customizable focus/break cycles.
* **Custom Goals** – Define specific targets (e.g., *"1000 hours of Java practice"*).
* **Categories** – Organize sessions by type (debugging, studying, practice, etc.).
* **Visual Progress** – Graphs and charts to show your journey.
* **Detailed Tracking** – Every completed Pomodoro is recorded toward your goals.

---

## **Use Cases**

Ideal for:

* Developers mastering new technologies.
* Students with structured study plans.
* Professionals preparing for certifications.
* Anyone with measurable learning or productivity objectives.

---

## **Tech Stack**

### **Frontend**

* React 19 + TypeScript
* Vite (build tooling)
* PrimeReact (UI components)
* FontAwesome (icons)
* React Toastify (notifications)

### **Backend**

* Tauri (desktop app framework)
* Rust (high-performance logic layer)

### **Development Tools**

* TypeScript (type safety)
* ESLint (code quality)
* Vite (fast dev server & build)

---

## **Installation**

### **Prerequisites**

```bash
Node.js >= 18.0.0
npm >= 9.0.0
Rust >= 1.70.0
```

### **Setup**

```bash
# Clone the repository
git clone https://github.com/ginomoricheti/GrowthTimer.git
cd GrowthTimer

# Frontend setup
cd frontend
npm install

# Backend setup
cd ../backend
npm install -g @tauri-apps/cli

# Development mode
npm run tauri dev

# Production build
npm run tauri build
```

---

## **Usage**

1. **Create a Project**

   * Name (e.g., *"Java Sr."*)
   * Category (e.g., *"Work"*)
   * Color (used in progress charts)

2. **Add a Goal**

   * Example: *"100 hours of Java"* linked to your project

3. **Start the Timer**

   * Complete Pomodoros to add progress toward your goals.
   * Track progress in real time and review stats in the right-hand panel.

---

## **Contributing**

We welcome contributions!

1. Fork the repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m "Add: YourFeature"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## **License**

Licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## **Bug Reports**

Please open an [issue](https://github.com/ginomoricheti/GrowthTimer/issues) and include:

* Steps to reproduce
* Expected vs actual behavior
* Screenshots if possible

---

## **Contact**

**Gino Morichetti**

* Twitter: [@ginomorichetti](https://twitter.com/ginomorichetti)
* Email: [ginomorichetti@gmail.com](mailto:ginomorichetti@gmail.com)

---

## **Acknowledgments**

* [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) – Francesco Cirillo
* [Tauri](https://tauri.app/) – Lightweight desktop framework
* [PrimeReact](https://primereact.org/) – UI components
* Inspired by [Pomofocus](https://pomofocus.io/) by [Uzu](https://www.reddit.com/user/ys0520/)

---

⭐ *If you enjoy GrowthTimer, please give it a star on GitHub!*

---
