"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

type Supplier = {
  id: string
  name: string
  email: string | null
  phone: string | null
  contactName: string | null
  address: string | null
}

export default function EditSupplierPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchSupplier() {
      try {
        const response = await fetch(`/api/create-supply/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch supplier')
        }
        
        const data = await response.json()
        setSupplier(data)
      } catch (error) {
        console.error('Error fetching supplier:', error)
        toast({
          title: "Error",
          description: "Failed to fetch supplier details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        name: formData.get('name') as string,
        contactName: formData.get('contactName') as string || null,
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        address: formData.get('address') as string || null,
      }

      // Basic validation
      if (!data.name || data.name.trim() === '') {
        toast({
          title: "Validation Error",
          description: "Supplier name is required",
          variant: "destructive"
        })
        return
      }

      // Call the API to update the supplier
      const response = await fetch(`/api/create-supply/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update supplier")
      }

      toast({
        title: "Success",
        description: "Supplier updated successfully",
      })

      // Redirect to suppliers list
      router.push('/suppliers')
      router.refresh() // Refresh the page data
    } catch (error) {
      console.error('Error updating supplier:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update supplier",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout title="Edit Supplier">
        <div className="flex justify-center items-center h-64">
          <p>Loading supplier details...</p>
        </div>
      </MainLayout>
    )
  }

  if (!supplier) {
    return (
      <MainLayout title="Edit Supplier">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">Supplier not found</p>
          <Button asChild>
            <Link href="/suppliers">Back to Suppliers</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

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

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Supplier Information</CardTitle>
              <CardDescription>Edit the basic information about the supplier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter supplier name" 
                  defaultValue={supplier.name} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person</Label>
                <Input 
                  id="contactName" 
                  name="contactName" 
                  placeholder="Enter contact person name" 
                  defaultValue={supplier.contactName || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="Enter email address" 
                  defaultValue={supplier.email || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  placeholder="Enter phone number" 
                  defaultValue={supplier.phone || ''} 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address & Additional Information</CardTitle>
              <CardDescription>Edit the supplier's address and additional details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address" 
                  placeholder="Enter supplier address" 
                  rows={4} 
                  defaultValue={supplier.address || ''} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Enter any additional notes" 
                  rows={4} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/suppliers">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}