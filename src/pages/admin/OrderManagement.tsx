import React, { useEffect, useState } from 'react';
import { Download, Search, Calendar, Package } from 'lucide-react';
import { IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Types
interface OrderWithProduct {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  purchase_date: string;
  amount_paid: number;
  payment_status: string;
  order_status: string;
  download_link: string | null;
  digital_products: {
    title: string;
    category: string;
  };
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders whenever search term or orders change
  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('digital_orders')
        .select(`
          id,
          buyer_name,
          buyer_email,
          buyer_phone,
          purchase_date,
          amount_paid,
          payment_status,
          order_status,
          download_link,
          digital_products!fk_product (
            title,
            category
          )
        `);

      if (error) {
        console.error('Supabase error:', error);
        toast.error('Failed to load orders');
        return;
      }

      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error: any) {
      console.error('Unexpected error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!searchTerm) {
      setFilteredOrders(orders);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = orders.filter(order =>
      order.buyer_name.toLowerCase().includes(term) ||
      order.buyer_email.toLowerCase().includes(term) ||
      order.digital_products.title.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Product', 'Customer Name', 'Email', 'Phone', 'Amount', 'Date', 'Status'],
      ...filteredOrders.map(order => [
        order.id,
        order.digital_products.title,
        order.buyer_name,
        order.buyer_email,
        order.buyer_phone || '',
        order.amount_paid.toString(),
        new Date(order.purchase_date).toLocaleDateString(),
        order.order_status,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.amount_paid, 0);
  const todayOrders = orders.filter(order =>
    new Date(order.purchase_date).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={exportOrders}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard icon={Package} label="Total Orders" value={orders.length} />
        <StatsCard icon={Calendar} label="Today's Orders" value={todayOrders} highlight="blue" />
        <StatsCard icon={IndianRupee} label="Total Revenue" value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue)} highlight="green" />
        <StatsCard icon={IndianRupee} label="Avg Order Value" value={orders.length ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue / orders.length) : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(0)} />

      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.digital_products.title}</div>
                      <Badge variant="secondary" className="mt-1">{order.digital_products.category}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.buyer_name}</div>
                      <div className="text-sm text-muted-foreground">{order.buyer_email}</div>
                      {order.buyer_phone && <div className="text-sm text-muted-foreground">{order.buyer_phone}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.amount_paid)}
</TableCell>

                  <TableCell>{new Date(order.purchase_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={order.payment_status === 'completed' ? 'default' : 'secondary'}>
                        {order.payment_status}
                      </Badge>
                      <Badge variant={order.order_status === 'confirmed' ? 'default' : 'secondary'}>
                        {order.order_status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No orders found</p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-2">
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Small Reusable Card Component for Stats
const StatsCard = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon?: React.ElementType;
  label: string;
  value: string | number;
  highlight?: 'blue' | 'green';
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center">
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${highlight === 'blue' ? 'text-blue-600' : ''} ${highlight === 'green' ? 'text-green-600' : ''}`}>
        {value}
      </div>
    </CardContent>
  </Card>
);

export default OrderManagement;
