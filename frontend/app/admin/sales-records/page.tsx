"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus, Receipt } from "lucide-react"
import { SalesRecordsTable } from "@/components/sales-records-table"

export default function SalesRecordsPage() {
  const router = useRouter()

  return (
    <div>
      <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 luxury-gradient rounded-xl animate-glow">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Records</h1>
              <p className="text-sm text-gray-600 mt-1">Manage all sales transactions</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => router.push('/admin/sales-records/add')}
            className="luxury-gradient hover:shadow-lg transition-all duration-300 animate-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Sale
          </Button>
        </div>

        {/* Sales Table */}
        <SalesRecordsTable />
      </div>
    </div>
  )
}
