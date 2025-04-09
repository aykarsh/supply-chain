'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  description: string | null;
  category: {
    id: string;
    name: string;
  };
  inventory?: {
    quantity: number;
    minQuantity: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UseProductsOptions {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async (params: UseProductsOptions) => {
    setLoading(true);
    setError(null);

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`/api/products?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
      setPagination(data.pagination || {
        total: 0,
        page: 1,
        limit: params.limit || 10,
        pages: 1,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts({
      search: options.search,
      category: options.category,
      page: options.page || 1,
      limit: options.limit || 10,
    });
  }, [options.search, options.category, options.page, options.limit]);

  const changePage = (newPage: number) => {
    fetchProducts({
      ...options,
      page: newPage,
    });
  };

  return {
    products,
    pagination,
    loading,
    error,
    changePage,
    refresh: () => fetchProducts(options),
  };
}