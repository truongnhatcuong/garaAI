# Admin UI review

## Screens audited
All 12 Admin routes were opened in Chrome before changes at 1440px and 390px: dashboard, appointments, customers, vehicles, repair orders, repair order detail, services, inventory, employees, invoices, reports, and settings.

## Issues found and addressed
- Dashboard prioritized a decorative chart, hard-coded trends, and large KPI cards over work items. It now derives counts from existing repair records and puts pending work, intake records, vehicles ready for pickup, and low stock first. Metrics without a reliable date or due-date source show no value and explain why.
- Sidebar groups did not match daily garage workflows. Navigation is grouped by overview, operations, management, finance, and system, with a compact header and a mobile dialog.
- Entity lists had decorative icon tiles and an unimplemented create button. The Admin-only table has one toolbar, text and status filters, semantic status labels, aligned numeric columns, row counts, and a mobile list.
- Inventory used eight large bay cards, extrapolated progress bars, and an unsupported AI prediction. Existing bay records are now a dense operations table; stock metrics are derived from the six existing inventory records.
- Repair detail overflowed at 390px and showed tabs and action buttons without behavior. It now uses anchored sections, compact overview fields, scrollable line-item table, estimate, technician/timeline information, and working print action.
- Loading skeleton now follows the table structure. Empty and error states remain concise.

## Visual system
Admin-only tokens use neutral background `#F7F8FA`, white surfaces `#FFFFFF`, ink `#18242E`, subtle border `#E3E7EB`, primary `#176B73`, and semantic warning `#A86A16`. Plus Jakarta Sans is already installed. Most surfaces use 6–8px radii and borders instead of shadows.

## Data scope
No API, database, authentication, permissions, data-fetching, or source data was changed. The repository still contains its existing mock records. No new charts, activity records, trends, or backend actions were invented.

## Validation
`npm run lint`, `npx tsc --noEmit`, and `npm run build -- --webpack` passed. Chrome checks covered all 12 routes at 1440, 1024, 768, and 390px with HTTP 200, no document overflow, and no browser runtime errors. Mobile menu, list search/reset, inventory and repair filters, header search, and detail anchor were exercised. Default Turbopack build was previously blocked by local port-binding restrictions; webpack build completed successfully.
