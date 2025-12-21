import { CustomerTable } from "@/components/customer-table"
import { SimpleProtectedRoute } from "@/components/admin/shared/simple-protected-route"

export default function CustomersPage() {
  return (
    <SimpleProtectedRoute allowedRoles={["admin", "staff"]}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <CustomerTable />
        </div>
      </div>
    </SimpleProtectedRoute>
  )
}
