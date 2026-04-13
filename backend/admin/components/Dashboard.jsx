import React from "react";
import { Box, H2, Text, Badge, Icon, Button } from "@adminjs/design-system";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';

// --- Real-time Analytics Component ---

// --- UI Components ---

const SummaryCard = ({ title, value, icon, color, gradient, chartData }) => (
  <Box 
    style={{ 
      background: gradient || '#ffffff', 
      padding: '24px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '160px',
      color: gradient ? 'white' : 'black'
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <Text fontSize="14px" fontWeight="500" opacity={gradient ? 0.8 : 0.6}>{title}</Text>
        <H2 mt="xs" color="inherit" fontWeight="700">${value}</H2>
      </Box>
      <Box 
        style={{ 
          background: gradient ? 'rgba(255,255,255,0.2)' : `${color}15`, 
          padding: '10px', 
          borderRadius: '12px' 
        }}
      >
        <Icon icon={icon} color={gradient ? 'white' : color} />
      </Box>
    </Box>
    <Box height="40px" mt="sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData || []}>
          <Area 
            type="monotone" 
            dataKey="val" 
            stroke={gradient ? 'rgba(255,255,255,0.8)' : color} 
            fill={gradient ? 'rgba(255,255,255,0.2)' : `${color}10`} 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

const Dashboard = (props) => {
  const { currentAdmin, data } = props;

  // Real data from backend handler (All Models Integrated)
  const { 
    totalIncome = 0, 
    productCount = 0, 
    categoryCount = 0, 
    orderCount = 0,
    totalUsers = 0,
    settingCount = 0,
    bestSellers = [],
    categoryData = [],
    salesData = [],
    latestOrderId = 'Searching...',
    lastUpdate = 'Pending...'
  } = (data || {});

  return (
    <Box style={{ background: '#f8f9fa', minHeight: '100vh', padding: '32px' }}>
      <Box mb="xl" display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Box display="flex" alignItems="center" mb="xs">
            <H2 fontWeight="700">Enterprise Analytics Suite</H2>
            <Badge variant="success" ml="md" style={{ borderRadius: '20px' }}>
              <Box display="flex" alignItems="center">
                <Box style={{ width: '8px', height: '8px', background: '#38a169', borderRadius: '50%', marginRight: '8px' }} />
                Latest Transaction: Order #{latestOrderId}
              </Box>
            </Badge>
          </Box>
          <Text color="#718096">
            Live ecosystem data. Last synced at: <strong>{lastUpdate}</strong>
          </Text>
        </Box>
        <Button variant="primary">
          <Icon icon="Download" /> Export Corporate Report
        </Button>
      </Box>

      {/* Top Section: Sales Overview Chart */}
      <Box 
        mb="xl" 
        style={{ 
          background: '#ffffff', 
          padding: '24px', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box mb="lg">
          <H2 fontSize="18px">Global Revenue Trend</H2>
          <Text color="#718096">Real-time income aggregation from all sales channels</Text>
        </Box>
        <Box flexGrow={1} height="350px">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf2f7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#718096', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#3d82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3d82f6', strokeWidth: 2, stroke: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ec4899" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Text color="#a0aec0">Waiting for live transaction data...</Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Summary Cards Row */}
      <Box 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '24px', 
          marginBottom: '32px' 
        }}
      >
        <SummaryCard 
          title="Total Revenue" 
          value={totalIncome.toLocaleString()} 
          icon="DollarSign" 
          gradient="linear-gradient(135deg, #3d82f6 0%, #1e40af 100%)"
        />
        <SummaryCard 
          title="Total Customers" 
          value={totalUsers.toLocaleString()} 
          icon="Users" 
          color="#ec4899"
        />
        <SummaryCard 
          title="Product Catalog" 
          value={productCount} 
          icon="Package" 
          color="#3d82f6"
        />
        <SummaryCard 
          title="Orders Processed" 
          value={orderCount} 
          icon="ShoppingBag" 
          color="#f59e0b"
        />
      </Box>

      {/* Bottom Section */}
      <Box 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 2fr', 
          gap: '24px' 
        }}
      >
        {/* Categories Radar Chart */}
        <Box 
          style={{ 
            background: '#ffffff', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            minHeight: '350px'
          }}
        >
          <Box mb="lg">
            <H2 fontSize="18px">Inventory Distribution</H2>
            <Text color="#718096">Categorical concentration of assets</Text>
          </Box>
          <Box height="280px">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                  <PolarGrid stroke="#edf2f7" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#718096', fontSize: 12 }} />
                  <Radar name="Products" dataKey="A" stroke="#3d82f6" fill="#3d82f6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Text color="#a0aec0">No categories mapped</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Best Sellers Table */}
        <Box 
          style={{ 
            background: '#ffffff', 
            padding: '24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Box mb="lg" display="flex" justifyContent="space-between" alignItems="center">
            <H2 fontSize="18px">Top Selling Products</H2>
            <Button variant="text" size="sm">Full Sales Report</Button>
          </Box>
          <Box as="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#718096' }}>Product Name</th>
                <th style={{ textAlign: 'center', padding: '12px', color: '#718096' }}>Units Sold</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#718096' }}>Price</th>
                <th style={{ textAlign: 'right', padding: '12px', color: '#718096' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                  <td style={{ padding: '16px 12px', fontWeight: '500' }}>{p.name}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    <Badge variant="success">{p.totalSold}</Badge>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>${p.price.toLocaleString()}</td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <Text color="#38a169" fontWeight="600">Top Seller</Text>
                  </td>
                </tr>
              ))}
              {bestSellers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#a0aec0' }}>
                    No sales recorded yet. Start selling to see your top products!
                  </td>
                </tr>
              )}
            </tbody>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
