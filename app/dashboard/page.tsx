'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  lowStockItems: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    lowStockItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll simulate loading with a timeout
    const timer = setTimeout(() => {
      setStats({
        totalProducts: 24,
        totalCustomers: 18,
        totalOrders: 12,
        lowStockItems: 5,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.totalCustomers}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
            ) : (
              <p className="text-2xl font-bold">{stats.lowStockItems}</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent orders to display.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-muted"></div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No low stock products to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

