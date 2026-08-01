# HMS Frontend Design Guide

This document defines the visual language and page-creation rules for the HMS Frontend. The Todo page (`src/pages/crm/TodoPage.tsx` and `src/components/dashboard/DashboardTab.tsx`) is the primary reference implementation.

## Design direction

The product should feel like a calm, premium healthcare CRM: structured enough for operational work, but spacious and approachable. Prefer neutral surfaces, restrained color, compact information density, and clear task hierarchy over decorative UI.

The interface is built around:

- A light gray application canvas with a white content shell.
- Zinc neutrals for text, borders, hover states, and supporting surfaces.
- Blue as the main interactive/accent color.
- Green for positive or completed states.
- Amber, orange, or red only for priority and warning meaning.
- Rounded corners, subtle borders, and light shadows rather than heavy panels.
- Geist Sans for interface text; use the existing typography system instead of introducing another font.

## Application shell

Every standard page should use the existing `AppLayout` structure:

1. Full-height outer canvas: `#f6f6f6` in light mode and `zinc-900` in dark mode.
2. Persistent left sidebar, approximately `18rem` wide when expanded and icon-only when collapsed.
3. Main content shell with a small outer gap, white/dark surface, large rounded corners (`rounded-4xl`), and a subtle ring/shadow.
4. Shared `SiteHeader` at the top of the shell. Keep the header sticky, approximately `64px` high, with a bottom border and translucent backdrop.
5. Page content below the header. Use the existing layout padding conventions; dashboard-like pages may extend edge-to-edge while ordinary pages use horizontal page padding.

Do not build a second sidebar, header, breadcrumb system, or page shell for a new page. Add the page to the existing navigation and let `SiteHeader` provide the current-page context.

## Page anatomy

Use this order for most new pages:

1. Page heading: short, action-oriented title in roughly `30px`, bold, tight tracking.
2. Supporting description: one concise sentence in `14px` muted text.
3. Primary workspace: table, board, form, calendar, or profile content.
4. Workspace toolbar: view switcher, search, filters, secondary actions, then the primary action on the right.
5. Empty, loading, and error states inside the same workspace surface.

Keep the content width fluid, with a sensible maximum where the page benefits from readable line length. Use responsive stacking at small widths rather than allowing controls to overflow horizontally.

## Todo page reference

The Todo page establishes the expected page rhythm and interaction model.

### Header area

- Start with a welcome/title block and a brief description.
- Leave a generous vertical gap before the task workspace.
- Use member avatars and an `Invite` outline button as contextual collaboration controls.
- Keep the title and supporting copy left-aligned; keep collaboration/actions right-aligned on larger screens.

### Workspace controls

- Place view tabs (`Kanban View`, `Calendar View`) on a thin bottom border.
- Active tabs use blue text and a `2px` blue bottom rule.
- Inactive tabs use muted zinc text and become darker on hover.
- Filters are compact and use rounded controls. Active filters become removable pills.
- The main action is a blue `Create Task` button with a plus icon. It may use the existing glossy gradient treatment, but the label and icon must remain highly legible.
- When filters affect behavior, explain the limitation with a small muted hint instead of silently changing interaction.

### Kanban board

- Use four equal columns at extra-large widths: `To Do`, `On Process`, `On Review`, and `Completed`.
- Collapse to two columns at medium widths and one column on narrow screens.
- Keep consistent column gaps, approximately `24px`.
- Column headers contain a small status dot, bold title, task count pill, and add-task affordance.
- Empty columns use a dashed border and a short muted message.
- Cards should remain visually quieter than the page heading and toolbar.

### Task cards

Each task card should include, in this priority order:

1. Due date row and overflow menu.
2. Task title, bold and easy to scan.
3. One- or two-line description, muted and clamped.
4. Milestone/progress indicator where relevant.
5. Assignee avatars.
6. Priority badge and lightweight attachment/comment counts.

Cards use a white/dark surface, a subtle border, approximately `12px` radius, and a light shadow that becomes slightly stronger on hover. Make the whole card clickable when it opens details, and preserve a visible keyboard focus state.

### Details and collaboration

- Open task details in a right-side sheet/drawer instead of navigating away from the board.
- Keep the drawer structured into a compact summary area and a scrollable detail/activity area.
- Use a bordered header with previous/next controls, task position, and close action.
- Use rounded action buttons; reserve filled green for a positive primary status action.
- Use avatars, labels, metadata, and activity rows to make ownership and history obvious.
- Invite flows use a modal with a clear title block, email input, role select, primary action, and a member list.

## Color and state rules

Use existing Tailwind/shadcn tokens and existing zinc values whenever possible.

| Purpose | Light mode | Dark mode | Usage |
| --- | --- | --- | --- |
| App canvas | `#f6f6f6` | `zinc-900` | Outside the main shell |
| Main surface | `white` | `zinc-950` | Page and cards |
| Secondary surface | `zinc-50` | `zinc-900` | Inputs, filters, soft controls |
| Primary text | `zinc-900` | `zinc-100` | Headings and important values |
| Muted text | `zinc-500` | `zinc-400` | Descriptions and metadata |
| Border | `zinc-200` | `zinc-800` | Dividers and controls |
| Primary action | blue `600` | blue `500/600` | Active tabs, CTAs, links |
| Positive state | emerald `600` | emerald `500/600` | Completed/success states |

Color must communicate meaning. Do not use saturated colors for large backgrounds or decoration. Priority colors should be paired with text or an icon, not communicated by color alone.

## Typography

- Use Geist Sans throughout the product.
- Page titles: bold, tight tracking, approximately `30px`.
- Section/card titles: semibold or bold, approximately `14-16px`.
- Body/supporting copy: `13-14px` with comfortable line height.
- Metadata, labels, and counts: `10-12px`; uppercase tracking is appropriate for short labels only.
- Keep text contrast strong for headings and intentionally muted for secondary information.

## Components and spacing

- Prefer existing components from `src/components/ui` such as `Button`, `Badge`, `Card`, `Avatar`, `Dialog`, `Sheet`, `Input`, `Select`, `Tabs`, and `Table`.
- Use consistent corner radii: small controls around `8-12px`, cards around `12-16px`, major surfaces around `24-40px`.
- Use a spacing rhythm based on Tailwind units: `8px` for tight control gaps, `12-16px` inside cards, `24px` between related groups, and `32px+` between page sections.
- Use icons from the project's existing Lucide/Phosphor icon libraries. Icons should clarify an action or category, not replace an important text label.
- Use `cn()` for conditional classes and keep light/dark styles together in the same class expression.

## Installed component catalog

Use this catalog before creating a new component. Existing components are grouped by their source folder and should be preferred over duplicating similar markup.

### Shared application components

| Component | File | Use for |
| --- | --- | --- |
| `AppLayout` | `src/layouts/AppLayout.tsx` | Standard page shell, sidebar, header, and content area |
| `AppSidebar` | `src/components/AppSidebar.tsx` | Primary navigation, role-filtered menu, collapsed navigation |
| `SiteHeader` | `src/components/SiteHeader.tsx` | Breadcrumb, notifications, profile menu, theme and global actions |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Light/dark theme switching |

### Base UI components

These are the reusable shadcn-style primitives in `src/components/ui`.

| Component | File | Use for |
| --- | --- | --- |
| `Avatar` | `avatar.tsx` | User, doctor, nurse, patient, or team identity |
| `Badge` | `badge.tsx` | Status, priority, category, and count labels |
| `Breadcrumb` | `breadcrumb.tsx` | Hierarchical page navigation when the shared header is insufficient |
| `Button` | `button.tsx` | Primary, secondary, outline, ghost, destructive, and icon actions |
| `Calendar` | `calendar.tsx` | Date selection and calendar controls |
| `Card` | `card.tsx` | Grouped content with a surface, border, and heading hierarchy |
| `Checkbox` | `checkbox.tsx` | Boolean settings, multi-select, and task completion |
| `Collapsible` | `collapsible.tsx` | Expandable sections and progressive disclosure |
| `Combobox` | `combobox.tsx` | Searchable single or multi-option selection |
| `Dialog` | `dialog.tsx` | Modal forms, confirmation, invite, and focused workflows |
| `DropdownMenu` | `dropdown-menu.tsx` | Context menus, profile actions, and compact action lists |
| `Field` | `field.tsx` | Form field layout, labels, descriptions, and validation structure |
| `Frame` | `frame.tsx` | Framed visual/content regions where a standard card is not appropriate |
| `Input` | `input.tsx` | Single-line text, email, search, and numeric entry |
| `Item` | `item.tsx` | Reusable list/menu item structure |
| `Label` | `label.tsx` | Accessible form labels |
| `Pagination` | `pagination.tsx` | Moving through long tables or result lists |
| `Popover` | `popover.tsx` | Lightweight contextual content, filter panels, and pickers |
| `Progress` | `progress.tsx` | Completion, utilization, and milestone progress |
| `Select` | `select.tsx` | Compact single-option selection |
| `Separator` | `separator.tsx` | Visual or semantic section dividers |
| `Sheet` | `sheet.tsx` | Side drawers such as Todo task details |
| `Sidebar` | `sidebar.tsx` | Sidebar provider, inset, menu, and responsive navigation primitives |
| `Skeleton` | `skeleton.tsx` | Loading placeholders matching final content geometry |
| `Spinner` | `spinner.tsx` | Small inline or button loading state |
| `Table` | `table.tsx` | Structured records, metrics, and admin data |
| `Tabs` | `tabs.tsx` | Switching between views without leaving the page |
| `Textarea` | `textarea.tsx` | Notes, descriptions, comments, and long-form input |
| `Tooltip` | `tooltip.tsx` | Explanations for icon-only or unfamiliar controls |

### Reusable enhanced components

These components live under `src/components/reui` and are intended for richer data and workflow interfaces.

| Component | File | Use for |
| --- | --- | --- |
| `Alert` | `reui/alert.tsx` | Inline informational, warning, success, or error feedback |
| `Badge` | `reui/badge.tsx` | Enhanced status and label presentation when base `Badge` is insufficient |
| `Filters` | `reui/filters.tsx` | Filter bars, filter groups, and removable active filters |
| `Kanban` | `reui/kanban.tsx` | Drag-and-drop boards, columns, items, and overlays |
| `DataGrid` | `reui/data-grid/data-grid.tsx` | Interactive data-grid state and configuration |
| `DataGridTable` | `reui/data-grid/data-grid-table.tsx` | Rendered data-grid table |
| `DataGridColumnHeader` | `reui/data-grid/data-grid-column-header.tsx` | Sortable/filterable grid headers |
| `DataGridPagination` | `reui/data-grid/data-grid-pagination.tsx` | Data-grid paging controls |

### Dashboard and healthcare components

These are domain components that can be reused when building CRM, patient, doctor, nurse, or reporting pages.

| Component | File | Use for |
| --- | --- | --- |
| `DashboardTab` | `dashboard/DashboardTab.tsx` | Todo/Kanban reference experience and task detail workflows |
| `DashboardTab` exports | `dashboard/index.ts` | Public dashboard component entry point |
| Dashboard shared components | `dashboard/components.tsx` | Cards, charts, tables, metrics, category cards, and visual summaries |
| `CustomGauge` | `dashboard/CustomGauge.tsx` | Circular KPI or health metric gauge |
| `WeeklyHealthCharts` | `dashboard/WeeklyHealthCharts.tsx` | Weekly health trends and chart summaries |
| `PatientTab` | `dashboard/PatientTab.tsx` | Patient dashboard overview |
| `DocumentsTab` | `dashboard/DocumentsTab.tsx` | Document summaries and document activity |
| `ReviewsTab` | `dashboard/ReviewsTab.tsx` | Reviews and feedback summaries |
| `TeamTab` | `dashboard/TeamTab.tsx` | Team/member summaries |
| `PatientGrid` | `dashboard/patients/PatientGrid.tsx` | Card/grid view of patients |
| `PatientTable` | `dashboard/patients/PatientTable.tsx` | Tabular patient records |
| `PatientProfile` | `dashboard/patients/PatientProfile.tsx` | Patient detail profile |
| `PatientInsights` | `dashboard/patients/PatientInsights.tsx` | Patient metrics and insight panels |
| `DoctorProfileView` | `doctors/DoctorProfileView.tsx` | Doctor profile detail view |
| `NurseProfileView` | `nurse/NurseProfileView.tsx` | Nurse profile detail view |

Use domain components as composed building blocks; do not copy their internal card, table, avatar, or status patterns into a new page unless the new page genuinely needs different behavior.

## Installed libraries and their UI role

The project already includes the following libraries. Use the existing library for its intended job instead of adding a competing dependency.

| Library | Role in the product |
| --- | --- |
| `react`, `react-dom` | Application and component rendering |
| `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` | Utility styling, theme tokens, and animation utilities |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variant classes and safe class composition |
| `@base-ui/react`, `radix-ui` | Accessible headless UI behavior used by primitives |
| `@phosphor-icons/react` | Navigation and expressive product icons |
| `lucide-react` | Compact action, status, and utility icons |
| `motion` | Small purposeful transitions and layout animation |
| `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | Drag-and-drop task and board interactions |
| `@tanstack/react-table` | Sortable, filterable, configurable data tables |
| `react-day-picker`, `calendarkit-pro`, `date-fns` | Date picking, calendar experiences, and date formatting |
| `recharts` | Responsive charts and analytics visualizations |
| `@fontsource/geist-sans` | Primary interface font |
| `@fontsource/geist-mono` | Optional technical or code-like supporting text |

## Component selection rules

- Use `Button` for actions; use `Link`-style text only for navigation or low-emphasis inline actions.
- Use `Dialog` for focused modal workflows and `Sheet` for record inspection or contextual editing.
- Use `Popover` for a small contextual panel and `DropdownMenu` for a menu of commands.
- Use `Tabs` for stable view changes such as Todo's Kanban/Calendar switcher.
- Use `Table` for simple records and `DataGrid` for dense, interactive datasets with sorting/filtering/pagination.
- Use `Card` for grouped content; do not wrap every individual label or control in a card.
- Use `Skeleton` when the page structure is known and `Spinner` for a localized pending action.
- Use `Alert` for persistent feedback in the page; use a dialog only when the user must make a decision.
- Use Lucide for small utility actions and Phosphor for navigation/category icons, matching nearby existing code.
- Use `motion` only where movement clarifies state changes, dragging, expansion, or navigation.

## Responsive behavior

- Design for narrow screens first when controls can wrap naturally.
- Toolbar controls should wrap or stack; primary actions must remain reachable without horizontal scrolling.
- Kanban boards may scroll vertically on mobile, but avoid forcing the entire page into a wide desktop layout.
- Hide or collapse secondary labels when the sidebar is collapsed; preserve tooltips for icon-only controls.
- Sheets and dialogs should use nearly full width on small screens and a constrained width on larger screens.
- Avatars may reduce in size, but ownership and status information must remain visible.

## Accessibility and interaction

- Use semantic headings and landmark elements (`main`, `header`, `nav`, `section`, `article`).
- Every icon-only button needs an accessible label or tooltip.
- Maintain visible focus styles; do not remove the default focus ring without replacing it.
- Pair status colors with text, icons, or labels.
- Ensure dialogs and sheets have titles/descriptions, including visually hidden titles when the visual design does not need them.
- Keep hover, active, disabled, loading, empty, and error states for every interactive workspace.
- Preserve keyboard access for tabs, filters, menus, dialogs, and task cards.

## New-page checklist

Before considering a page complete, verify:

- It renders inside `AppLayout` and uses the shared sidebar/header.
- It has a clear title, supporting description, and one obvious primary action.
- Its controls follow the Todo toolbar pattern: compact, grouped, and responsive.
- Surfaces use the white/zinc system, subtle borders, and restrained shadows.
- It supports dark mode using the existing class-based theme.
- It has responsive layouts for mobile, tablet, and desktop.
- It includes loading, empty, error, and success feedback where applicable.
- Interactive elements have accessible labels and visible focus states.
- The page uses existing UI primitives before introducing a new component style.

## Avoid

- New visual systems that compete with the Todo page.
- Excessive gradients, glow effects, oversized decorative illustrations, or dense color blocks.
- Large all-caps text except for small metadata labels.
- One-off spacing, colors, radius values, or typography that could have used existing tokens.
- Replacing a drawer/modal interaction with a full-page navigation when the user is inspecting a record.
- Hiding important actions behind icon-only controls on desktop or mobile.
