import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function CustomerViewPage({ params }: { params: { id: string } }) {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id },
    include: { orders: true },
  })

  if (!customer) return notFound()

  return (
    <div className="p-8 space-y-8 min-h-screen bg-background text-white">
      <h2 className="text-3xl font-bold">Customer Details</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 space-y-2">
          <h3 className="text-lg font-semibold">Customer Information</h3>
          <p><strong>Full Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone}</p>
          <p><strong>Total Orders:</strong> {customer.orders.length}</p>
          <p><strong>Created At:</strong> {new Date(customer.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(customer.updatedAt).toLocaleString()}</p>
        </div>
        <div className="border rounded-lg p-6 space-y-2">
          <h3 className="text-lg font-semibold">Address Information</h3>
          <p><strong>Street:</strong> {customer.address}</p>
        </div>
      </div>
    </div>
  )
}
