// Currency conversion utilities for INR

export const USD_TO_INR_RATE = 83.5; // Approximate rate, in real app this would be fetched from API

export const formatCurrency = (amount: number | string, currency: 'USD' | 'INR' = 'INR'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '₹0';
  
  if (currency === 'INR') {
    // Indian number format with commas
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  }
  
  // For USD (convert to INR first)
  const inrAmount = numAmount * USD_TO_INR_RATE;
  return formatCurrency(inrAmount, 'INR');
};

export const convertUsdToInr = (usdAmount: number): number => {
  return usdAmount * USD_TO_INR_RATE;
};

export const formatSalary = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) return '₹0';
  
  // For large amounts like salary, show in lakhs/crores
  if (numAmount >= 10000000) { // 1 crore
    return `₹${(numAmount / 10000000).toFixed(1)} Cr`;
  } else if (numAmount >= 100000) { // 1 lakh
    return `₹${(numAmount / 100000).toFixed(1)} L`;
  } else {
    return formatCurrency(numAmount);
  }
};

export const parseCurrency = (currencyString: string): number => {
  // Remove currency symbols and convert to number
  return parseFloat(currencyString.replace(/[₹,]/g, '')) || 0;
};

// Common salary ranges in INR
export const SALARY_RANGES = {
  FRESHER: { min: 300000, max: 600000 }, // 3-6 LPA
  JUNIOR: { min: 600000, max: 1200000 }, // 6-12 LPA  
  MID: { min: 1200000, max: 2500000 }, // 12-25 LPA
  SENIOR: { min: 2500000, max: 5000000 }, // 25-50 LPA
  LEAD: { min: 5000000, max: 10000000 }, // 50L-1Cr
  EXECUTIVE: { min: 10000000, max: 50000000 } // 1-5 Cr
};

// Travel allowance rates in INR
export const TRAVEL_ALLOWANCES = {
  LOCAL: 500, // Per day
  DOMESTIC: 2000, // Per day
  INTERNATIONAL: 8000, // Per day
  KM_RATE: 12 // Per km for vehicle
};