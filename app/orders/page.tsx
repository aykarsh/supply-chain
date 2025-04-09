"use client"

import { useState } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Download, Eye, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Order {
  id: string
  orderNumber: string
  customer: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [open, setOpen] = useState(false)

  return (
    <MainLayout title="Orders">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search orders..." className="w-full sm:w-[300px] pl-8" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Enter the details for the new order. Click save when you're done.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Customer</Label>
                    <Select>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                        <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                        <SelectItem value="emily-williams">Emily Williams</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Order Date</Label>
                    <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Order Items</Label>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {[1, 2].map((index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 items-end">
                            <div className="col-span-5">
                              <Label htmlFor={`product-${index}`} className="text-xs">
                                Product
                              </Label>
                              <Select>
                                <SelectTrigger id={`product-${index}`}>
                                  <SelectValue placeholder="Select product" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="wireless-headphones">Wireless Headphones</SelectItem>
                                  <SelectItem value="smart-watch">Smart Watch</SelectItem>
                                  <SelectItem value="bluetooth-speaker">Bluetooth Speaker</SelectItem>
                                  <SelectItem value="usb-c-cable">USB-C Cable</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor={`quantity-${index}`} className="text-xs">
                                Quantity
                              </Label>
                              <Input id={`quantity-${index}`} type="number" min="1" defaultValue="1" />
                            </div>
                            <div className="col-span-3">
                              <Label htmlFor={`price-${index}`} className="text-xs">
                                Unit Price
                              </Label>
                              <Input id={`price-${index}`} type="number" min="0" step="0.01" defaultValue="0.00" />
                            </div>
                            <div className="col-span-2">
                              <Button variant="ghost" size="sm" className="w-full">
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Item
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-address">Shipping Address</Label>
                  <Textarea id="shipping-address" placeholder="Enter shipping address" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping-method">Shipping Method</Label>
                    <Select>
                      <SelectTrigger id="shipping-method">
                        <SelectValue placeholder="Select shipping" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Shipping</SelectItem>
                        <SelectItem value="express">Express Shipping</SelectItem>
                        <SelectItem value="overnight">Overnight Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select>
                      <SelectTrigger id="payment-method">
                        <SelectValue placeholder="Select payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit-card">Credit Card</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        <SelectItem value="purchase-order">Purchase Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes</Label>
                  <Textarea id="notes" placeholder="Enter any special instructions or notes" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setOpen(false)}>Create Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {order.date}
                  </div>
                </TableCell>
                <TableCell className="text-center">{order.items}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-center">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm">
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>
    </MainLayout>
  )
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Pending
        </Badge>
      )
    case "processing":
      return (
        <Badge variant="outline" className="text-blue-500 border-blue-500">
          Processing
        </Badge>
      )
    case "shipped":
      return (
        <Badge variant="outline" className="text-purple-500 border-purple-500">
          Shipped
        </Badge>
      )
    case "delivered":
      return (
        <Badge variant="outline" className="text-green-500 border-green-500">
          Delivered
        </Badge>
      )
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
  }
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2023-1001",
    customer: "John Doe",
    date: "2023-04-15",
    total: 299.99,
    status: "delivered",
    items: 3,
  },
  {
    id: "2",
    orderNumber: "ORD-2023-1002",
    customer: "Jane Smith",
    date: "2023-04-16",
    total: 149.95,
    status: "shipped",
    items: 2,
  },
  {
    id: "3",
    orderNumber: "ORD-2023-1003",
    customer: "Robert Johnson",
    date: "2023-04-17",
    total: 89.99,
    status: "processing",
    items: 1,
  },
  {
    id: "4",
    orderNumber: "ORD-2023-1004",
    customer: "Emily Williams",
    date: "2023-04-18",
    total: 459.97,
    status: "pending",
    items: 4,
  },
  {
    id: "5",
    orderNumber: "ORD-2023-1005",
    customer: "Michael Brown",
    date: "2023-04-19",
    total: 199.98,
    status: "delivered",
    items: 2,
  },
  {
    id: "6",
    orderNumber: "ORD-2023-1006",
    customer: "Sarah Davis",
    date: "2023-04-20",
    total: 129.99,
    status: "cancelled",
    items: 1,
  },
  {
    id: "7",
    orderNumber: "ORD-2023-1007",
    customer: "David Miller",
    date: "2023-04-21",
    total: 349.95,
    status: "shipped",
    items: 3,
  },
]
