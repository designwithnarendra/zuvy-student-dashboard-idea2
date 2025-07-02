# Requirements: Dashboard & Content Enhancements (v2)

## 1. Overview

This document outlines the required fixes and feature enhancements for the Zuvy Student Dashboard. The primary goals are to improve the user experience by providing clearer feedback on progress, ensuring state persists within a browser session, and polishing the UI for key learning components.

---

## 2. General & Cross-Cutting Changes

### Task 1.1: Implement Session-Based State Persistence
-   **Problem:** User actions (e.g., submitting a quiz) are lost on page refresh or when navigating away from a module.
-   **Requirement:** User progress within a learning module must persist for the duration of the browser session. State changes (like a "submitted" status) should be managed so that if a user navigates to another item and back, their progress is not lost. A full browser refresh can reset the state.

### Task 1.2: Remove Legacy `ContentViewer` Page
-   **Problem:** The `/content/:type/:contentId` route and `ContentViewer` component are unused legacy code.
-   **Requirement:** To clean up the codebase, delete `src/pages/ContentViewer.tsx` and remove its corresponding route from `src/App.tsx`.

### Task 1.3: Expand Mock Data
-   **Problem:** The current mock data is insufficient to demonstrate all required UI states and features.
-   **Requirement:** Expand the mock data in `src/lib/mockData.ts` to include enough items (live classes, assignments, assessments, videos, etc.) across various modules to populate the "What's Next" and "Attendance" cards meaningfully and to allow for testing all new UI states.

---

## 3. Course Dashboard Page (`/course/:courseId`)

### Task 2.1: Enhance Layout and Interaction
- **Requirement:** On scrolling, the right-side panel containing "What's Next" and "Attendance" cards should become fixed/sticky after the top `CourseInfoBanner` has scrolled out of view. The "Course Content" list on the left should scroll independently.

### Task 2.2: Refactor "Course Modules" to "Course Content" & Add Projects
- **Requirement 1:** Change the section title from "Course Modules" to "Course Content".
- **Requirement 2:** Introduce a new "Project" card type that will appear at the same level as modules.
- **Project Card Design:**
    - It should not have a progress bar.
    - It will display a title, description, and submission status (e.g., "Not Submitted", "Submitted").
    - It will have a "View Project" CTA that will eventually link to a new project-specific page.

### Task 2.3: Enhance "ModuleCard" UI
- **Problem:** The text indicating the student's next item is not distinct from the module description.
- **Requirement:** Redesign the "continue with" element to be more prominent. It should clearly state what the next item is and its type (e.g., "Next up: Video - DOM Introduction").

### Task 2.4: Enhance "What's Next" Card
- **Requirement 1:** The card's height should adjust based on the number of items, appearing shorter for 1-2 items.
- **Requirement 2:** Display a maximum of five upcoming items (from the current day to the next 6 days).
- **Requirement 3:** If more than five items are scheduled, display a "View All Upcoming Items" link button.
- **Requirement 4:** Clicking "View All" should open a modal with a scrollable list of all upcoming items, styled similarly to the "View Full Attendance" modal.

### Task 2.5: Enhance "Attendance" Card
- **Requirement:** Ensure the attendance statistics are derived from the expanded mock data, reflecting a history of at least 7 past live classes with varied statuses (Present, Absent).

---

## 4. Module Content Page (`/course/:courseId/module/:moduleId`)

### 4.1. General Page Fixes
- **Task 4.1.1:** **Fix Sidebar Highlight:** When a user selects a learning item in the left sidebar, the highlight color should remain the default. Remove the temporary info (blue) color change.
- **Task 4.1.2:** **Make Bottom Navigation Sticky:** The bottom navigation bar containing "Previous" and "Next" buttons must be fixed to the bottom of the viewport, ensuring the main content scrolls underneath it.

### 4.2. Learning Item: Live Class
- **Scheduled State:**
    - The card stating "Class starts in..." should be more compact (approx. 56px height) and stretch to the container's full width.
    - Below this card, display text with a recording icon: "Class recording will be available after the class."
- **In-Progress State:**
    - From 10 minutes before the start time until the class ends, replace the "Class starts in..." card with a prominent "Join Class" CTA button in the center. The recording message below can remain.
    - Clicking "Join Class" should simulate joining and transition the item to the "Completed" state.
- **Completed State:**
    - The design should show the available class recording (as is currently implemented).

### 4.3. Learning Item: Video
- **Requirement 1:** The video player should load the YouTube video: `https://youtu.be/DrAZf4ZHqaM`.
- **Requirement 2:** Implement a "watched" state. When the user views the content at the end of the video (even by fast-forwarding), the top-right status label should change from "Not watched" to "Watched".

### 4.4. Learning Item: Article
- **Requirement:** On clicking "Mark as Read," the item should permanently change to the "Read" state.

### 4.5. Learning Item: Assignment
- **Not Submitted State:**
    - The submission input field must be editable, allowing users to type or paste a link.
    - The "Submit Assignment" CTA must always be visible.
    - Clicking the CTA without content in the field should trigger a validation error (e.g., "Please paste a submission link").
- **Submitted State:**
    - On successful submission, the top-right status label changes to "Submitted".
    - The input field is replaced with a read-only view displaying "Your Submission" and the submitted link as text.
    - A "Resubmit Assignment" CTA should appear, which, when clicked, reverts the component to the "Not Submitted" state (this can be done until the due date).

### 4.6. Learning Item: Quiz
- **Requirement:** Add 3-4 more questions to the quiz's mock data.
- **Not Completed State:** Increase the vertical gap between answer options (radio buttons) to 16px.
- **Completed State:**
    - Change the top-right status label to "Completed".
    - Add a success-colored card at the top saying, "You have submitted the quiz successfully."
    - Highlight correct answers (radio button and text) with a success color.
    - Highlight incorrect answers with a destructive color.
    - For questions answered incorrectly, display the correct answer below the options.
    - Remove the "Submit" CTA.

### 4.7. Learning Item: Feedback Form
- **Not Completed State:**
    - Add a "Not Completed" status label to the top right.
    - Increase the vertical gap between answer options to 16px.
    - Prevent form submission until all questions have been answered.
- **Completed State:**
    - On submission, change the top-right label to "Completed".
    - Display the success card ("Your feedback has been submitted...") with a 16px top margin to distance it from the title.
    - Remove the "Submit" CTA.

### 4.8. Learning Item: Coding Problem
- **Not Completed State:**
    - Clicking "Start Practice" must open the code editor/compiler in a **completely new, separate page**, outside the module content layout.
    - Allow simulation of "Run Code" with dummy output.
    - On clicking "Submit", the user should be returned to the module content page, and the problem's state should change to "Completed".
- **Completed State:**
    - The top-right status label should change to "Completed".
    - Display a brief outcome summary (e.g., "Success: 5/5 test cases passed" or "Failure: 3/5 test cases passed").
    - The CTA changes to "View Solution".
- **View Solution Page:**
    - Clicking "View Solution" opens another **new, separate page** showing the problem brief on the left and the user's submitted code (read-only) and test case results on the right. An exit/close button should return the user to the module content page.

---

## 5. Assessments

### 5.1. General Assessment Fixes & Enhancements
- **Task 5.1.1:** **Fix State Bleeding:** The state of one assessment must not carry over to another when navigating between them in the sidebar. Each assessment must manage its state independently.
- **Task 5.1.2:** **Implement Separate Assessment Page:** Clicking "Begin Assessment" must open the entire assessment experience (proctoring rules, questions) in a **new, separate page**, independent of the module content layout.
- **Task 5.1.3:** **Add Static Scheduled State:** Create a new assessment item that only shows the "scheduled" state with a static timer to demonstrate this UI without a full flow.

### 5.2. Proctoring Rules
- **Task 5.2.1:** **Implement Proctoring Logic:** Ensure that violations (full-screen exit, copy-paste, tab switching) are correctly detected. The full-screen exit detection needs to be fixed.
- **Task 5.2.2:** **Implement Auto-Submission:** After 3 violations of any kind, the assessment must automatically submit with the current progress, and the user is taken to the results page.

### 5.3. Assessment Question Types
- **Coding Challenges:**
    - Follows the same "separate page" logic as the standalone Coding Problem for the editor.
    - On submission, the card on the assessment question list should show a status ("Test Cases Passed/Failed") and a "View Solution" CTA.
- **MCQs:**
    - On submission, a message at the top should state the number of correct/wrong answers.
    - The CTA on the card should change to "View Answers".
- **Open-ended Questions:**
    - These are ungraded. On submission, the card gets a "Completed" status and a "View Answers" CTA leading to a read-only view of the student's answer.

### 5.4. Final Assessment Submission & Results
- **Requirement 1:** The main "Submit Assessment" button on the assessment page ends the attempt.
- **Requirement 2:** The user is returned to the module content page, where the assessment now shows its final "Completed" state (pass or fail).
- **Requirement 3:** Clicking "View Results" on the completed assessment opens the assessment page again, this time showing a submission confirmation and the list of questions in their final, read-only "completed" states.

### 5.5. Re-attempt Flow
- **Interrupted State:** Create an assessment state that shows an info card: "Your assessment attempt was interrupted" with a "Request Re-attempt" CTA.
- **Waiting State:** Clicking the CTA transitions the assessment to a waiting state with the message: "Your re-attempt request has been sent..."
- **Approval Simulation:** To simulate approval, clicking on the waiting state card will reset the assessment back to its initial "Begin Assessment" state.

### 5.6. Fixes for Specific Assessments
- **JavaScript Fundamentals Assessment:**
    - Correctly display this in the "completed with pass score" state. Remove the redundant "You have completed this assessment" text and ensure the results page is functional.
- **Event Handling Assessment:**
    - Correctly display this in the "completed with failed score" state. Remove redundant text and ensure the results page is functional.
- **DOM Manipulation Final Test:**
    - Correctly display this in the "not attempted and expired" state. Remove the redundant "This assessment has ended" text.

---

## 6. New Page: Project Submission Page (`/project/:projectId`)

### Task 6.1: Project Page Layout & Functionality
- **Trigger:** Clicking the "View Project" CTA on a `ProjectCard` from the Course Dashboard.
- **Layout:**
    - The page should open as a new, standalone page.
    - **Header:** Display the project title with a status label on the top right (e.g., "Not Submitted", "Submitted").
    - **Info Bar:** Show an info row with the project's due date and time.
    - **Description:** Display the project description. If it exceeds 15 lines, it should be truncated with a "Show Full Description" link to expand it.
    - **Attachments:** Include a section to display any file attachments related to the project.
- **Submission Flow (similar to Assignment):**
    - **Not Submitted State:** Display a text input field for the project submission link and a "Submit Project" CTA.
    - **Submitted State:** On submission, change the page's status label to "Submitted". Replace the input field with a read-only view of the submitted link. Provide a "Resubmit Project" CTA.
- **Interaction with Course Dashboard:**
    - On successful submission, the corresponding `ProjectCard` on the Course Dashboard should update its status to "Completed" and its CTA to "View Solution". 