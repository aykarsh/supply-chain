import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { getSupplierById, updateSupplier } from "@/lib/actions/supplier-actions"

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const supplier = await getSupplierById(params.id)

  if (!supplier) {
    return (
      <MainLayout title="Edit Supplier">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="text-2xl font-bold">Supplier not found</h2>
          <p className="text-muted-foreground mt-2">The supplier you are looking for does not exist.</p>
          <Button className="mt-4" asChild>
            <Link href="/suppliers">Back to Suppliers</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  const updateSupplierWithId = updateSupplier.bind(null, supplier.id)

  return (
    <MainLayout title="Edit Supplier">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/suppliers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Suppliers
          </Link>
        </Button>
      </div>

      <form action={updateSupplierWithId}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>Update the basic information about the supplier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input id="name" name="name" placeholder="Enter supplier name" defaultValue={supplier.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="Enter contact person name"
                  defaultValue={supplier.contactName || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  defaultValue={supplier.email || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="Enter phone number" defaultValue={supplier.phone || ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address & Additional Information</CardTitle>
              <CardDescription>Update the supplier's address and additional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Enter supplier address"
                  rows={4}
                  defaultValue={supplier.address || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter any additional notes"
                  rows={4}
                  defaultValue={supplier.notes || ""}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/suppliers">Cancel</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Update Supplier
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}
