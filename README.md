# GrowthTimer

A goal-oriented pomodoro application that helps you track your progress towards specific professional objectives.

## Features

- **Pomodoro Timer**: custom pomodoro.
- **Custom Goals**: Define specific targets with hour objectives (e.g., "1000 hours of Java practice")
- **Categorization**: Organize your time by categories (debugging, studying, practice, etc.)
- **Visual Progress**: See how much you have left to reach your goals
- **Detailed Tracking**: Record each completed pomodoro and its contribution to your objectives

## Use Cases

Perfect for:
- Developers seeking to specialize in specific technologies
- Students with structured study goals
- Professionals working towards certifications
- Anyone with measurable learning objectives

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **PrimeReact** for UI components
- **FontAwesome** for icons
- **React Toastify** for notifications

### Backend
- **Tauri** for desktop app framework
- **Rust** for backend logic and performance

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Vite** for fast development server

## Installation and Usage

### Prerequisites

```bash
# System requirements
Node.js >= 18.0.0
npm >= 9.0.0
Rust >= 1.70.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/growthtimer.git

# Navigate to project directory
cd growthtimer

# Install frontend dependencies
npm install

# Install Tauri CLI (if not already installed)
npm install -g @tauri-apps/cli

# Run in development mode
npm run dev

# Build for production
npm run build
```

## How to Use

1. **Create a Goal**: 
   - Define your target (e.g., "Senior Java Developer")
   - Set hour objectives (e.g., 1000 hours practice + 300 hours study)

2. **Start Pomodoro**:
   - Select your active goal
   - Choose work category (debugging, study, practice, etc.)
   - Start the 25-minute timer

3. **Track Progress**:
   - Each completed pomodoro adds minutes to your goal
   - Visualize your progress in real-time
   - Review statistics and trends

## Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add: Amazing Feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Bug Reports

If you find any bugs, please open an [issue](https://github.com/yourusername/growthtimer/issues) describing:
- The problem found
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## Contact

Gino Morichetti - [@ginomorichetti](https://twitter.com/ginomorichetti) - ginomorichetti@gmail.com

## Acknowledgments

- [Pomodoro Technique](https://francescocirillo.com/pages/pomodoro-technique) by Francesco Cirillo
- [Tauri](https://tauri.app/) for the extremley light desktop app framework
- [PrimeReact](https://primereact.org/) for the UI components

---

If u like this project, give me a star!! :)
