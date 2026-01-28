// import { useBlog } from '../context/BlogContext';
// import { ProductCard } from './ProductCard';
// import Loading from './Loading';
// import Button from '../components/ui/Button';

// const Featured = () => {
//   const { products, loading } = useBlog();

//   if (loading) {
//     return <Loading />;
//   }

//   if (!products.length) {
//     return <div>No featured products found</div>;
//   }

//   const featuredProducts = products.slice(0, 5);

//   return (
//     <div className=' bg-black p-6'>
//       <div className="mt-6">
//         <h2 className="text-2xl font-semibold text-white mb-8">You might also like</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 ">
//           {featuredProducts.map((product) => (
//             <ProductCard
//               key={product._id}
//               productId={product._id}
//               title={product.title}
//               price={product.price.toString()}
//               imageUrl={product.image}
//               imageClassName="w-full h-48 object-cover  rounded-lg bg-gray-800"
//             />
            
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Featured;



import { useBlog } from '../context/BlogContext';
import  {ProductCard}  from './ProductCard';
import Loading from './Loading';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Featured = () => {
  const { products, loading } = useBlog();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Always show 4 products at once
  const visibleCount = 4;
  const featuredProducts = products.slice(0, Math.min(products.length, 10)); // Max 10 products

  useEffect(() => {
    if (featuredProducts.length > visibleCount) {
      const interval = setInterval(() => {
        setDirection('right');
        setCurrentIndex(prev => (prev + 1) % (featuredProducts.length - visibleCount + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredProducts.length]);

  if (loading) {
    return <Loading />;
  }

  if (!products.length) {
    return <div>No featured products found</div>;
  }

  const nextSlide = () => {
    setDirection('right');
    setCurrentIndex(prev => 
      prev + 1 > featuredProducts.length - visibleCount ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setDirection('left');
    setCurrentIndex(prev => 
      prev - 1 < 0 ? featuredProducts.length - visibleCount : prev - 1
    );
  };

  return (
    <div className='bg-gray-900 p-4'>
      <div className="mt-6 relative">
        <h2 className="text-2xl font-semibold text-white mb-8">You might also like</h2>
        
        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div className="relative h-96">
            <motion.div
              animate={{ 
                x: -currentIndex * (100 / visibleCount) + '%',
                transition: { duration: 0.5 }
              }}
              className="flex absolute w-full"
            >
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="flex-shrink-0"
                  style={{ width: `${100 / visibleCount}%`, padding: '0 0.5rem' }}
                >
                  <ProductCard
                    productId={product._id}
                    title={product.title}
                    price={product.price.toString()}
                    imageUrl={product.image}
                    imageClassName="w-full h-44 object-cover rounded-lg bg-gray-800"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

       

        {/* Indicators */}
        {featuredProducts.length > visibleCount && (
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: featuredProducts.length - visibleCount + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 'right' : 'left');
                  setCurrentIndex(index);
                }}
                className={`h-2 w-2 rounded-full transition-all ${currentIndex === index ? 'bg-white w-6' : 'bg-gray-500'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Featured;