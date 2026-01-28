// import { useBlog } from '../context/BlogContext';
// import { ProductCard } from './ProductCard';
// import Loading from './Loading';
// import { useState, useEffect } from 'react';

// const FilterPage = () => {
//     const { products, loading } = useBlog();
//     const [selectedColor, setSelectedColor] = useState<string>('all');
//     const [availableColors, setAvailableColors] = useState<string[]>([]);
//     const [filteredProducts, setFilteredProducts] = useState(products);

//     // Extract available colors when products change
//     useEffect(() => {
//         if (products.length) {

//             const colors = products
//                 .map(product => product.colour)
//                 .filter((color, index, self) => self.indexOf(color) === index);

//             setAvailableColors(colors);
           
//         }
//     }, [products]);

//     // Filter products when color selection changes
//     useEffect(() => {
//         if (selectedColor === 'all') {
//             setFilteredProducts(products);
//         } else {
//             setFilteredProducts(products.filter(p => p.colour
//                 === selectedColor));
//         }
//     }, [selectedColor, products]);

//     if (loading) {
//         return <Loading />;
//     }

//     if (!products.length) {
//         return <div className="text-white text-center p-8">No products found</div>;
//     }

//     return (
//         <div className="bg-black min-h-screen p-6">
//             <div className="max-w-7xl mx-auto">
//                 {/* Filter Controls - Always visible now */}
//                 <div className="mb-8 p-4 bg-gray-900 rounded-lg">
//                     <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Filter Products</h2>

//                     <div className="flex flex-wrap gap-4">
//                         {/* All Colors Option - Always shown */}
//                         <button
//                             onClick={() => setSelectedColor('all')}
//                             className={`px-4 py-2 rounded-full ${selectedColor === 'all'
//                                 ? 'bg-red-600 text-white'
//                                 : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
//                         >
//                             All Products
//                         </button>

//                         {/* Color Options - Now with fallback if no colors */}
//                         {availableColors.length > 0 ? (
//                             availableColors.map(color => (
//                                 <button
//                                     key={color}
//                                     onClick={() => setSelectedColor(color)}
//                                     className={`px-4 py-2 rounded-full flex items-center ${selectedColor === color
//                                         ? 'bg-red-600 text-white'
//                                         : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
//                                 >
//                                     <span
//                                         className="w-4 h-4 rounded-full mr-2"
//                                         style={{ backgroundColor: color.toLowerCase() }}
//                                     ></span>
//                                     {color.charAt(0).toUpperCase() + color.slice(1)}
//                                 </button>
//                             ))
//                         ) : (
//                             <div className="text-gray-400">
//                                 No color options available
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Rest of your component remains the same */}
//                 <div className="text-white mb-4">
//                     Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
//                     {selectedColor !== 'all' && ` in ${selectedColor}`}
//                 </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {filteredProducts.map((product) => (
//                             <ProductCard
//                                 key={product._id}
//                                 productId={product._id}
//                                 title={product.title}
//                                 price={product.price.toString()}
//                                 imageUrl={product.image}
//                                 imageClassName="w-full h-48 object-cover rounded-lg bg-gray-800"
//                             />
//                         ))}
//                     </div>

//                 {/* {filteredProducts.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                         {filteredProducts.map((product) => (
//                             <ProductCard
//                                 key={product._id}
//                                 productId={product._id}
//                                 title={product.title}
//                                 price={product.price.toString()}
//                                 imageUrl={product.image}
//                                 imageClassName="w-full h-48 object-cover rounded-lg bg-gray-800"
//                             />
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-white text-center p-8 bg-gray-900 rounded-lg">
//                         No products found matching your filter criteria.
//                     </div>
//                 )} */}
//             </div>
//         </div>
//     );
// };

// export default FilterPage;



import { useBlog } from '../context/BlogContext';
import  {ProductCard}  from './ProductCard';
import Loading from './Loading';
import { useState, useEffect } from 'react';

const FilterPage = () => {
  const { products, loading } = useBlog();
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Extract available colors and sizes when products change
  useEffect(() => {
    if (products.length) {
      // Extract unique colors
      const colors = [...new Set(
        products
          .map(p => p.colour)
          .filter(color => color && typeof color === 'string')
      )];
      setAvailableColors(colors);

      // Extract unique sizes from all products
      const allSizes = products.flatMap(p => p.size || []);
      const uniqueSizes = [...new Set(allSizes)].filter(size => size);
      setAvailableSizes(uniqueSizes);

      console.log('Available colors:', colors);
      console.log('Available sizes:', uniqueSizes);
    }
  }, [products]);

  // Filter products when filters change
  useEffect(() => {
    const filtered = products.filter(p => {
      const colorMatch = selectedColor === 'all' || p.colour === selectedColor;
      const sizeMatch = selectedSize === 'all' || (p.size && p.size.includes(selectedSize));
      return colorMatch && sizeMatch;
    });
    setFilteredProducts(filtered);
  }, [selectedColor, selectedSize, products]);

  if (loading) {
    return <Loading />;
  }

  if (!products.length) {
    return <div className="text-white text-center p-8">No products found</div>;
  }

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filter Controls */}
        <div className="mb-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Filter Products</h2>
          
          <div className="space-y-6">
            {/* Color Filter */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedColor('all')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedColor === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  All Colors
                </button>
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${selectedColor === color 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></span>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSize('all')}
                  className={`px-3 py-1 rounded-full text-sm ${selectedSize === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                >
                  All Sizes
                </button>
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedSize === size 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="text-white mb-4">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          {selectedColor !== 'all' && ` in ${selectedColor}`}
          {selectedSize !== 'all' && ` (Size: ${selectedSize})`}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                title={product.title}
                price={product.price.toString()}
                imageUrl={product.image}
                imageClassName="w-full h-48 object-cover rounded-lg bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <div className="text-white text-center p-8 bg-gray-900 rounded-lg">
            No products found matching your filter criteria.
            <button 
              onClick={() => {
                setSelectedColor('all');
                setSelectedSize('all');
              }}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPage;