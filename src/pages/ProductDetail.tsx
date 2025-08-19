
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Download, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { digitalProductsApi, DigitalProduct } from '@/lib/api/digitalProducts';
import { toast } from 'sonner';
import { ProductCheckoutModal } from '@/components/products/ProductCheckoutModal';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    try {
      const data = await digitalProductsApi.getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    setCheckoutOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              {product.thumbnail_url ? (
                <img 
                  src={product.thumbnail_url} 
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Download className="h-24 w-24 text-muted-foreground" />
              )}
            </div>
            
            {/* File Type Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">File Type</p>
                    <p className="text-muted-foreground">{product.file_type || 'Digital Download'}</p>
                  </div>
                  <Download className="h-6 w-6 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">
                {product.short_description}
              </p>
              <div className="text-4xl font-bold text-primary mb-6">
                ${product.price}
              </div>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    What's Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Purchase */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full mb-4"
                  onClick={handleBuyNow}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Buy Now - ${product.price}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  <p>✅ Instant download after purchase</p>
                  <p>✅ 30-day money-back guarantee</p>
                  <p>✅ Professional templates included</p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How do I download my purchase?</h4>
                  <p className="text-muted-foreground text-sm">
                    After successful payment, you'll receive an instant download link via email. 
                    You can also access your purchases from your account dashboard.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">What formats are included?</h4>
                  <p className="text-muted-foreground text-sm">
                    Our {product.file_type} includes multiple formats for maximum compatibility 
                    with your preferred software and applications.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Can I customize the templates?</h4>
                  <p className="text-muted-foreground text-sm">
                    Yes! All templates are fully customizable and come with editable source files 
                    so you can adapt them to your specific needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <ProductCheckoutModal
        product={product}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;
