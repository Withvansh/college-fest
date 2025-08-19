import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { digitalProductsApi, DigitalProduct } from '@/lib/api/digitalProducts';
import { toast } from 'sonner';
import { ProductCheckoutModal } from '@/components/products/ProductCheckoutModal';
import { supabase } from '@/integrations/supabase/client';

console.log('DigitalProducts component mounted!');
const DigitalProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<DigitalProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
  loadProducts();
  loadCategories();
}, []);

useEffect(() => {
  filterProducts();
}, [products, searchTerm, selectedCategory, sortBy, priceRange]);

  // Sanity check: is user session connected properly?
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log("Supabase session user:", data.session?.user?.id);
  });
}, []);

  useEffect(() => {
  supabase
    .from('digital_products')
    .select('*')
    .eq('is_active', true)
    .then(({ data, error }) => {
      console.log('Direct API Data from Supabase:', data);
      console.log('Direct API Error:', error);
    });
}, []);


  
const loadProducts = async () => {
  try {
    console.log('Fetching products...');

    // 🔍 Direct Supabase Fetch for Debugging (Add this block here)
    const { data: debugData, error: debugError } = await supabase
      .from('digital_products')
      .select('*')
      .eq('is_active', true);

    console.log('🔥 Debug - Direct Supabase Query Data:', debugData);
    console.log('🔥 Debug - Direct Supabase Query Error:', debugError);

    // ✅ Existing Code
    const data = await digitalProductsApi.getProducts();
    console.log('Fetched products:', data);

    if (!data || data.length === 0) {
      console.warn('No active products found.');
    }

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
      const data = await digitalProductsApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
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

    // Sort
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleBuyNow = (product: DigitalProduct) => {
    setSelectedProduct(product);
    setCheckoutOpen(true);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
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
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">Digital Products Store</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Professional templates, forms, and toolkits to streamline your business processes
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range */}
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

            {/* Sort */}
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

          {/* Results count */}
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange('all');
            }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="h-full flex flex-col hover:shadow-lg transition-shadow cursor-pointer">
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
  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
</span>

                  </div>
                  <CardTitle className="text-lg" onClick={() => handleProductClick(product.id)}>
                    {product.title}
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
                        {product.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center">
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
                    <Button 
                      className="w-full" 
                      onClick={() => handleBuyNow(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => handleProductClick(product.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <ProductCheckoutModal
        product={selectedProduct}
        open={checkoutOpen}
        onClose={() => {
          setCheckoutOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default DigitalProducts;
