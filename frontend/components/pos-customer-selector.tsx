"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, User, Plus, Star, Phone } from "lucide-react"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  totalPurchases: number
  loyaltyPoints: number
  isVIP: boolean
}

interface POSCustomerSelectorProps {
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer | null) => void
}

export function POSCustomerSelector({ selectedCustomer, onSelectCustomer }: POSCustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showCustomers, setShowCustomers] = useState(false)

  const customers: Customer[] = [
    {
      id: "1",
      name: "Priya Sharma",
      phone: "+977-9841234567",
      email: "priya.sharma@email.com",
      totalPurchases: 450000,
      loyaltyPoints: 4500,
      isVIP: true,
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      phone: "+977-9851234567",
      email: "rajesh.kumar@email.com",
      totalPurchases: 125000,
      loyaltyPoints: 1250,
      isVIP: false,
    },
    {
      id: "3",
      name: "Sita Poudel",
      phone: "+977-9861234567",
      email: "sita.poudel@email.com",
      totalPurchases: 780000,
      loyaltyPoints: 7800,
      isVIP: true,
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="glass-card animate-slide-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-orange-600" />
          Customer
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {selectedCustomer ? (
          <div className="space-y-3 animate-fade-in-scale">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full luxury-gradient flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {selectedCustomer.name}
                    {selectedCustomer.isVIP && (
                      <Badge className="luxury-gradient text-white animate-float">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    {selectedCustomer.phone}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => onSelectCustomer(null)} className="hover:bg-orange-50">
                Change
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg bg-orange-50">
                <p className="text-sm text-gray-600">Total Purchases</p>
                <p className="font-bold text-orange-600">NPR {selectedCustomer.totalPurchases.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-orange-50">
                <p className="text-sm text-gray-600">Loyalty Points</p>
                <p className="font-bold text-orange-600">{selectedCustomer.loyaltyPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowCustomers(true)}
                className="pl-10 bg-white/80 border-orange-200/50 focus:border-orange-400 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectCustomer(null)}
                className="flex-1 hover:bg-orange-50 bg-transparent"
              >
                Walk-in Customer
              </Button>
              <Button size="sm" className="luxury-gradient hover:shadow-lg transition-all duration-300">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>

            {(showCustomers || searchTerm) && (
              <div className="space-y-2 max-h-48 overflow-y-auto animate-fade-in-scale">
                {filteredCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    onClick={() => {
                      onSelectCustomer(customer)
                      setShowCustomers(false)
                      setSearchTerm("")
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 cursor-pointer transition-colors animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-8 h-8 rounded-full luxury-gradient flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-900">{customer.name}</h4>
                        {customer.isVIP && (
                          <Badge variant="secondary" className="text-xs">
                            VIP
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Points</p>
                      <p className="text-sm font-semibold text-orange-600">{customer.loyaltyPoints}</p>
                    </div>
                  </div>
                ))}
                {filteredCustomers.length === 0 && searchTerm && (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No customers found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
