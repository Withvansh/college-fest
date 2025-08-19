import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, convertUsdToInr, USD_TO_INR_RATE } from '@/lib/currency';
import { RefreshCw, TrendingUp, Calculator } from 'lucide-react';

const CurrencyConverter = () => {
  const [usdAmount, setUsdAmount] = useState('');
  const [inrAmount, setInrAmount] = useState('');
  const [conversionHistory, setConversionHistory] = useState<Array<{usd: number, inr: number, timestamp: Date}>>([]);
  const { toast } = useToast();

  const handleUsdToInr = () => {
    const usd = parseFloat(usdAmount);
    if (isNaN(usd)) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid USD amount',
        variant: 'destructive'
      });
      return;
    }

    const inr = convertUsdToInr(usd);
    setInrAmount(inr.toString());
    
    setConversionHistory(prev => [
      { usd, inr, timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);

    toast({
      title: 'Conversion Complete',
      description: `$${usd} = ${formatCurrency(inr)}`,
    });
  };

  const handleInrToUsd = () => {
    const inr = parseFloat(inrAmount);
    if (isNaN(inr)) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid INR amount',
        variant: 'destructive'
      });
      return;
    }

    const usd = inr / USD_TO_INR_RATE;
    setUsdAmount(usd.toFixed(2));
    
    setConversionHistory(prev => [
      { usd, inr, timestamp: new Date() },
      ...prev.slice(0, 4)
    ]);

    toast({
      title: 'Conversion Complete', 
      description: `${formatCurrency(inr)} = $${usd.toFixed(2)}`,
    });
  };

  const clearAll = () => {
    setUsdAmount('');
    setInrAmount('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Currency Converter
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Rate: 1 USD = ₹{USD_TO_INR_RATE}
            </Badge>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* USD Input */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="usd">USD Amount</Label>
                <Input
                  id="usd"
                  type="number"
                  placeholder="Enter USD amount"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button onClick={handleUsdToInr} className="w-full">
                Convert to INR →
              </Button>
            </div>

            {/* INR Input */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="inr">INR Amount</Label>
                <Input
                  id="inr"
                  type="number"
                  placeholder="Enter INR amount"
                  value={inrAmount}
                  onChange={(e) => setInrAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Button onClick={handleInrToUsd} className="w-full" variant="outline">
                ← Convert to USD
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversion History */}
      {conversionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionHistory.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">${item.usd.toFixed(2)}</span>
                    <span className="text-gray-500">⇄</span>
                    <span className="font-medium">{formatCurrency(item.inr)}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {item.timestamp.toLocaleTimeString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { usd: 100, label: 'Hundred' },
              { usd: 1000, label: 'Thousand' },
              { usd: 10000, label: 'Ten K' },
              { usd: 100000, label: 'Hundred K' }
            ].map((item) => (
              <div key={item.usd} className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900">${item.usd}</div>
                <div className="text-sm text-blue-700">{item.label}</div>
                <div className="text-lg font-bold text-green-600">
                  {formatCurrency(convertUsdToInr(item.usd))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrencyConverter;