# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- **Resource Management**:
  - **Delete**, **edit**, **search**, **sort**, and **paginate** resources.
- **User Profiles**:
  - Introduced a **user profile page** where users can manage their personal information.
- **Dependency Updates**:
  - Updated tailwindcss to **v4**.
  - Updated react and react-dom to **v19**.

---

## [0.2.0] – Authentication & UI Improvements

### 🚀 **User Authentication**

- Users can **register** with their email and password.
- Users can **log in** with their email and password.
- Users can **log out** securely.
- Users can **update their display name**.
- **Admin Approval System**:
  - New users must be **approved by an admin** before accessing the platform.
  - If a user is **not approved**, they will be **logged out automatically** and shown a message.
  - Admins can approve users manually via Firestore.

### 🔗 **Discord Integration**

- Resources are now **correctly sent** to the designated Discord server channel.
- When a new user registers, an automatic **notification is sent to Discord** for admin approval.

### 🎨 **UI & UX Enhancements**

- **Implemented [ShadCN](https://ui.shadcn.com/)** for improved UI consistency and design.
- **Enhanced the user info section** in the header.
  - Users now see their **profile picture** (if available).
  - A **default user icon** is shown when no profile picture is set.
- The **"Sign Out" button** is now **more visually distinct**.
- **Form Redesign**:
  - Registration and login forms are now **more visually appealing** with better spacing and layout.
  - Input fields use **ShadCN UI components** (`<Input />`, `<Button />`, `<Card />`, etc.).
  - **Added Framer Motion animations** to login and registration transitions.

### 📱 **Mobile Responsiveness Fixes**

- **Fixed layout issues** where some elements were **too wide** on mobile.
- Improved **spacing and alignment** for a **better mobile experience**.
- **Filter tags are now scrollable** (`overflow-x-auto`) to prevent them from breaking on small screens.
- **Titles are now truncated** to prevent **extra-wide cards**:

### ⚡ **Performance & Code Optimizations**

- **Refactored Resource Cards**:
  - Optimized `ResourceCard` component to **handle long titles gracefully**.
  - Fixed `TypeScript` issues related to `undefined` values in URLs.
  - Used `try-catch` to **prevent crashes from malformed URLs**.
- **Improved Skeleton Loaders**:
  - **Skeleton loaders now match final layouts** to prevent layout shifts.
  - **Tags also have skeleton placeholders** during loading.
- **Grid Improvements**:
  - Ensured that cards **don't break layout on small screens**.

### 🔥 **Dependency Changes**

- **Removed `react-loading-skeleton`**
  - Now using **custom skeleton loaders** from ShadCN.
  - Improved performance and reduced package size.
- **Added `framer-motion`** for animations.

---

## [0.1.1] – React Downgrade & Package Manager Migration

- **Downgraded React & ReactDOM**:
  - **React**: `19.0.0-rc-66855b96-20241106` → `18.3.1`
  - **ReactDOM**: `19.0.0-rc-66855b96-20241106` → `18.3.1`
  - _Reason_: Stability issues with the latest React 19 release candidate.
- **Migrated from `pnpm` to `npm`** for improved compatibility with dependencies.

---

## [0.1.0] – Initial Release 🎉

- **User Authentication**:
  - Sign up and log in using **email and password**.
  - **Persistent authentication state** to keep users logged in.
- **Resource Management**:
  - Save resources with **metadata fetching**.
  - **Tag-based** organization system for easy categorization.
  - **Filter resources by tags** for quick navigation.
- **Real-Time Features**:
  - **Live updates** with Firebase.
  - Automatic fetching of **website favicons and metadata**.
- **UI & UX Enhancements**:
  - **Responsive design** for optimal mobile and desktop experience.
  - **Toast notifications** to confirm actions.
