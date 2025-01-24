# Zustand, React Query Demo

This is an example of using Zustand and React Query to manage front-end data flow.

## **Dependencies**

|                       | Description                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Zustand**     | A lightweight and scalable state management solution for React, designed for simplicity and performance.   |
| **React Query** | Facilitates fetching, caching, and synchronizing asynchronous data in React applications.                  |
| **TypeScript**  | Provides static typing for JavaScript, enhancing code quality and maintainability.                         |
| **Vite**        | A modern build tool that offers fast development and optimized builds for a smoother developer experience. |

## Required

| Tool    | Version |
| ------- | ------- |
| Node.JS | >=18    |

## Getting Started

- Clone the repository

  ```
  git clone https://github.com/kavout-ai/zustand-query-demo
  ```

  ```
  cd zustand-query-demo
  ```
- Installing Dependencies

  ```
  pnpm install
  ```
- Running Locally

  ```
  pnpm start
  ```

## Structure

```
├── public        // Static assets such as images, fonts, and the entry HTML file
├── src           // Contains the main source code for the app.
  ├── components  // Reusable components that manage specific UI elements.
  ├── hooks       // Reusable logic and behaviors across components.
  ├── utils       // Utility functions and helpers that provide standalone pieces of logic.
  ├── pages       // Full pages in the app, typically aligned with app routes.
  ├── routes      // Configuration and components related to the app's routing system.
  ├── services    // Functions responsible for API calls and data processing related tasks.
  ├── store       // Zustand stores for state management, holding app state and actions.
  ├── types       // Data type constraints for API or function parameters or return values.
```
