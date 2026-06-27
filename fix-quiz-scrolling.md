# Fix: Scrollable Questions Container on QuizPage

## Problem

The `quiz.questions` container won't scroll — the entire page grows instead of constraining the question list to the available viewport height.

## Root Cause

A flex item with `flex-grow`  **cannot shrink below its content size** by default (`min-height: auto`). This means every `flex-grow` in the chain expands to fit its children, never constraining them, so `overflow-y: auto` never triggers.

The layout chain looks like this:

```
<body max-h-screen overflow-hidden>          ✅ height clamped
  <main flex-1 flex-grow>                    ❌ no min-h-0
    <div flex-1 flex-col pt-20 flex-grow>    ❌ no min-h-0
      <QuizPage>                             
        <div flex flex-col flex-grow>        ❌ no min-h-0
          [...header...]
          <div overflow-y-auto flex-grow>    ❌ parent never constrains it
```

Without `min-h-0` on each level, every `flex-grow` item expands to fit content, defeating the scroll.

## Fix

Add `min-h-0` (Tailwind) at each level so flex items can shrink and pass down the height constraint. **Also `h-0` works as a universal flex shrink trick.**

### Step 1: Instructor layout — constrain the content area

**File:** `app/(pages)/instructor/layout.tsx`

Add `min-h-0` to the content wrapper div (line 14):

```tsx
// BEFORE
<div className="flex flex-1 flex-col pt-20 px-8 py-6 flex-grow">

// AFTER
<div className="flex flex-1 flex-col pt-20 px-8 py-6 flex-grow min-h-0">
```

### Step 2: QuizPage outer wrapper — constrain the section

**File:** `app/(pages)/instructor/quizzes/[id]/QuizPage.tsx`

Add `min-h-0` to the outer div (line 37):

```tsx
// BEFORE
<div className="flex flex-col flex-grow">

// AFTER
<div className="flex flex-col flex-grow min-h-0">
```

### Step 3: Questions container — make it scroll

**File:** `app/(pages)/instructor/quizzes/[id]/QuizPage.tsx`

Change the questions wrapper (line 111) to:

```tsx
// BEFORE
<div className="mt-8 overflow-y-auto flex flex-col flex-grow">

// AFTER
<div className="mt-8 overflow-y-auto flex flex-col flex-grow min-h-0">
```

### Step 4 (optional): Remove duplicate `flex-grow`

The instructor layout and QuizPage use both `flex-1` and `flex-grow`, which are redundant. `flex-1` already includes `flex-grow: 1`. You can simplify:

- `flex-1 flex-grow` → `flex-1`

## Why This Works

```
<body max-h-screen overflow-hidden>          ✅ fixed height
  <main flex-1 min-h-0>                      ✅ can shrink
    <div flex-1 flex-col min-h-0>            ✅ can shrink
      <QuizPage>
        <div flex flex-col flex-grow min-h-0> ✅ constrained
          [...header...]                     ← takes natural height
          <div overflow-y-auto flex-grow min-h-0>  ✅ scrolls!
```

Each `min-h-0` allows the flex item to shrink below its content, passing the viewport height constraint down the chain. The questions container then knows its exact max height, and `overflow-y: auto` kicks in.
