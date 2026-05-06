# Game-Snake-Game

## Snake: Portal Edition 🐍✨

A polished, retro-inspired **Snake Game** built with vanilla HTML5, CSS3, and JavaScript. This version transforms the classic gameplay with a high-stakes "hunger" mechanic and screen-wrapping "portal" logic.

## 🕹️ Live Demo
*Insert your GitHub Pages link here once hosted*

## 🚀 Key Features

*   **Portal Mechanics**: The walls are not boundaries. Seamless wrap-around logic allows you to traverse any edge and reappear on the opposite side.
*   **Dynamic Hunger System**: A center-aligned, shrinking UI bar. You have **15 seconds** to reach the next apple, or the snake starves.
*   **Final Countdown Pop-up**: When the timer hits the final 5 seconds, a large, animated on-screen countdown triggers to escalate the tension.
*   **"Time's Up" State**: Custom game-over logic specifically for starvation, featuring a unique UI state and "TIME'S UP!" alert.
*   **Ready-Buffer UX**: The game engine and timers only start once you press a direction key, giving you time to analyze the board after hitting "Play."
*   **Dual Controls**: Fully responsive support for both **WASD** and **Arrow Keys**.

## 🛠️ Built With

*   **HTML5 Canvas**: For high-performance 2D rendering and grid-based logic.
*   **CSS3 Animations**: Custom `@keyframes` for the pulsing hunger bar and the "pop-in" countdown effects.
*   **Vanilla JavaScript**: Clean, modular code separated into logic, styling, and structure for easy maintainability.

## 📁 File Structure
```text
├── index.html   # Game structure and UI elements
├── style.css    # Classic arcade aesthetic and animations
└── script.js    # Game engine, input handling, and portal logic
