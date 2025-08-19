
import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { digitalProductsApi, DigitalProduct } from '@/lib/api/digitalProducts';
import { toast } from 'sonner';

interface ProductFormModalProps {
  product: DigitalProduct | null;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  open,
  onClose,
  onSubmit
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    category: '',
    price: 0,
    thumbnail_url: '',
    product_file_url: '',
    file_type: '',
    benefits: [''],
    is_active: true
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        short_description: product.short_description || '',
        category: product.category,
        price: product.price,
        thumbnail_url: product.thumbnail_url || '',
        product_file_url: product.product_file_url || '',
        file_type: product.file_type || '',
        benefits: product.benefits || [''],
        is_active: product.is_active
      });
    } else {
      // Reset form for new product
      setFormData({
        title: '',
        short_description: '',
        category: '',
        price: 0,
        thumbnail_url: '',
        product_file_url: '',
        file_type: '',
        benefits: [''],
        is_active: true
      });
    }
  }, [product, open]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits
    }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        benefits: newBenefits
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || formData.price <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Filter out empty benefits
      const filteredBenefits = formData.benefits.filter(benefit => benefit.trim() !== '');
      
      const productData = {
        ...formData,
        benefits: filteredBenefits.length > 0 ? filteredBenefits : []
      };

      if (product) {
        // Update existing product
        await digitalProductsApi.updateProduct(product.id, productData);
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await digitalProductsApi.createProduct(productData);
        toast.success('Product created successfully');
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="HR Toolkit Complete"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => handleInputChange('short_description', e.target.value)}
                    placeholder="Brief description of the product..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="HR Templates"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="299.00"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file_type">File Type</Label>
                  <Input
                    id="file_type"
                    value={formData.file_type}
                    onChange={(e) => handleInputChange('file_type', e.target.value)}
                    placeholder="PDF Package, Word Documents, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* File URLs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Files & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                  <Input
                    id="thumbnail_url"
                    type="url"
                    value={formData.thumbnail_url}
                    onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_file_url">Product File URL</Label>
                  <Input
                    id="product_file_url"
                    type="url"
                    value={formData.product_file_url}
                    onChange={(e) => handleInputChange('product_file_url', e.target.value)}
                    placeholder="https://example.com/product-files.zip"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Benefits
                  <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder="Enter benefit..."
                      className="flex-1"
                    />
                    {formData.benefits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  />
                  <Label>Active (visible to customers)</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                product ? 'Update Product' : 'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
