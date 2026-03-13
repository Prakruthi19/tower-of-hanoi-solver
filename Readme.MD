# Tower of Hanoi Game & Solver

An **interactive Tower of Hanoi game and solver** with a graphical user interface that allows users to **play the puzzle manually or watch the algorithm solve it automatically**. The application demonstrates recursion and algorithmic problem solving while providing a game-like experience.

## Features

- Interactive **UI-based Tower of Hanoi game**
- **Multiple modes**
  - **Manual Mode** – Player solves the puzzle by moving disks
  - **Auto Solve Mode** – System demonstrates the optimal recursive solution
- Adjustable **number of disks (difficulty levels)**
- Visual disk movement between towers
- Step-by-step algorithm visualization
- Move counter to track performance
- Control the animation speed

## Game Rules

1. Only **one disk can be moved at a time**  
2. A **larger disk cannot be placed on a smaller disk**  
3. Only the **top disk** from a tower can be moved  

The goal is to **move all disks from the source tower to the destination tower**.

## Algorithm

The auto-solve mode uses a **recursive algorithm** to compute the optimal sequence of moves.

Minimum number of moves required:
2^n - 1

Where **n** is the number of disks.

## Technologies / Concepts

- Recursion
- Algorithm visualization
- Game logic implementation
- UI-based interactive application
- Data structures and problem solving


## How to Run

1. Clone the repository

```bash
git clone https://github.com/Prakruthi19/tower-of-hanoi-solver.git
```
2. Run the application
Open index.html in your web browser.