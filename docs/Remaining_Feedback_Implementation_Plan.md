# Remaining Feedback Implementation Plan

## Goal Understanding
**Objective:** Complete all missing feedback implementations to achieve consistent UX, improved learning item interactions, enhanced navigation, and comprehensive assessment system functionality.

**Success Metrics:**
- All learning item status badges use consistent color schemes
- Course syllabus page matches dashboard styling and functionality
- Module content pages have streamlined navigation
- Assessment system provides complete user experience
- UI details match design specifications

---

## 1. Component Inventory & Updates

### 1.1 Status Badge Component System
- [x] **1.1.1** Create standardized status badge color utility function
- [x] **1.1.2** Update all learning item status badges to use new color scheme:
  - Not Submitted/Not Watched/To be Read → `bg-muted-light`
  - Submitted/Watched/Read/Completed → `bg-success-light text-success border-success`
- [x] **1.1.3** Update assessment status badges with same color scheme
- [x] **1.1.4** Remove hover states from completed/current module status chips

### 1.2 Learning Item Components Updates
- [x] **1.2.1** Update ModuleContentRenderer for all learning item types
- [x] **1.2.2** Enhanced Quiz component with Correct/Incorrect status chips (completed in Section 4.5)
- [x] **1.2.3** Update CodingProblem component to remove marks display (completed in Section 4.7)
- [x] **1.2.4** Enhanced FeedbackForm component with time field improvements (completed in Section 4.6)
- [x] **1.2.5** Update Assignment component with improved error positioning (completed in Section 4.4)

### 1.3 Assessment System Components
- [x] **1.3.1** Update AssessmentInstructions component layout and styling
- [x] **1.3.2** Create enhanced AssessmentResults component
- [x] **1.3.3** Update AssessmentStateCard component with new color schemes
- [x] **1.3.4** Create submission counter component for assessment categories

---

## 2. Mock Data Structure Updates

### 2.1 Assessment Data Enhancements
- [x] **2.1.1** Add time components to assessment start/end dates
- [x] **2.1.2** Add test case results data for coding problems (3 pass, 3 fail)
- [x] **2.1.3** Add completion tracking for assessment categories
- [x] **2.1.4** Add attendance duration data for live classes

### 2.2 Learning Item Status Tracking
- [x] **2.2.1** Add 70% watch threshold tracking for videos
- [x] **2.2.2** Add quiz answer correctness tracking
- [x] **2.2.3** Add submission state tracking for all learning items

---

## 3. Page-Level Changes

### 3.1 Course Syllabus Page Overhaul
- [x] **3.1.1** Replace course info card with CourseInfoBanner component
- [x] **3.1.2** Update syllabus section heading style
- [x] **3.1.3** Update module section styling
- [x] **3.1.4** Update topic title styling
- [x] **3.1.5** Update learning item labels and styling
- [x] **3.1.6** Progress bar included in CourseInfoBanner

### 3.2 Module Content Page Updates  
- [x] **3.2.1** Remove back/next bottom navigation completely
- [x] **3.2.2** Update Live Class status colors and attendance duration (completed in Section 4.1)
- [x] **3.2.3** Update Video watched threshold and status colors (completed in Section 4.2)
- [x] **3.2.4** Update Article status colors (completed in Section 4.3)
- [x] **3.2.5** Update Assignment error positioning and status colors (completed in Section 4.4)
- [x] **3.2.6** Update Quiz interface with new CTA and question styling (completed in Section 4.5)
- [x] **3.2.7** Update Feedback form interface and time field (completed in Section 4.6)
- [x] **3.2.8** Update Coding Problem interface and remove marks (completed in Section 4.7)

### 3.3 Assessment Pages Overhaul
- [x] **3.3.1** Update assessment instructions page header layout
- [x] **3.3.2** Add assessment category completion tracking
- [x] **3.3.3** Update individual assessment styling per feedback
- [x] **3.3.4** Create new View Results page layout
- [x] **3.3.5** Update date formats throughout (DD Month YYYY)

### 3.4 Course Content Updates
- [x] **3.4.1** Move project status to top-left like modules
- [x] **3.4.2** Update attendance modal font to Manrope 18px bold

---

## 4. Learning Item Specific Updates

### 4.1 Live Class Updates
- [x] **4.1.1** Change Scheduled status to muted light background
- [x] **4.1.2** Change Live/Completed status to success light background
- [x] **4.1.3** Update to "Your Attendance Duration" for completed classes
- [x] **4.1.4** Format dates as "DD Month YYYY at HH:MM (AM/PM)"

### 4.2 Video Updates
- [x] **4.2.1** Change "Not Watched" status to muted light background
- [x] **4.2.2** Change "Watched" status to success light background
- [x] **4.2.3** Set watched status at 70% completion threshold

### 4.3 Article Updates
- [x] **4.3.1** Change "To be Read" status to muted light background
- [x] **4.3.2** Change "Read" status to success light background

### 4.4 Assignment Updates
- [x] **4.4.1** Move error messages below text field
- [x] **4.4.2** Change "Not Submitted" status to muted light background
- [x] **4.4.3** Change "Submitted" status to success light background

### 4.5 Quiz Updates
- [x] **4.5.1** Change question text to regular font weight
- [x] **4.5.2** Change CTA label to "Submit Quiz"
- [x] **4.5.3** Add "Correct"/"Incorrect" status chips right-aligned
- [x] **4.5.4** Change status colors to standard scheme

### 4.6 Feedback Form Updates
- [x] **4.6.1** Change question text to regular font weight
- [x] **4.6.2** Change CTA label to "Submit Feedback"
- [x] **4.6.3** Update time field with internal clock icon
- [x] **4.6.4** Change status colors to standard scheme

### 4.7 Coding Problem Updates
- [x] **4.7.1** Remove marks/point system completely
- [x] **4.7.2** Change status to "Not Submitted"/"Submitted"
- [x] **4.7.3** Center-align submitted status text
- [x] **4.7.4** Format test cases and submission time in same line
- [x] **4.7.5** Change CTA to "View Results"

---

## 5. Coding Problem Compiler Page Updates

### 5.1 Interface Updates
- [x] **5.1.1** Remove marks from description
- [x] **5.1.2** Remove "coding challenge" text from top right
- [x] **5.1.3** Move "Run Code" and "Submit" buttons to top right
- [x] **5.1.4** Change "Run Code" button to secondary color
- [x] **5.1.5** Add submission confirmation dialog

---

## 6. View Results Page Redesign

### 6.1 Layout Changes
- [x] **6.1.1** Remove top status card and navigation buttons
- [x] **6.1.2** Remove test passed chip from header
- [x] **6.1.3** Remove problem description section
- [x] **6.1.4** Create two-column layout: student code (left) + test results (right)

### 6.2 Test Results Display
- [x] **6.2.1** Show 3 passed and 3 failed test cases
- [x] **6.2.2** Use success light background for passed cases
- [x] **6.2.3** Use destructive light background for failed cases
- [x] **6.2.4** Make test results scrollable while keeping code fixed

---

## 7. Assessment System Overhaul

### 7.1 General Assessment Updates
- [x] **7.1.1** Standardize all assessment status colors
- [x] **7.1.2** Update all date formats to "DD Month YYYY"
- [x] **7.1.3** Update assessment state cards with new color schemes

### 7.2 Assessment Instructions Interface
- [x] **7.2.1** Remove assessment name from header center
- [x] **7.2.2** Move time remaining to header right
- [x] **7.2.3** Remove start date from header strip
- [x] **7.2.4** Add muted light background to marks status chips
- [x] **7.2.5** Show "Submitted" status instead of "Completed"
- [x] **7.2.6** Add separator before Submit Assessment button
- [x] **7.2.7** Add completion counter for each category

### 7.3 Individual Assessment Styling
- [x] **7.3.1** DOM Concepts: info light background, h6 text
- [x] **7.3.2** JavaScript Fundamentals: success border, success CTA
- [x] **7.3.3** Event Handling: destructive border, destructive CTA
- [x] **7.3.4** DOM Manipulation: destructive light background, h6 text
- [x] **7.3.5** JavaScript Advanced: warning light for interrupted status
- [x] **7.3.6** React Patterns: add time to dates, update styling

---

## 8. UI Detail Improvements

### 8.1 Modal and Scroll Improvements
- [x] **8.1.1** Hide scroll bars in What's Next modal
- [x] **8.1.2** Hide scroll bars in Attendance modal
- [x] **8.1.3** Update attendance modal class names to Manrope font

### 8.2 Text and Sizing Updates
- [x] **8.2.1** Update various text sizes to match specifications
- [x] **8.2.2** Remove background rectangles from status texts
- [x] **8.2.3** Update font weights and alignments per feedback

---

## Execution Order Priority

**Phase 1: Foundation (Tasks 1-2)**
- Component inventory and mock data updates
- Status badge standardization

**Phase 2: Core Pages (Task 3)**
- Course syllabus page overhaul
- Module content page updates

**Phase 3: Learning Items (Task 4)**
- All learning item specific updates
- Status color implementations

**Phase 4: Assessment System (Tasks 5-7)**
- Coding problem updates
- View results redesign
- Assessment system overhaul

**Phase 5: Polish (Task 8)**
- UI detail improvements
- Final styling touches

---

## Potential Blockers & Questions

1. **Video Watch Tracking:** How should the 70% watch threshold be implemented? Should it track actual viewing time or just seek position?
It should be just seek position. Actual viewing time is not feasible for prototype purposes

2. **Assessment Results Data:** Do we need to create realistic test case failure scenarios for the coding problems?
Not realisitc comppletely. As we allow the student to submit with just the sample code in the editor so it is for prototype purposes

3. **Font Integration:** Should Manrope font be added to the project or should we use existing font-family classes?
Isn't Manrope already being used for body text. If not add it to the project. Manrope is for all text other than headings. Headings are in Outfit font

4. **Date Formatting:** Should we create a utility function for the "DD Month YYYY" format or implement inline?
I am not sure on this. Implement the one that is more efficient and modular in nature. For eg., if we ever want to change the date format in future, it changes the date format wherever date is shown

5. **Link Routing:** For course syllabus learning item links, should they navigate to the specific learning item or just the module page?
Should navigate to the specific learning item

---

## Success Criteria Checklist

- [x] All status badges use consistent color scheme
- [x] Course syllabus page matches course dashboard styling
- [x] Learning items have proper navigation and status updates
- [x] Assessment system provides complete user experience
- [x] UI details match exact specifications from feedback
- [x] All text formatting and sizing matches requirements
- [x] Modal interactions work smoothly with hidden scrollbars
- [x] Date formats are consistent throughout the application 