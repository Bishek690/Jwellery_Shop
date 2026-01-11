import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import Link from "next/link"
import { CustomerTable } from "@/components/customer-table"

export default function CustomersPage() {
  return (
    <>
      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="p-2.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg flex-shrink-0">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Customer Management
            </h1>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block truncate">
              Manage your customer database and relationships
            </p>
          </div>
        </div>

        <Button 
          size="default" 
          className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">Add Customer</span>
          <span className="xs:hidden">Add</span>
        </Button>
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </>
  )
}
