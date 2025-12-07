To make **TravelBuddy** look professional, industry-standard, and modern, we need to move beyond basic layouts and implement a **Design System**. This approach ensures consistency, accessibility, and that "premium" feel found in apps like Airbnb, Booking.com, or Bumble.

### 2. The Design System (Foundation)

We will use an **8-point Grid System** (all margins/padding are multiples of 8) for perfect alignment.

#### A. Color Palette (Modern & Trustworthy)
We are moving away from generic colors to a sophisticated palette.
* **Primary Brand (The "Ocean"):** `#0F766E` (Deep Teal) - Used for primary buttons, active tabs, links.
* **Secondary Brand (The "Sunset"):** `#F97316` (Vibrant Orange) - Used for notifications, "Match" badges, and urgent CTAs.
* **Surface/Cards:** `#FFFFFF` (White)
* **Background:** `#F3F4F6` (Cool Light Gray) - Reduces eye strain compared to pure white.
* **Text Hierarchy:**
    * Primary: `#111827` (Near Black)
    * Secondary: `#6B7280` (Medium Gray)
    * Tertiary/Placeholder: `#9CA3AF` (Light Gray)
* **System Status:**
    * Success: `#10B981` (Emerald)
    * Error: `#EF4444` (Red)

#### B. Typography (Clean & Legible)
Use a geometric sans-serif font like **Inter**, **Plus Jakarta Sans**, or **Roboto**.
* **Display:** 32px / Bold (Headings)
* **H2:** 24px / Semi-Bold (Section Titles)
* **H3:** 18px / Medium (Card Titles)
* **Body:** 16px / Regular (Readability standard)
* **Caption:** 12px / Medium (Meta data, timestamps)

#### C. Elevation & Radius ( The "Modern" Feel)
* **Border Radius:**
    * Cards: `16px` (Smooth, modern look)
    * Buttons: `8px` or `Full Pill` (Capsule)
    * Inputs: `8px`
* **Shadows:** Do not use harsh black shadows. Use colored, diffused shadows.
    * *Example:* `box-shadow: 0 4px 6px -1px rgba(15, 118, 110, 0.1)` (Teal-tinted shadow).

---

### 3. UI Component Library (The Building Blocks)

#### Navigation (Responsive)
* **Desktop:** Clean white top bar. Logo on left. Centered "Search Pill." Right side: "My Trips," Messages icon, and Profile Avatar.
* **Mobile:** Fixed bottom navigation bar with 4 icons: *Explore (Compass), Trips (Suitcase), Inbox (Chat Bubble), Profile (User).*

#### The "Buddy Card" (Key Component)
This is the most important element. It must communicate "Person + Destination."

* **Image:** Aspect ratio 3:4 (Portrait). Corner radius 16px.
* **Overlay (Gradient at bottom):** White text over a dark gradient fade.
    * *Content:* Name, Age, Verification Badge (Blue Tick).
* **Context Badge (Floating top right):** A white pill showing the destination.
    * *Text:* "✈️ Bali (Dec 12-20)"
* **Action Area (Below Image):**
    * Left: Mutual Interests (e.g., "Hiking," "Foodie").
    * Right: Primary Action Button "Connect".

#### Forms & Inputs
* **Style:** Filled light gray background (`#F3F4F6`) that turns white with a teal border on focus.
* **Labels:** Floating labels (Material Design style) or small distinct top labels.


### 4. UX & Micro-Interactions (The "Professional" Polish)

To make it feel industry-standard, you need these specific behaviors:

1.  **Loading States (Skeletons):**
    * Never show a spinner. Show a pulsating gray "skeleton" of the card layout while data loads.
2.  **Hover States:**
    * When hovering over a Buddy Card, the image should zoom in slightly (scale 1.05), and the shadow should grow.
3.  **Empty States:**
    * If a user has no messages, do not show a blank white box. Show a vector illustration of a quiet mailbox and a button: "Find someone to talk to."
4.  **Transitions:**
    * Use smooth page transitions (fade-in, slide-up) rather than abrupt refreshes.

### 5. Accessibility & Responsiveness Checklist

* **Contrast:** Ensure the Teal text on White background passes WCAG AA standards.
* **Touch Targets:** All buttons must be at least 44px height for mobile tapping.
* **Mobile First:** The grid of cards goes from 3 columns (Desktop) -> 2 columns (Tablet) -> 1 column (Mobile).