import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductCard } from './ProductCard'; 
import Loading from './Loading';

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  colour?: string;
  size?: string[];
}

const MyPurchases = () => {
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:5000/api/v1/user/purchasedproducts',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        setPurchasedProducts(response.data.purchasedProducts);
      } catch (err) {
        setError( 'Failed to fetch purchases');
       
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedProducts();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6">My Purchased Products</h1>
        
        {purchasedProducts.length === 0 ? (
          <div className="text-white text-center p-8 bg-gray-900 rounded-lg">
            You haven't purchased any products yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchasedProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                title={product.title}
                price={product.price.toString()}
                imageUrl={product.image}
                imageClassName="w-full h-52 object-cover rounded-lg bg-gray-800"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPurchases;