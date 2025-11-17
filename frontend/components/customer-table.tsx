"use client"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, Phone, Mail, MapPin, Star, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalPurchases: number
  lastPurchase: string
  status: "Regular" | "VIP" | "Premium"
  loyaltyPoints: number
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    totalPurchases: 125000,
    lastPurchase: "2024-01-15",
    status: "VIP",
    loyaltyPoints: 2500,
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 87654 32109",
    address: "Delhi, India",
    totalPurchases: 85000,
    lastPurchase: "2024-01-12",
    status: "Premium",
    loyaltyPoints: 1700,
  },
  {
    id: "3",
    name: "Anita Patel",
    email: "anita.patel@email.com",
    phone: "+91 76543 21098",
    address: "Ahmedabad, Gujarat",
    totalPurchases: 45000,
    lastPurchase: "2024-01-10",
    status: "Regular",
    loyaltyPoints: 900,
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram.singh@email.com",
    phone: "+91 65432 10987",
    address: "Jaipur, Rajasthan",
    totalPurchases: 200000,
    lastPurchase: "2024-01-18",
    status: "VIP",
    loyaltyPoints: 4000,
  },
]

export function CustomerTable() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VIP":
        return <Crown className="h-4 w-4 text-amber-500" />
      case "Premium":
        return <Star className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-300"
      case "Premium":
        return "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border-purple-300"
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-700 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Customer Management
          </h2>
          <p className="text-muted-foreground">Manage your valued customers and their relationships</p>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-shimmer">
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400/20"
        />
      </div>

      {/* Customer Table */}
      <div className="rounded-lg border border-amber-200 bg-white/50 backdrop-blur-sm shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <TableHead className="font-semibold text-amber-800">Customer</TableHead>
              <TableHead className="font-semibold text-amber-800">Contact</TableHead>
              <TableHead className="font-semibold text-amber-800">Status</TableHead>
              <TableHead className="font-semibold text-amber-800">Total Purchases</TableHead>
              <TableHead className="font-semibold text-amber-800">Loyalty Points</TableHead>
              <TableHead className="font-semibold text-amber-800">Last Purchase</TableHead>
              <TableHead className="font-semibold text-amber-800">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow
                key={customer.id}
                className="hover:bg-amber-50/50 transition-colors duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{customer.name}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {customer.address}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Mail className="h-3 w-3 mr-2 text-amber-600" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-2 text-amber-600" />
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(customer.status)} flex items-center gap-1 w-fit`}>
                    {getStatusIcon(customer.status)}
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-green-600">₹{customer.totalPurchases.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                    <span className="font-medium">{customer.loyaltyPoints}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-amber-100 hover:text-amber-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-700">
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
