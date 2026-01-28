import { useState } from 'react';
import CreateProduct from '../pages/CreateProduct';
import Products from '../pages/Products';
import Aunalytics from './Aunalytics';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'add' | 'products' | 'Aunalytics'>('add');

  return (
    <div className="p-4 bg-gray-500 min-h-screen">
      <div className="flex border-b ">
        <button
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeTab === 'add' 
              ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Add Product
        </button>
        <button
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeTab === 'products' 
              ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`py-2 px-4 font-medium transition-colors duration-200 ${
            activeTab === 'Aunalytics' 
              ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50' 
              : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
          }`}
          onClick={() => setActiveTab('Aunalytics')}
        >
          Analytics
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-500 rounded-lg shadow-sm border ">
        {activeTab === 'add' && <CreateProduct />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'Aunalytics' && <Aunalytics />}
      </div>
    </div>
  );
};

export default Dashboard;