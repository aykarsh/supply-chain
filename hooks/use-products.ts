'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  cost: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  inventory: {
    quantity: number;
    minQuantity: number;
    maxQuantity: number | null;
    location: string | null;
  } | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseProductsProps {
  initialPage?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export function useProducts({
  initialPage = 1,
  limit = 10,
  search = '',
  category = '',
}: UseProductsProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: initialPage,
    limit,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (page = pagination.page) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      });
      
      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      fetchProducts(newPage);
    }
  };

  useEffect(() => {
    fetchProducts(initialPage);
  }, [search, category, limit, initialPage]);

  return {
    products,
    pagination,
    loading,
    error,
    changePage,
    refetch: fetchProducts,
  };
}