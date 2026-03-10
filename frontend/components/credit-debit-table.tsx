"use client"

import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, User, Calendar, CreditCard, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CreditDebitRecord {
  id: string
  entity_type: "customer" | "manual"
  customer?: {
    id: string
    name: string
    email: string
  }
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

interface CreditDebitTableProps {
  records: CreditDebitRecord[]
  onEdit: (record: CreditDebitRecord) => void
  onDelete: (id: string) => void
  loading?: boolean
}

export function CreditDebitTable({ 
  records, 
  onEdit, 
  onDelete,
  loading = false 
}: CreditDebitTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!records || records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <CreditCard className="h-16 w-16 mb-4 text-gray-300" />
        <p className="text-lg font-medium">No records found</p>
        <p className="text-sm">Add a new credit or debit record to get started</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-orange-50 to-amber-50">
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Amount(NPR) </TableHead>
              <TableHead className="font-semibold">Payment Method</TableHead>
              <TableHead className="font-semibold">Balance(NPR) </TableHead>
              <TableHead className="font-semibold">Description</TableHead>
              <TableHead className="font-semibold">Recorded By</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow 
                key={record.id}
                className="hover:bg-orange-50/50 transition-colors"
              >
                <TableCell className="whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {new Date(record.transaction_date).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(record.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {record.entity_type === "manual" 
                          ? record.manual_name 
                          : record.customer?.name
                        }
                      </span>
                      <span className="text-xs text-gray-500">
                        {record.entity_type === "manual" 
                          ? (record.manual_email || record.manual_phone || "-")
                          : record.customer?.email
                        }
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={record.type === "credit" ? "default" : "destructive"}
                    className={`flex items-center gap-1 w-fit ${
                      record.type === "credit" 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {record.type === "credit" ? (
                      <ArrowUpCircle className="h-3 w-3" />
                    ) : (
                      <ArrowDownCircle className="h-3 w-3" />
                    )}
                    {record.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${
                    record.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {record.type === "credit" ? "+" : "-"} {Number(record.amount).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {record.payment_method?.replace("_", " ") || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-semibold ${
                    Number(record.balance) >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                     {Number(record.balance).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-gray-600 truncate" title={record.description}>
                    {record.description || "-"}
                  </p>
                  {record.reference_number && (
                    <p className="text-xs text-gray-500">
                      Ref: {record.reference_number}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {record.recordedBy 
                      ? record.recordedBy.name
                      : "-"
                    }
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(record)}
                      className="hover:bg-blue-50 text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(record.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
