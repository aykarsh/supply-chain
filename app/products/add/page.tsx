'use client';

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Category {
  id: string;
  name: string;
}

interface Supplier {
  id: string;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    price: '',
    cost: '',
    quantity: '',
    minQuantity: '',
    supplierId: '',
    supplierSku: '',
  });

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch categories and suppliers on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/suppliers');
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchCategories();
    fetchSuppliers();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when field is edited
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.cost || parseFloat(formData.cost) <= 0) newErrors.cost = 'Valid cost is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) newErrors.quantity = 'Valid quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Simplified product data without user ID
      const productData = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description || null,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        initialQuantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity) || 10,
      };
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      if (response.ok) {
        // If supplier is selected, create supplier product relationship
        if (formData.supplierId) {
          const product = await response.json();
          
          await fetch('/api/supplier-products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              supplierId: formData.supplierId,
              productId: product.id,
              cost: parseFloat(formData.cost),
              supplierSku: formData.supplierSku || null,
            }),
          });
        }
        
        // Redirect to products page
        router.push('/products');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Add Product">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Enter the basic information about the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>Product Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter product name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku" className={errors.sku ? "text-destructive" : ""}>SKU</Label>
                <Input 
                  id="sku" 
                  placeholder="Enter product SKU" 
                  value={formData.sku}
                  onChange={handleChange}
                  className={errors.sku ? "border-destructive" : ""}
                />
                {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className={errors.categoryId ? "text-destructive" : ""}>Category</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => handleSelectChange(value, 'categoryId')}
                >
                  <SelectTrigger className={errors.categoryId ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="home-office">Home Office</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter product description" 
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
                <CardDescription>Set the pricing and inventory details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "border-destructive" : ""}
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost" className={errors.cost ? "text-destructive" : ""}>Cost Price ($)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0"
                    value={formData.cost}
                    onChange={handleChange}
                    className={errors.cost ? "border-destructive" : ""}
                  />
                  {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="quantity" className={errors.quantity ? "text-destructive" : ""}>Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="0" 
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "border-destructive" : ""}
                  />
                  {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minQuantity">Low Stock Threshold</Label>
                  <Input 
                    id="minQuantity" 
                    type="number" 
                    placeholder="10" 
                    min="0"
                    value={formData.minQuantity}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Information</CardTitle>
                <CardDescription>Add supplier details for this product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select 
                    value={formData.supplierId} 
                    onValueChange={(value) => handleSelectChange(value, 'supplierId')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.length > 0 ? (
                        suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="tech-supplies">Tech Supplies Inc.</SelectItem>
                          <SelectItem value="global-electronics">Global Electronics</SelectItem>
                          <SelectItem value="office-depot">Office Depot</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierSku">Supplier SKU</Label>
                  <Input 
                    id="supplierSku" 
                    placeholder="Enter supplier SKU"
                    value={formData.supplierSku}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/products">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}

