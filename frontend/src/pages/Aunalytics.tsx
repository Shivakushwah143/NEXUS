import { useBlog } from '../context/BlogContext';
import Card from '../components/ui/Card';
import { BarChart, PieChart } from '../components/ui/Charts';

const AnalyticsPage = () => {
  const { products } = useBlog();
  
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + product.price, 0);
  const avgPrice = totalProducts > 0 ? totalValue / totalProducts : 0;
  
  // Get top 5 viewed products
  const popularProducts = [...products]
    .sort((a, b) => (b.views || b.price) - (a.views || a.price))
    .slice(0, 5);

  // Sales data
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [65, 59, 80, 81, 56, 72]
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Analytics</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-yellow-200 bg-yellow-50 shadow-sm hover:shadow-md transition-shadow">
          <Card.Header className="border-b border-yellow-200">
            <Card.Title className="text-yellow-800">Total Products</Card.Title>
          </Card.Header>
          <Card.Content className="text-4xl font-bold text-yellow-600 p-4">
            {totalProducts}
          </Card.Content>
        </Card>
        
        <Card className="border border-orange-200 bg-orange-50 shadow-sm hover:shadow-md transition-shadow">
          <Card.Header className="border-b border-orange-200">
            <Card.Title className="text-orange-800">Inventory Value</Card.Title>
          </Card.Header>
          <Card.Content className="text-4xl font-bold text-orange-600 p-4">
            ${totalValue.toLocaleString()}
          </Card.Content>
        </Card>
        
        <Card className="border border-pink-200 bg-pink-50 shadow-sm hover:shadow-md transition-shadow">
          <Card.Header className="border-b border-pink-200">
            <Card.Title className="text-pink-800">Avg. Price</Card.Title>
          </Card.Header>
          <Card.Content className="text-4xl font-bold text-pink-600 p-4">
            ${avgPrice.toFixed(2)}
          </Card.Content>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-orange-200 bg-orange-50 shadow-sm">
          <Card.Header className="border-b border-orange-200">
            <Card.Title className="text-orange-800">Monthly Sales</Card.Title>
          </Card.Header>
          <Card.Content className="h-72 p-4">
            <BarChart 
              data={salesData.values}
              labels={salesData.labels}
              colors={['#f59e0b', '#f97316', '#ec4899']} // yellow-500, orange-500, pink-500
            />
          </Card.Content>
        </Card>
        
        <Card className="border border-yellow-200 bg-yellow-50 shadow-sm">
          <Card.Header className="border-b border-yellow-200">
            <Card.Title className="text-yellow-800">Top Products</Card.Title>
          </Card.Header>
          <Card.Content className="h-72 p-4">
            <PieChart
              data={popularProducts.map(p => p.views || p.price)}
              labels={popularProducts.map(p => p.title)}
              colors={[
                '#f59e0b', // yellow-500
                '#f97316', // orange-500
                '#ec4899', // pink-500
                '#fbbf24', // yellow-400
                '#fb923c'  // orange-400
              ]}
            />
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-pink-200 bg-pink-50 shadow-sm">
        <Card.Header className="border-b border-pink-200">
          <Card.Title className="text-pink-800">Recent Activity</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="space-y-4">
            {products.slice(0, 5).map(product => (
              <div key={product._id} className="flex justify-between items-center border-b border-pink-100 pb-3 last:border-0">
                <span className="font-medium text-pink-700">{product.title}</span>
                <span className="text-yellow-600 font-semibold">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AnalyticsPage;