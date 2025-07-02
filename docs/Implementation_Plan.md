### **Implementation Plan: Dashboard & Content Enhancements**

#### **Goal:**
To refactor and enhance the Zuvy Student Dashboard by implementing critical UI/UX fixes and new features outlined in `docs/Feature_Requirements.md (v2)`. The primary success metric is a high-fidelity, interactive prototype that reflects all specified requirements, with a focus on state persistence, usability, and visual polish.

---

### **Phase 1: Foundations & Cleanup**

This phase addresses the core structural changes needed before any new features can be built.

**Task 1: Code & Data Scaffolding**
- **Sub-task 1.1: Remove Legacy Code**
    - **File to Edit:** `src/App.tsx`
        - Remove the route for `/content/:type/:contentId`.
    - **File to Delete:** `src/pages/ContentViewer.tsx`
- **Sub-task 1.2: Define New Component & Page Files**
    - **New Files (Placeholders):**
        - `src/pages/ProjectPage.tsx`
        - `src/pages/CodingProblemPage.tsx` 
        - `src/pages/AssessmentPage.tsx`
        - `src/pages/SolutionViewerPage.tsx`
        - `src/components/ProjectCard.tsx`
        - `src/components/ViewAllUpcomingModal.tsx`
- **Sub-task 1.3: Update Routing**
    - **File to Edit:** `src/App.tsx`
        - Add new routes for the placeholder pages created above.
- **Sub-task 1.4: Expand Mock Data & Types**
    - **File to Edit:** `src/lib/mockData.ts`
        - Add a `status` field to the `TopicItem` interface (e.g., `'not-started' | 'completed' | 'watched'`).
        - Add new fields to relevant `TopicItem` subtypes (e.g., `submissionLink` for assignments, `solutionCode` for coding problems).
        - Introduce a `type: 'project'` at the same level as `modules` in the `Course` type and create a corresponding `Project` type.
        - Add significantly more learning items to Module 2 and others to test all states.
        - Add 3-4 more questions to the Quiz data.

---

### **Phase 2: Implement Session State Management**

**Task 2: Centralize Module State**
- **Sub-task 2.1: Implement State Management Hook**
    - **File to Edit:** `src/pages/ModuleContentPage.tsx`
        - Create a state management solution (e.g., using `React.useReducer`) to hold the status and data of all learning items within the currently viewed module. This will act as our session-level "database".
- **Sub-task 2.2: Create State Update Handlers**
    - **File to Edit:** `src/pages/ModuleContentPage.tsx`
        - Create handler functions to update the item states (e.g., `handleItemCompletion`, `handleAssignmentSubmission`). These handlers will be passed down to child components.

---

### **Phase 3: Course Dashboard Enhancements**

**Task 3: Refactor the Course Dashboard**
- **Sub-task 3.1: Implement Sticky Side Panel**
    - **File to Edit:** `src/pages/CourseDashboard.tsx`
        - Use CSS to make the right-side column sticky.
- **Sub-task 3.2: Introduce Project Cards**
    - **File to Edit:** `src/pages/CourseDashboard.tsx`
        - Change title to "Course Content".
        - Update render logic to show `ProjectCard` components, which will navigate to the new `ProjectPage`.
- **Sub-task 3.3: Update Module & "What's Next" Cards**
    - **File to Edit:** `src/components/ModuleCard.tsx`
        - Redesign the "continue with" UI element.
    - **File to Edit:** `src/components/WhatsNextCard.tsx`
        - Implement logic to show a max of 5 items and the "View All" button, triggering `ViewAllUpcomingModal`.

---

### **Phase 4: Module Content Page Enhancements**

**Task 4: Implement Learning Item States & Fixes**
- **Sub-task 4.1: General Page Fixes**
    - **Files to Edit:** `src/pages/ModuleContentPage.tsx`, `src/components/ModuleSidebar.tsx`
        - Fix bottom navigation to be sticky.
        - Remove info-color highlight from sidebar.
- **Sub-task 4.2: Implement "Live Class" States**
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx`
- **Sub-task 4.3: Implement "Video" Watched State**
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx`
- **Sub-task 4.4: Implement "Assignment" States**
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx`
- **Sub-task 4.5: Implement "Quiz" & "Feedback" Enhancements**
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx`
- **Sub-task 4.6: Implement "Coding Problem" Flow**
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx`
        - Change "Start Practice" to navigate to `CodingProblemPage`.
    - **File to Edit:** `src/pages/CodingProblemPage.tsx`
        - Build out the standalone editor page.
    - **File to Edit:** `src/components/ModuleContentRenderer.tsx` (Completed State)
        - Add "Completed" state UI with "View Solution" CTA linking to `SolutionViewerPage`.

---

### **Phase 5: Assessment Flow Enhancements**

**Task 5: Overhaul the Assessment Experience**
- **Sub-task 5.1: Isolate Assessment State & Routing**
    - **File to Edit:** `src/pages/ModuleContentPage.tsx`, `src/components/AssessmentView.tsx`
        - Isolate state and navigate to `AssessmentPage`.
- **Sub-task 5.2: Build Standalone Assessment Page**
    - **File to Edit:** `src/pages/AssessmentPage.tsx`
        - Implement the full assessment flow, proctoring, etc.
- **Sub-task 5.3: Implement Re-attempt & Specific Fixes**
    - **File to Edit:** `src/components/AssessmentView.tsx`
        - Add UI for re-attempt flow and fix states for specific assessments.

---

### **Phase 6: Build Project Submission Page**

**Task 6: Implement the Project Submission Flow**
- **Sub-task 6.1: Build the Page Layout**
    - **File to Edit:** `src/pages/ProjectPage.tsx`
    - Implement layout: Title, status label, info bar, description with "Show More", and attachments section.
- **Sub-task 6.2: Implement the Submission Component**
    - **File to Edit:** `src/pages/ProjectPage.tsx`
    - Add the submission text field, CTAs, and logic to handle the "Not Submitted" vs. "Submitted" states.
- **Sub-task 6.3: Connect to Course Dashboard State**
    - **Files to Edit:** `src/pages/CourseDashboard.tsx`, `src/pages/ProjectPage.tsx`
    - A mechanism will be needed to communicate the submission status back to the Course Dashboard. A shared React Context that wraps the router seems appropriate for this prototype. 