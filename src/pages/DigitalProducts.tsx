import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Download, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import axios from '@/lib/utils/axios';
import PhonePePayment from '@/components/PhonePePayment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Footer from '@/components/Footer';
import FloatingActionButtons from '@/components/FloatingActionButtons';

interface DigitalProduct {
  id: string;
  title: string;
  short_description?: string;
  benefits?: string[];
  category: string;
  price: number;
  thumbnail_url?: string;
  created_at: string;
  product_file_url?: string;
  purchased_by?: string[];
}

const DigitalProducts = () => {
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>([]);
  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [purchasedProduct, setPurchasedProduct] = useState<DigitalProduct | null>(null);

  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  const loadProducts = async () => {
    try {
      const { data } = await axios.get('/digitalproducts');
      setProducts(data);
      setFilteredProducts(data);
    } catch (error: any) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await axios.get('/digitalproducts');
      const uniqueCategories = Array.from(new Set(data.map((p: DigitalProduct) => p.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange && priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  };

  const purchaseProduct = async (product: DigitalProduct) => {
    try {
      if (!userId || !token) {
        toast.error('Please login to purchase');
        return;
      }

      if (product.purchased_by?.includes(userId)) {
        toast.info('You already own this product 🎉');
        setPurchasedProduct(product);
        setSuccessModalOpen(true);
        return;
      }

      const { data } = await axios.put(
        `/digitalproducts/purchaseproduct/${product.id}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(data.message || 'Product purchased successfully ✅');
      setPurchasedProduct(product);
      setSuccessModalOpen(true);
      await loadProducts();
    } catch (error: any) {
      console.error('Error purchasing product:', error);
      toast.error(error.response?.data?.message || 'Failed to purchase product ❌');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-foreground mb-4">Digital Products Store</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Professional templates, forms, and toolkits to streamline your business processes
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-100">₹0 - ₹100</SelectItem>
                <SelectItem value="100-200">₹100 - ₹200</SelectItem>
                <SelectItem value="200-300">₹200 - ₹300</SelectItem>
                <SelectItem value="300">₹300+</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const isPurchased = userId ? product.purchased_by?.includes(userId) : false;

              return (
                <Card
                  key={product.id}
                  className="h-full flex flex-col hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="flex-shrink-0">
                    <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center">
                      {product.thumbnail_url ? (
                        <img
                          src={product.thumbnail_url}
                          alt={product.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <Download className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{product.category}</Badge>
                      <span className="text-2xl font-bold text-primary">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(product.price)}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      Original Price: <del>{`${product.price}`}</del> Now: ₹0
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {product.short_description}
                    </p>

                    {product.benefits && product.benefits.length > 0 && (
                      <div className="space-y-1">
                        <h4 className="font-semibold text-sm">Key Benefits:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {product.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1 h-1 bg-primary rounded-full mr-2 flex-shrink-0"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex-shrink-0">
                    <div className="w-full space-y-2">
                      {!isPurchased ? (
                        <PhonePePayment productId={product.id} className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Buy Now - ₹{product.price}
                        </PhonePePayment>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            setPurchasedProduct(product);
                            setSuccessModalOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ✅ Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Successful 🎉</DialogTitle>
            <DialogDescription>
              {purchasedProduct?.title} has been unlocked. Click below to download your package.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted rounded-md p-4 my-4">
            <p className="text-sm font-medium text-foreground mb-2">Download Link:</p>
            <a
              href={purchasedProduct?.product_file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:underline break-all"
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              {purchasedProduct?.product_file_url}
            </a>
          </div>

          <DialogFooter>
            <Button onClick={() => setSuccessModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
       {/* <Footer />
      <FloatingActionButtons /> */}
    </div>
  );
};

export default DigitalProducts;
