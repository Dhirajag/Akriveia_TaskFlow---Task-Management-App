# TaskFlow – Production-Level Task Management App

TaskFlow is a React Native mobile application built with **Expo**, **TypeScript**, **Zustand**, and **Expo Router**. It enables users to create, manage, filter, sort, track, and bulk-upload tasks with local persistence via **AsyncStorage**.

---

## 📱 Features

1. **Dashboard / Home**:
   - Live metrics: Total Tasks, Completed Tasks, Pending Tasks, Today's Tasks.
   - Completion progress bar.
   - Quick action shortcuts to Task List and Bulk CSV Upload.
   - Floating Action Button (`+`) to create a task.

2. **Task List**:
   - Real-time search across Title, Description, and Category.
   - Status filters (`All`, `Pending`, `Completed`).
   - Category and Priority filters (`Low`, `Medium`, `High`).
   - Sorting by `Due Date`, `Priority`, `Start Date`, or `Title` (Ascending/Descending).
   - Inline task status toggling and task deletion with confirmation modal.

3. **Add / Edit Task**:
   - Reusable `TaskForm` component with Zod validation.
   - Validation enforcement: `dueDate` cannot be earlier than `startDate`.
   - Title, Description, Category, Priority, Start Date, Due Date, and Status inputs.

4. **Task Details**:
   - Comprehensive view of task information, priority badges, and status badges.
   - Quick status toggle, edit navigation, and deletion with confirmation dialog.
   - Fallback empty state for missing/deleted task IDs.

5. **Bulk Upload Pipeline**:
   - CSV file selection via `expo-document-picker` or standard test dataset.
   - Independent CSV processing pipeline (`PapaParse` + `Zod`).
   - Row-level validation reporting.
   - Duplicate ID detection against existing tasks and within the uploaded CSV file.
   - Import Summary modal showing Total, Imported, Duplicate, and Failed counts.

6. **Settings & Themes**:
   - Centralized Light / Dark theme context toggle.
   - Destructive "Clear All Tasks" with confirmation dialog.

---

## 🏗️ Architecture & Storage Strategy

- **Presentation Layer**: Expo Router screens (`app/`).
- **Reusable Component Layer**: `src/components/common`, `src/components/task`, `src/components/dashboard`, `src/components/bulk-upload`.
- **State Management**: Zustand store (`src/features/tasks/taskStore.ts`) with memoized selectors (`src/features/tasks/taskSelectors.ts`).
- **Persistence Abstraction**: `TaskStorageService` wrapping `@react-native-async-storage/async-storage` (`@taskflow_tasks_v1`). Screens never interact directly with storage.
- **CSV Pipeline**: `csvParser.ts` -> `csvValidator.ts` -> `csvImporter.ts`.

### ⚠️ Duplicate ID Handling Strategy
During CSV import:
1. Imported records containing an `id` matching an **already existing task** in AsyncStorage are flagged as **Duplicate ID** errors.
2. Multiple records within the **same CSV** containing identical `id`s are flagged as duplicates.
3. Duplicate records are **rejected and detailed in the validation breakdown** rather than silently overwriting local tasks.
4. Manually created tasks receive auto-generated UUIDs (`TASK-XXXX`), while valid CSV tasks preserve their original IDs.

---

## 📄 CSV Format Specification

The CSV file must contain the following columns:

```csv
id,title,description,category,priority,start_date,due_date,status
TASK-101,Design Mobile Wireframes,Create low-fidelity wireframes,Design,High,2026-10-01,2026-10-05,Completed
TASK-102,Setup Zustand Store,Implement local task state management,Development,High,2026-10-02,2026-10-06,Pending
```

- **id**: Optional string identifier (auto-generated if omitted).
- **title**: Required non-empty string.
- **priority**: Must be `Low`, `Medium`, or `High`.
- **status**: Must be `Pending` or `Completed`.
- **start_date & due_date**: Formats supported `YYYY-MM-DD`, `MM/DD/YYYY`. `due_date` $\ge$ `start_date`.

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go app on iOS/Android device or emulator / Web browser

### Commands

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Type Check**:
   ```bash
   npm run type-check
   ```

3. **Start Development Server**:
   ```bash
   npx expo start
   ```

4. **Run Web Version**:
   ```bash
   npx expo start --web
   ```
