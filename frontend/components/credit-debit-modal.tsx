"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface Customer {
  id: string
  name: string
  email: string
  role: string
}

interface CreditDebitRecord {
  id?: string
  entity_type: "customer" | "manual"
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
}

interface CreditDebitModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  record?: CreditDebitRecord | null
  mode: "add" | "edit"
}

export function CreditDebitModal({ 
  open, 
  onClose, 
  onSave, 
  record,
  mode 
}: CreditDebitModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerSearch, setCustomerSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false)
  const [pendingFormData, setPendingFormData] = useState<CreditDebitRecord | null>(null)
  const [formData, setFormData] = useState<CreditDebitRecord>({
    entity_type: "manual",
    customer_id: "",
    manual_name: "",
    manual_phone: "",
    manual_email: "",
    type: "credit",
    amount: 0,
    description: "",
    payment_method: "cash",
    reference_number: "",
    transaction_date: new Date().toISOString().split("T")[0]
  })

  // Load customers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch customers
        const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?role=customer`, {
          credentials: "include"
        })
        if (customerResponse.ok) {
          const customerData = await customerResponse.json()
          console.log("Customer data received:", customerData)
          const allUsers = customerData.users || customerData || []
          const customerList = allUsers.filter((user: Customer) => 
            user.role && user.role.toLowerCase() === "customer"
          )
          console.log("Filtered customer list:", customerList)
          setCustomers(customerList)
        } else {
          console.error("Failed to fetch customers:", customerResponse.status)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    if (open) {
      fetchUsers()
      setCustomerSearch("")
    }
  }, [open])

  // Set form data when record changes
  useEffect(() => {
    if (record && mode === "edit") {
      setFormData({
        entity_type: record.entity_type || "customer",
        customer_id: record.customer_id || "",
        manual_name: record.manual_name || "",
        manual_phone: record.manual_phone || "",
        manual_email: record.manual_email || "",
        type: record.type,
        amount: record.amount,
        description: record.description || "",
        payment_method: record.payment_method || "cash",
        reference_number: record.reference_number || "",
        transaction_date: record.transaction_date
      })
    } else if (mode === "add") {
      setFormData({
        entity_type: "manual",
        customer_id: "",
        manual_name: "",
        manual_phone: "",
        manual_email: "",
        type: "credit",
        amount: 0,
        description: "",
        payment_method: "cash",
        reference_number: "",
        transaction_date: new Date().toISOString().split("T")[0]
      })
    }
  }, [record, mode, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (formData.entity_type === "manual") {
      if (!formData.manual_name) {
        toast({
          title: "Validation Error",
          description: "Please enter a name for manual entry",
          variant: "destructive"
        })
        return
      }
    } else {
      if (!formData.customer_id) {
        toast({
          title: "Validation Error",
          description: "Please select a customer",
          variant: "destructive"
        })
        return
      }
    }

    if (!formData.amount || formData.amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      })
      return
    }

    // Show confirmation for edit mode
    if (mode === "edit") {
      setPendingFormData(formData)
      setShowUpdateConfirm(true)
      return
    }

    // Direct save for add mode
    await performSave(formData)
  }

  const performSave = async (data: CreditDebitRecord) => {
    setLoading(true)

    try {
      const url = mode === "edit" && record?.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/credit-debit/${record.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/credit-debit`

      const response = await fetch(url, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Record ${mode === "edit" ? "updated" : "created"} successfully`,
        })
        setShowUpdateConfirm(false)
        setPendingFormData(null)
        onSave()
        onClose()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to save record",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error saving record:", error)
      toast({
        title: "Error",
        description: "Failed to save record",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Record" : "Add New Credit/Debit Record"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" 
              ? "Update the credit or debit record details" 
              : "Add a new transaction. Select existing customer or enter manual details (system will auto-match if email/phone exists)"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Entity Type Selection */}
          <div className="space-y-3">
            <Label>Entity Type *</Label>
            <RadioGroup
              value={formData.entity_type}
              onValueChange={(value: "customer" | "manual") => 
                setFormData({ ...formData, entity_type: value, customer_id: "" })
              }
              disabled={mode === "edit"}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="customer" id="customer" />
                <Label htmlFor="customer" className="font-normal cursor-pointer">Existing Customer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual" className="font-normal cursor-pointer">Manual Entry (Customer/Supplier/Other)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Customer Selection */}
          {formData.entity_type === "customer" && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
                disabled={mode === "edit"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  <div className="sticky top-0 bg-white p-2 border-b">
                    <Input
                      placeholder="Search customers..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {customers.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No customers available
                      </div>
                    ) : (
                      <>
                        {customers
                          .filter(user => {
                            if (!customerSearch.trim()) return true
                            const searchLower = customerSearch.toLowerCase()
                            return user.name.toLowerCase().includes(searchLower) ||
                                   user.email.toLowerCase().includes(searchLower)
                          })
                          .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </SelectItem>
                          ))}
                        {customerSearch.trim() && 
                         customers.filter(user => {
                           const searchLower = customerSearch.toLowerCase()
                           return user.name.toLowerCase().includes(searchLower) ||
                                  user.email.toLowerCase().includes(searchLower)
                         }).length === 0 && (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No customers found matching "{customerSearch}"
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Manual Entry Fields */}
          {formData.entity_type === "manual" && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Auto-matching enabled</p>
                <p>If you enter an email or phone that matches an existing customer, their data will be used automatically.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual_name">Name *</Label>
                <Input
                  id="manual_name"
                  value={formData.manual_name}
                  onChange={(e) => setFormData({ ...formData, manual_name: e.target.value })}
                  placeholder="Enter name (customer/supplier/other)"
                  disabled={mode === "edit"}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manual_phone">Phone</Label>
                  <Input
                    id="manual_phone"
                    value={formData.manual_phone}
                    onChange={(e) => setFormData({ ...formData, manual_phone: e.target.value })}
                    placeholder="Phone number"
                    disabled={mode === "edit"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual_email">Email</Label>
                  <Input
                    id="manual_email"
                    type="email"
                    value={formData.manual_email}
                    onChange={(e) => setFormData({ ...formData, manual_email: e.target.value })}
                    placeholder="Email address"
                    disabled={mode === "edit"}
                  />
                </div>
              </div>
            </>
          )}

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "credit" | "debit") => 
                setFormData({ ...formData, type: value })
              }
              disabled={mode === "edit"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (NPR) *</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              value={formData.amount === 0 ? "" : formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="Enter amount"
              required
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Transaction Date */}
          <div className="space-y-2">
            <Label htmlFor="transaction_date">Transaction Date *</Label>
            <Input
              id="transaction_date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="online">Online Payment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference Number */}
          <div className="space-y-2">
            <Label htmlFor="reference_number">Reference Number</Label>
            <Input
              id="reference_number"
              value={formData.reference_number}
              onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              placeholder="Transaction reference or cheque number"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add notes or details about this transaction"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="luxury-gradient"
            >
              {loading ? "Saving..." : mode === "edit" ? "Update Record" : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Update Confirmation Dialog */}
      <ConfirmationDialog
        open={showUpdateConfirm}
        onClose={() => {
          setShowUpdateConfirm(false)
          setPendingFormData(null)
        }}
        onConfirm={() => {
          if (pendingFormData) {
            performSave(pendingFormData)
          }
        }}
        title="Update Record"
        description="Are you sure you want to update this record? This may affect balance calculations for this entity."
        confirmText="Update"
        cancelText="Cancel"
        type="warning"
        loading={loading}
      />
    </Dialog>
  )
}
