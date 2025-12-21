"use client"

import { CustomerTable } from "@/components/customer-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Plus } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 luxury-gradient rounded-xl animate-glow">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-sm text-gray-600">Manage your customer database and relationships</p>
            </div>
          </div>
        </div>

        <Button className="luxury-gradient hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Customer Table */}
      <CustomerTable />
    </div>
  )
}
