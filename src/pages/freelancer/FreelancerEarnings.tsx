import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const FreelancerEarnings = () => {
  const { user, logout } = useAuth();

  const earningsData = {
    totalEarnings: 12450,
    currentBalance: 3250,
    pendingPayments: 2100,
    thisMonth: 1850,
    lastMonth: 2400,
  };

  const transactions = [
    {
      id: 1,
      type: 'earning',
      description: 'E-commerce Website - Final Payment',
      amount: 1500,
      date: '2024-01-20',
      status: 'completed',
      client: 'TechCorp Solutions',
    },
    {
      id: 2,
      type: 'withdrawal',
      description: 'Bank Transfer - Wells Fargo',
      amount: -800,
      date: '2024-01-18',
      status: 'completed',
      method: 'Bank Transfer',
    },
    {
      id: 3,
      type: 'earning',
      description: 'Mobile App UI Design - Milestone 2',
      amount: 600,
      date: '2024-01-15',
      status: 'pending',
      client: 'StartupXYZ',
    },
    {
      id: 4,
      type: 'earning',
      description: 'API Integration Project',
      amount: 800,
      date: '2024-01-12',
      status: 'completed',
      client: 'DataFlow Inc',
    },
  ];

  const upcomingPayouts = [
    {
      id: 1,
      project: 'Mobile App UI Design',
      amount: 1200,
      dueDate: '2024-01-25',
      client: 'StartupXYZ',
    },
    {
      id: 2,
      project: 'Website Redesign',
      amount: 900,
      dueDate: '2024-01-28',
      client: 'Creative Agency',
    },
  ];

  const handleWithdraw = () => {
    toast.success('Withdrawal request submitted successfully!');
  };

  const handleDownloadReport = () => {
    toast.success('Earnings report downloaded successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Earnings & Payouts</h1>
              <p className="text-gray-600">Track your income and manage withdrawals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" asChild>
                <Link to="/freelancer/dashboard">Back to Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${earningsData.totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${earningsData.currentBalance.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Ready to withdraw</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ${earningsData.pendingPayments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting client approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earningsData.thisMonth.toLocaleString()}</div>
              <p className="text-xs text-green-600">
                {earningsData.thisMonth > earningsData.lastMonth ? '+' : ''}
                {(
                  ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) *
                  100
                ).toFixed(1)}
                % from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button
                  onClick={handleWithdraw}
                  disabled={earningsData.currentBalance < 50}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{transaction.description}</h4>
                          <span
                            className={`text-lg font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {transaction.amount > 0 ? '+' : ''}$
                            {Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            {transaction.client ? transaction.client : transaction.method} •{' '}
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Payouts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingPayouts.map(payout => (
                    <div key={payout.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{payout.project}</h4>
                        <span className="text-green-600 font-bold">
                          ${payout.amount.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{payout.client}</p>
                      <p className="text-xs text-gray-600">
                        Due: {new Date(payout.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 text-sm mb-2">
                    Withdrawal Information
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Minimum withdrawal: ₹4,200</li>
                    <li>• Processing time: 2-3 business days</li>
                    <li>• No withdrawal fees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
