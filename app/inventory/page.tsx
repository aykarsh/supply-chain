'use client';

import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  stock: number;
  threshold: number;
}

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch inventory data
  const fetchInventory = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use the mock data
      const response = await new Promise<InventoryItem[]>(resolve => {
        setTimeout(() => resolve(mockInventoryItems), 500);
      });
      
      setInventoryItems(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInventory();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...inventoryItems];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter === 'low') {
      result = result.filter(item => item.stock > 0 && item.stock < item.threshold);
    } else if (statusFilter === 'out') {
      result = result.filter(item => item.stock === 0);
    }
    
    setFilteredItems(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [inventoryItems, searchQuery, statusFilter]);

  // Get current page items
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  };

  // Handle reorder action
  const handleReorder = (itemId: string) => {
    // In a real app, you would call your API to create a purchase order
    alert(`Creating purchase order for item ID: ${itemId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchInventory();
  };

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <MainLayout title="Inventory Management">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search inventory..." 
            className="w-full sm:w-[300px] pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select 
            defaultValue="all" 
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="low">Low Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
            }}
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Updating...' : 'Update Stock'}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-center">Stock Level</TableHead>
              <TableHead className="text-center">Restock Threshold</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <div className="h-10 w-full animate-pulse bg-muted rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : getCurrentItems().length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              getCurrentItems().map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-center">
                    <StockLevelBadge stock={item.stock} threshold={item.threshold} />
                  </TableCell>
                  <TableCell className="text-center">{item.threshold}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={item.stock === 0 ? "default" : "outline"}
                      disabled={item.stock > item.threshold}
                      onClick={() => handleReorder(item.id)}
                    >
                      Reorder
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
          >
            Next
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

function StockLevelBadge({ stock, threshold }: { stock: number, threshold: number }) {
  if (stock === 0) {
    return (
      <Badge variant="destructive" className="w-24 justify-center">
        Out of Stock
      </Badge>
    )
  } else if (stock < threshold) {
    return (
      <Badge variant="outline" className="text-amber-500 border-amber-500 w-24 justify-center">
        Low: {stock}
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="text-green-500 border-green-500 w-24 justify-center">
        Good: {stock}
      </Badge>
    )
  }
}

// Mock data for inventory items
const mockInventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "WH-1001",
    stock: 5,
    threshold: 10,
  },
  {
    id: "2",
    name: "Smart Watch",
    sku: "SW-2034",
    stock: 3,
    threshold: 8,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    sku: "BS-3045",
    stock: 7,
    threshold: 15,
  },
  {
    id: "4",
    name: "USB-C Cable",
    sku: "UC-4056",
    stock: 12,
    threshold: 20,
  },
  {
    id: "5",
    name: "Laptop Sleeve",
    sku: "LS-5067",
    stock: 20,
    threshold: 15,
  },
  {
    id: "6",
    name: "Wireless Mouse",
    sku: "WM-6078",
    stock: 0,
    threshold: 10,
  },
  {
    id: "7",
    name: "Desk Lamp",
    sku: "DL-7089",
    stock: 15,
    threshold: 10,
  },
  {
    id: "8",
    name: "Keyboard",
    sku: "KB-8090",
    stock: 8,
    threshold: 12,
  },
  {
    id: "9",
    name: "Monitor Stand",
    sku: "MS-9001",
    stock: 4,
    threshold: 6,
  },
  {
    id: "10",
    name: "Webcam",
    sku: "WC-1011",
    stock: 0,
    threshold: 5,
  },
  {
    id: "11",
    name: "External Hard Drive",
    sku: "EHD-1112",
    stock: 6,
    threshold: 8,
  },
  {
    id: "12",
    name: "Wireless Charger",
    sku: "WC-1213",
    stock: 9,
    threshold: 10,
  },
]

