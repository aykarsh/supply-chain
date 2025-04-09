"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"// import { auth } from "@/lib/auth"
import db from "@/lib/db"

export async function getSuppliers() {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        products: true,
      },
    })
    return suppliers
  } catch (error) {
    console.error("Failed to fetch suppliers:", error)
    return []
  }
}

export async function getSupplierById(id: string) {
  try {
    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orders: {
          include: {
            items: true,
          },
        },
      },
    })
    return supplier
  } catch (error) {
    console.error(`Failed to fetch supplier with ID ${id}:`, error)
    return null
  }
}

export async function createSupplier(formData: FormData) {
  // Simplified version without auth check
  const userId = "placeholder-user-id" // Use a placeholder or get from somewhere else

  const name = formData.get("name") as string
  const contactName = formData.get("contactName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const notes = formData.get("notes") as string

  try {
    await db.supplier.create({
      data: {
        name,
        contactName: contactName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
        createdById: userId, // Use the placeholder or alternative user ID
      },
    })

    revalidatePath("/suppliers")
    redirect("/suppliers")
  } catch (error) {
    console.error("Failed to create supplier:", error)
    throw new Error("Failed to create supplier. Please try again.")
  }
}

export async function updateSupplier(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const contactName = formData.get("contactName") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const notes = formData.get("notes") as string

  try {
    await db.supplier.update({
      where: { id },
      data: {
        name,
        contactName: contactName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        notes: notes || null,
      },
    })

    revalidatePath(`/suppliers/${id}`)
    revalidatePath("/suppliers")
    redirect("/suppliers")
  } catch (error) {
    console.error(`Failed to update supplier with ID ${id}:`, error)
    throw new Error("Failed to update supplier. Please try again.")
  }
}

export async function deleteSupplier(id: string) {
  try {
    await db.supplier.delete({
      where: { id },
    })

    revalidatePath("/suppliers")
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete supplier with ID ${id}:`, error)
    return { success: false, error: "Failed to delete supplier. Please try again." }
  }
}
