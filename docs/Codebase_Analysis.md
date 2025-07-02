# Codebase Analysis: Zuvy Student Dashboard

## 1. High-Level Summary

The codebase represents a **Student-Facing Learning Management System (LMS)**. It is a web application designed for students to access and interact with their course materials, track their progress, and complete assessments. The application is built using a modern frontend stack: React, TypeScript, and likely the shadcn/ui component library, styled with Tailwind CSS. It uses `react-router-dom` for navigation and `@tanstack/react-query` for state management and data fetching, although it currently relies entirely on mock data.

The architecture is component-based and follows a logical, hierarchical structure, making the codebase relatively easy to understand.

## 2. Core Features

### a. Authentication
-   A `Login` page (`/`) exists, serving as the entry point for the application. The full authentication flow and backend integration are not yet implemented.

### b. Student Dashboard (`/dashboard`)
-   This is the student's central hub after logging in.
-   **Course Listing:** Displays a list of the student's courses, which can be filtered by "Enrolled" and "Completed" status.
-   **Progress Tracking:** Each course card shows a progress bar indicating the student's completion percentage.
-   **Upcoming Events:** For enrolled courses, it shows a list of upcoming activities like live classes, assessments, or assignments, along with a countdown.
-   **CTAs:** Provides clear calls-to-action like "Start Learning" or "Resume Learning," which navigate to the respective course dashboard.

### c. Course Dashboard (`/course/:courseId`)
-   Provides a detailed view of a single course.
-   **Course Banner:** Displays key information about the course.
-   **Module Listing:** Organizes the course content into a list of modules. Each `ModuleCard` shows its progress and a relevant CTA ("Start", "Continue", "Revise").
-   **Side Panel:** Includes a "What's Next" card for upcoming items and an "Attendance Card" to show attendance statistics.

### d. Module Content View (`/course/:courseId/module/:moduleId`)
-   This is the primary interface for learning.
-   **Layout:** Features a two-column layout on desktop with a navigable `ModuleSidebar` on the left and the content rendering area on the right. It adapts to a mobile-friendly layout with a collapsible sidebar.
-   **Sequential Navigation:** "Previous" and "Next" buttons allow students to move through the content items in order.
-   **Dynamic Content Rendering:** The `ModuleContentRenderer` component dynamically displays different types of learning materials based on the selected item.

### e. Supported Content Types
The platform supports a rich variety of content formats:
-   **Video:** For video-based lessons.
-   **Reading:** For text-based articles and notes.
-   **Quiz:** Interactive multiple-choice quizzes to test understanding. The UI supports submission and immediate feedback with correct answers.
-   **Assignment:** A mechanism for students to submit work, currently via a link (e.g., GitHub repo).
-   **Coding Problem:** Integrates a dedicated `CodingProblemPage` for hands-on coding practice.
-   **Feedback Form:** A tool for collecting student feedback on modules with various input types.
-   **Assessment:** Formal, timed tests with different states:
    -   `scheduled`: Not yet started.
    -   `ongoing`: In progress.
    -   `completed`: Finished, displaying the score.
    -   `expired`: Past the deadline and missed.

## 3. Technical Stack & Architecture
-   **Framework:** React with Vite
-   **Language:** TypeScript
-   **Routing:** `react-router-dom`
-   **Data Fetching/State Management:** `@tanstack/react-query`
-   **Styling:** Tailwind CSS
-   **UI Components:** Appears to be `shadcn/ui` or a similar component library.
-   **Data:** Currently hardcoded mock data in `src/lib/mockData.ts`. No backend is connected.

## 4. Questions & Areas for Clarification

1.  **Data Source:** The entire application currently runs on mock data. What is the plan for backend integration? Is there an API specification available that I can use for future development?
2.  **Authentication Flow:** How is the login process intended to work? What authentication method will be used (e.g., JWT, OAuth)?
3.  **User Roles:** The current focus is entirely on the "student" role. Are there plans for other roles like "instructor" or "admin"? How would their dashboards and functionalities differ?
4.  **Coding Challenge Evaluation:** How are the coding challenges submitted through `CodingProblemPage` intended to be evaluated? Is there an integration with an online judge or a code execution engine planned?
5.  **Data Persistence:** How will student progress (quiz answers, video completion, assessment attempts, etc.) be persisted to the backend? `react-query` mutations would be a natural fit, but what is the expected API design?
6.  **`ContentViewer` Page:** The route `/content/:type/:contentId` points to a `ContentViewer` component. What is the purpose of this page? It seems disconnected from the course/module structure and might be for viewing standalone content. Could you clarify its use case? 