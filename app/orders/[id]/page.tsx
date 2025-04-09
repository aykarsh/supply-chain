import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, Printer, Truck, CreditCard, Package, CheckCircle, Clock } from "lucide-react"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = mockOrderDetails

  return (
    <MainLayout title={`Order ${order.orderNumber}`}>
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Order details and line items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Number</p>
                  <p className="text-lg font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date Placed</p>
                  <p className="text-lg font-semibold">{order.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shippingInfo.method === "Express Shipping" ? "9.99" : "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div
                        className={`rounded-full p-1 ${event.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}
                      >
                        {getTimelineIcon(event.type, event.completed)}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className={`h-full w-px my-1 ${event.completed ? "bg-green-200" : "bg-muted"}`} />
                      )}
                    </div>
                    <div className="space-y-1 pt-1">
                      <p className="text-sm font-medium leading-none">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.date}</p>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipping Address</p>
                  <p className="font-medium">{order.shippingInfo.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Shipping Method</p>
                  <p className="font-medium">{order.shippingInfo.method}</p>
                </div>
                {order.shippingInfo.trackingNumber && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tracking Number</p>
                    <p className="font-medium">{order.shippingInfo.trackingNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{order.payment.method}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Payment Status</p>
                  <Badge
                    variant={order.payment.status === "Paid" ? "outline" : "destructive"}
                    className={order.payment.status === "Paid" ? "text-green-500 border-green-500" : ""}
                  >
                    {order.payment.status}
                  </Badge>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{order.payment.transactionId}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "Pending":
      return (
        <Badge variant="outline" className="text-amber-500 border-amber-500">
          Pending
        </Badge>
      )
    case "Processing":
      return (
        <Badge variant="outline" className="text-blue-500 border-blue-500">
          Processing
        </Badge>
      )
    case "Shipped":
      return (
        <Badge variant="outline" className="text-purple-500 border-purple-500">
          Shipped
        </Badge>
      )
    case "Delivered":
      return (
        <Badge variant="outline" className="text-green-500 border-green-500">
          Delivered
        </Badge>
      )
    case "Cancelled":
      return <Badge variant="destructive">Cancelled</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getTimelineIcon(type: string, completed: boolean) {
  switch (type) {
    case "order_placed":
      return <CreditCard className="h-4 w-4" />
    case "processing":
      return <Package className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const mockOrderDetails = {
  id: "1",
  orderNumber: "ORD-2023-1001",
  date: "April 15, 2023",
  status: "Shipped",
  subtotal: 279.99,
  tax: 10.01,
  total: 299.99,
  items: [
    {
      name: "Wireless Headphones",
      quantity: 1,
      unitPrice: 89.99,
    },
    {
      name: "Smart Watch", 
      quantity: 1,
      unitPrice: 159.99,
    },
    {
      name: "USB-C Cable",
      quantity: 2,
      unitPrice: 15.0,
    },
  ],
  customer: {
    name: "John Doe",
    email: "john.doe@example.com", 
    phone: "(555) 123-4567",
  },
  shippingInfo: {
    address: "123 Main St, Anytown, CA 12345",
    method: "Express Shipping",
    trackingNumber: "TRK123456789",
  },
  payment: {
    method: "Credit Card (ending in 4567)",
    status: "Paid",
    transactionId: "TXN987654321",
  },
  timeline: [
    {
      type: "order_placed",
      title: "Order Placed",
      date: "April 15, 2023 - 10:30 AM",
      description: "Your order has been received and is being processed.",
      completed: true,
    },
    {
      type: "processing", 
      title: "Order Processing",
      date: "April 16, 2023 - 9:15 AM",
      description: "Your order is being prepared for shipment.",
      completed: true,
    },
    {
      type: "shipped",
      title: "Order Shipped", 
      date: "April 17, 2023 - 2:45 PM",
      description: "Your order has been shipped via Express Shipping.",
      completed: true,
    },
    {
      type: "delivered",
      title: "Order Delivered",
      date: "Expected April 19, 2023",
      description: "Your order is on its way to the delivery address.",
      completed: false,
    },
  ],
}
