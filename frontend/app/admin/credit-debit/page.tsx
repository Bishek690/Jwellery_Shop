"use client"

import { useState, useEffect } from "react"
import { CreditDebitTable } from "@/components/credit-debit-table"
import { CreditDebitModal } from "@/components/credit-debit-modal"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  FileText,
  Download,
  RefreshCw
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CreditDebitRecord {
  id: string
  entity_type: "customer" | "manual"
  customer?: {
    id: string
    name: string
    email: string
  }
  customer_id: string
  manual_name?: string
  manual_phone?: string
  manual_email?: string
  type: "credit" | "debit"
  amount: number
  description: string
  payment_method: string
  reference_number: string
  transaction_date: string
  balance: number
  recordedBy?: {
    name: string
  }
  created_at: string
}

interface Statistics {
  total_credit: number
  total_debit: number
  net_balance: number
  total_records: number
  customers_with_records: number
}

export default function CreditDebitPage() {
  const [records, setRecords] = useState<CreditDebitRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<CreditDebitRecord[]>([])
  const [statistics, setStatistics] = useState<Statistics>({
    total_credit: 0,
    total_debit: 0,
    net_balance: 0,
    total_records: 0,
    customers_with_records: 0
  })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit">("add")
  const [selectedRecord, setSelectedRecord] = useState<CreditDebitRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch records
  const fetchRecords = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credit-debit`, {
        credentials: "include"
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecords(data.records || [])
        setFilteredRecords(data.records || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch records",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching records:", error)
      toast({
        title: "Error",
        description: "Failed to fetch records",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credit-debit/statistics`, {
        credentials: "include"
      })
      
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    }
  }

  useEffect(() => {
    fetchRecords()
    fetchStatistics()
  }, [])

  // Filter records
  useEffect(() => {
    let filtered = [...records]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => {
        const name = record.entity_type === "manual" 
          ? record.manual_name?.toLowerCase() || ""
          : record.customer?.name?.toLowerCase() || ""
        const email = record.entity_type === "manual"
          ? record.manual_email?.toLowerCase() || ""
          : record.customer?.email?.toLowerCase() || ""
        const phone = record.entity_type === "manual"
          ? record.manual_phone?.toLowerCase() || ""
          : ""
        const description = record.description?.toLowerCase() || ""
        const reference = record.reference_number?.toLowerCase() || ""
        const search = searchTerm.toLowerCase()

        return name.includes(search) || 
               email.includes(search) || 
               phone.includes(search) ||
               description.includes(search) ||
               reference.includes(search)
      })
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(record => record.type === typeFilter)
    }

    // Payment method filter
    if (paymentFilter !== "all") {
      filtered = filtered.filter(record => record.payment_method === paymentFilter)
    }

    setFilteredRecords(filtered)
  }, [searchTerm, typeFilter, paymentFilter, records])

  const handleAddNew = () => {
    setModalMode("add")
    setSelectedRecord(null)
    setModalOpen(true)
  }

  const handleEdit = (record: CreditDebitRecord) => {
    setModalMode("edit")
    setSelectedRecord(record)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setRecordToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!recordToDelete) return

    try {
      setDeleteLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/credit-debit/${recordToDelete}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Record deleted successfully"
        })
        fetchRecords()
        fetchStatistics()
        setDeleteDialogOpen(false)
        setRecordToDelete(null)
      } else {
        toast({
          title: "Error",
          description: "Failed to delete record",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error deleting record:", error)
      toast({
        title: "Error",
        description: "Failed to delete record",
        variant: "destructive"
      })
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleSave = () => {
    fetchRecords()
    fetchStatistics()
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Credit/Debit Records</h1>
          <p className="text-gray-600 mt-1">Manage credit/debit for customers, suppliers, and others</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              fetchRecords()
              fetchStatistics()
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleAddNew}
            className="luxury-gradient gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-card animate-fade-in-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              NPR {statistics.total_credit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Money received</p>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.1s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debit</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              NPR {statistics.total_debit.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Money paid out</p>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              statistics.net_balance >= 0 ? "text-blue-600" : "text-red-600"
            }`}>
              NPR {statistics.net_balance.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">Current balance</p>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.3s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.total_records}
            </div>
            <p className="text-xs text-gray-500 mt-1">All transactions</p>
          </CardContent>
        </Card>

        <Card className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.4s" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {statistics.customers_with_records}
            </div>
            <p className="text-xs text-gray-500 mt-1">With transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by customer, description, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit Only</SelectItem>
                <SelectItem value="debit">Debit Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Method Filter */}
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredRecords.length} of {records.length} records
        </p>
      </div>

      {/* Records Table */}
      <CreditDebitTable
        records={filteredRecords}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Add/Edit Modal */}
      <CreditDebitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        record={selectedRecord}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setRecordToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Delete Record"
        description="Are you sure you want to delete this credit/debit record? This action cannot be undone and will affect the balance calculations."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
      />
    </div>
  )
}
