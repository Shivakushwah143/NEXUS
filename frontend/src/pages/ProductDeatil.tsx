// import { useParams } from 'react-router-dom';
// import { useBlog } from '../context/BlogContext';
// import Loading from '../pages/Loading';

// const ProductDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const { products, loading } = useBlog();

//   if (loading) return <Loading />;

//   const product = products.find(p => p._id === id);

//   if (!product) {
//     return <div className="text-white text-center p-8">Product not found</div>;
//   }
//   const handleAddToCart = async () => {
//   try {
//     // 1. Get the product ID (you can get this from your product data)
//     const productId = product._id; // Make sure this matches your product data structure

//     // 2. Make the API call to purchase endpoint
//     const response = await fetch(
//       `http://localhost:5000/api/v1/user/purchase/${productId}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + localStorage.getItem('token'),
//         },
//       }
//     );

//     // 3. Handle the response
//     if (!response.ok) {
//       throw new Error('Failed to purchase product');
//     }

//     const data = await response.json();

//     // 4. Optional: Update local state or show success message
//     console.log('Product purchased successfully:', data);
//     alert('Product added to your purchases!');

//     // 5. Optional: Refresh user data or redirect
//     // You might want to refresh the user context or redirect to purchases page

//   } catch (error) {
//     console.error('Purchase error:', error);
//     alert('Failed to purchase product. Please try again.');
//   }
// };

//   return (
//     <div className="bg-black min-h-screen p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Product Image */}
//           <div className="bg-gray-900 rounded-lg overflow-hidden">
//             <img
//               src={product.image}
//               alt={product.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
          
//           {/* Product Info */}
//           <div className="text-white">
//             <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
//             <p className="text-2xl text-yellow-400 font-semibold mb-4">${product.price}</p>
//             <p className="text-gray-300 mb-6">{product.description}</p>
            
//             {/* Color Selection */}
//             {product.colour && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">Color</h3>
//                 <div className="flex items-center">
//                   <span 
//                     className="w-8 h-8 rounded-full mr-2 border border-gray-600"
//                     style={{ backgroundColor: product.colour.toLowerCase() }}
//                   ></span>
//                   <span>{product.colour}</span>
//                 </div>
//               </div>
//             )}
            
//             {/* Size Selection */}
//             {product.size && product.size.length > 0 && (
//               <div className="mb-6">
//                 <h3 className="text-lg font-medium mb-2">Size</h3>
//                 <div className="flex flex-wrap gap-2">
//                   {product.size.map(size => (
//                     <button
//                       key={size}
//                       className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             <button onClick={handleAddToCart} className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition">
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
import { useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import Loading from '../pages/Loading';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const CheckoutForm = ({ product, onSuccess }: { product: any, onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    try {
      // 1. Create payment intent
      const response : any = await axios.post(
        'http://localhost:5000/api/v1/payment/create-payment-intent',
        { productId: product._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // 2. Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          }
        }
      );

      if (error) {
        alert(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // 3. Save purchase to database
        await axios.post(
          `http://localhost:5000/api/v1/user/purchase/${product._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        alert('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed');
    }
  };

  return (
<form onSubmit={handleSubmit} className="max-w-md mx-auto h-40 mt-8 space-y-6">
  {/* Card Element Container */}
  <div className="space-y-2">
    <label htmlFor="card-element" className="block text-sm font-medium text-gray-300">
      Card Details
    </label>
    <div className="relative">
      <CardElement
        id="card-element"
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#ffffff',
              '::placeholder': {
                color: '#94a3b8',
              },
              iconColor: '#f59e0b',
              backgroundColor: '#1e293b',
            },
            invalid: {
              color: '#ef4444',
              iconColor: '#ef4444',
            },
          },
          hidePostalCode: true, // Optional: Hide postal code field
        }}
        className="p-3 border-2 border-gray-700 rounded-xl bg-slate-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
      />
      <div className="absolute right-3 top-3 flex space-x-2">
        {/* Card Icons (Optional) */}
        <div className="w-8 h-5 bg-gray-600 rounded-sm"></div>
        <div className="w-8 h-5 bg-gray-600 rounded-sm"></div>
      </div>
    </div>
    <p className="text-xs text-gray-400">
      We use 256-bit encryption to keep your information secure.
    </p>
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    disabled={!stripe}
    className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg hover:shadow-yellow-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
    Pay ${product.price}
  </button>

  {/* Secure Payment Notice */}
  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
    <span>Payments secured by Stripe</span>
  </div>
</form>
  );
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useBlog();
  const [showPayment, setShowPayment] = useState(false);

  if (loading) return <Loading />;

  const product = products.find(p => p._id === id);

  if (!product) {
    return <div className="text-white text-center p-8">Product not found</div>;
  }

  return (
    <div className="bg-gray-700 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Info */}
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl text-yellow-400 font-semibold mb-4">${product.price}</p>
            <p className="text-gray-300 mb-6">{product.description}</p>
            
            {/* Color Selection */}
            {product.colour && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Color</h3>
                <div className="flex items-center">
                  <span 
                    className="w-8 h-8 rounded-full mr-2 border border-gray-600"
                    style={{ backgroundColor: product.colour.toLowerCase() }}
                  ></span>
                  <span>{product.colour}</span>
                </div>
              </div>
            )}
            
            {/* Size Selection */}
            {product.size && product.size.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.size.map(size => (
                    <button
                      key={size}
                      className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-800"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {showPayment ? (
              <CheckoutForm 
                product={product} 
                onSuccess={() => setShowPayment(false)}
              />
            ) : (
              <button 
                onClick={() => setShowPayment(true)}
                className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-yellow-400 transition"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;