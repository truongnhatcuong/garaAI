# Source → database mapping

| Source currently in repo | Database model / fields |
|---|---|
| Admin customers and Customer profile rows | Customer: name, phone, email, tier, address, status |
| Admin vehicles and Customer vehicles rows | Vehicle: plate, name, odometerKm, status, warrantyStatus, customerId; optional VIN |
| Admin appointments rows and Customer booking form | Appointment: code, customer/vehicle/service references, startsAt, endsAt, status, notes |
| `src/lib/mock-data.ts` services and Admin services rows | Service: code, title, description, durationMinutes, price, status |
| Admin employees rows, repair advisor/technician labels | Employee: name, specialty, shift, role, status |
| `src/lib/mock-data.ts` inventory rows | Part: sku, name, brand, location, cost, price, stockQty, minStock, unit |
| Admin inventory `bays` | WorkshopBay: code, vehicle/employee references, statusText |
| `src/lib/mock-data.ts` repairs and repair detail | RepairOrder: code, customer/vehicle/employee references, scheduledAt, status, diagnosis, odometerKm, estimateTotal; RepairOrderLine, RepairTask, RepairEvidence |
| Admin and Customer invoice rows | Invoice: code, customer/vehicle/repair references, issuedAt, total, status, tax, discount |
| Customer invoices mention payment and status | Payment: invoice reference, amount, method, status, paidAt |
| Admin header notification | Notification: title, body, type, readAt; optional employee reference |
| Admin report rows | Report: periodStart, revenue, cost, profit, status |

Current auth screens contain no authentication handlers or session checks. The backend implementation must not claim to preserve an existing authorization layer that is absent. Initial seed will reuse source records and link related records by plate/name/code. Static marketing copy and AI diagnostic prose are not operational records; they are outside the CRUD dataset.
