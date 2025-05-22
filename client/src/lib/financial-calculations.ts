export const formatCurrency = (amount: number, currency: string = "₹"): string => {
  return `${currency}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString("en-IN");
};

export const formatPercentage = (percent: number): string => {
  const sign = percent >= 0 ? "+" : "";
  return `${sign}${percent.toFixed(2)}%`;
};

export const calculatePnL = (invested: number, current: number) => {
  const pnl = current - invested;
  const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
  return { pnl, pnlPercent };
};

export const calculateTotalInvestment = (units: number, price: number): number => {
  return units * price;
};

export const parseCSV = (csvText: string): any[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV must have header and at least one data row');
  
  const headers = lines[0].split(',').map(h => h.trim());
  const expectedHeaders = ['Name', 'Units', 'Buying Price', 'Purchase Date', 'Type'];
  
  // Validate headers
  const hasAllHeaders = expectedHeaders.every(expected => 
    headers.some(header => header.toLowerCase() === expected.toLowerCase())
  );
  
  if (!hasAllHeaders) {
    throw new Error(`CSV must contain headers: ${expectedHeaders.join(', ')}`);
  }
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;
    
    const row: any = {};
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase();
      if (normalizedHeader === 'name') row.name = values[index];
      else if (normalizedHeader === 'units') row.units = values[index];
      else if (normalizedHeader === 'buying price') row.buyingPrice = values[index];
      else if (normalizedHeader === 'purchase date') row.purchaseDate = values[index];
      else if (normalizedHeader === 'type') row.type = values[index];
    });
    
    data.push(row);
  }
  
  return data;
};

export const validatePortfolioData = (data: any[]): { valid: any[], invalid: any[], errors: string[] } => {
  const valid = [];
  const invalid = [];
  const errors = [];
  
  for (const item of data) {
    try {
      // Basic validation
      if (!item.name || !item.units || !item.buyingPrice || !item.purchaseDate || !item.type) {
        throw new Error('Missing required fields');
      }
      
      // Validate numeric fields
      const units = parseFloat(item.units);
      const price = parseFloat(item.buyingPrice);
      
      if (isNaN(units) || units <= 0) {
        throw new Error('Units must be a positive number');
      }
      
      if (isNaN(price) || price <= 0) {
        throw new Error('Buying price must be a positive number');
      }
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(item.purchaseDate)) {
        throw new Error('Purchase date must be in YYYY-MM-DD format');
      }
      
      // Validate type
      const validTypes = ['Stock', 'SIP', 'Crypto'];
      if (!validTypes.includes(item.type)) {
        throw new Error('Type must be one of: Stock, SIP, Crypto');
      }
      
      valid.push(item);
    } catch (error) {
      invalid.push(item);
      errors.push(`${item.name || 'Unknown'}: ${error.message}`);
    }
  }
  
  return { valid, invalid, errors };
};

export const calculateAssetAllocation = (portfolio: any[]): any[] => {
  const allocation = new Map<string, number>();
  let total = 0;
  
  portfolio.forEach(item => {
    const value = item.currentValue || item.invested || 0;
    allocation.set(item.type, (allocation.get(item.type) || 0) + value);
    total += value;
  });
  
  const colors = {
    'Stock': '#00d4aa',
    'SIP': '#0f3460', 
    'Crypto': '#ffd93d',
    'Cash': '#8b949e'
  };
  
  return Array.from(allocation.entries()).map(([type, value]) => ({
    type,
    value,
    percentage: total > 0 ? (value / total) * 100 : 0,
    color: colors[type as keyof typeof colors] || '#8b949e'
  }));
};

export const generatePerformanceData = (portfolio: any[]): any => {
  // Generate mock performance data - in real app, this would come from historical data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValue = portfolio.reduce((sum, item) => sum + (item.invested || 0), 0);
  
  const data = months.map((month, index) => {
    const growth = 1 + (Math.random() * 0.1 - 0.05) + (index * 0.02); // Random growth with upward trend
    return {
      month,
      value: baseValue * growth
    };
  });
  
  return {
    labels: months,
    datasets: [{
      label: 'Portfolio Value',
      data: data.map(d => d.value),
      borderColor: '#00d4aa',
      backgroundColor: 'rgba(0, 212, 170, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4
    }]
  };
};
