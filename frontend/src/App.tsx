

// App.tsx - Complete Portfolio-Ready E-commerce Platform
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    ShoppingBag, User, Search, Menu, X,
    Star, ShoppingCart, LogOut, Package,
    Plus, Edit, Trash2,
    Eye, EyeOff, ChevronRight,
    Check,  Truck,
    Globe, 
    Users, Award, Calendar, Phone, MapPin,
     Github, Linkedin, Instagram,
     Twitter, Mail,
    Lock, 
     DollarSign, ShieldCheck, Headphones, 
 
    Minimize
} from 'lucide-react';

// ==================== API CONFIG ====================
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Response error:', error);

        if (error.response?.status === 401 || error.response?.status === 403) {
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
            } catch (err) {
                console.error('Logout error:', err);
            }
        }

        return Promise.reject(error);
    }
);

// ==================== TYPES ====================
interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    colour: string;
    size: string[];
    createdAt?: string;
    updatedAt?: string;
    category?: string;
    stock?: number;
    rating?: number;
}

interface UserData {
    _id: string;
    username: string;
    email: string;
    avtar?: string;
    purchaseProduct?: Product[];
    role?: string;
    createdAt?: string;
}

interface CartItem {
    product: Product;
    quantity: number;
}

interface Order {
    id: string;
    products: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    paymentMethod: string;
}

// types/api.ts
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
}

export interface ProductsResponse {
    products: Product[];
    total: number;
}

export interface PurchaseResponse {
    purchasedProducts: Product[];
    success: boolean;
}

export interface UserResponse extends UserData {
    token?: string;
}

// ==================== MAIN APP ====================
const PortfolioECommerce: React.FC = () => {
    // ==================== REFS ====================
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Admin form refs
    const adminUsernameRef = useRef<HTMLInputElement>(null);
    const adminPasswordRef = useRef<HTMLInputElement>(null);

    // Product form refs
    const productTitleRef = useRef<HTMLInputElement>(null);
    const productDescRef = useRef<HTMLTextAreaElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const productImageRef = useRef<HTMLInputElement>(null);
    const productColorRef = useRef<HTMLInputElement>(null);
    const productSizeRef = useRef<HTMLInputElement>(null);
    const productCategoryRef = useRef<HTMLSelectElement>(null);
    const productStockRef = useRef<HTMLInputElement>(null);

    // ==================== STATE ====================
    const [products, setProducts] = useState<Product[]>([]);
    const [user, setUser] = useState<UserData | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'about' | 'contact' | 'dashboard' | 'product' | 'admin'>('home');
    const [authMode, setAuthMode] = useState<'login' | 'register' | 'otp'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [categories] = useState(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty']);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        totalSales: 0,
        totalOrders: 0,
    });
    const [checkoutData, setCheckoutData] = useState({
        name: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'credit_card',
    });

    // ==================== EFFECTS ====================
    useEffect(() => {
        try {
            fetchProducts();
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');

            if (savedUser && savedToken) {
                const userData = JSON.parse(savedUser);
                setUser(userData);
                fetchPurchasedProducts();
                fetchUserProfile();
            }

            // Check admin
            const adminToken = localStorage.getItem('adminToken');
            if (adminToken) {
                setIsAdmin(true);
            }
        } catch (error) {
            console.error('Initialization error:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
        }
    }, []);

    useEffect(() => {
        if (user && isAdmin) {
            fetchAdminStats();
        }
    }, [user, isAdmin]);


    

    // ==================== API FUNCTIONS ====================
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/product');

              const data = response.data as any;
                  if (data && data.products) {
            setProducts(data.products);
            setStats(prev => ({ ...prev, totalProducts: data.products.length }));
        }

            // if (response.data && response.data.products ) {
            //     setProducts(response.data.products);
            //     setStats(prev => ({ ...prev, totalProducts: response.data.products.length }));
            // }
        } catch (error: any) {
            console.error('Error fetching products:', error);
            setError(error.response?.data?.message || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            if (!localStorage.getItem('token')) return;

            const response = await api.get('/user/me');
            const userData = response.data as any ;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error: any) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const fetchPurchasedProducts = async () => {
    try {
        const response = await api.get('/user/purchasedproducts');

        // Quick fix with any
        const data = response.data as any;

        if (data && data.success && data.purchasedProducts) {
            setUser(prev => prev ? {
                ...prev,
                purchaseProduct: data.purchasedProducts
            } : null);

            // Convert purchased products to orders
            if (data.purchasedProducts.length > 0) {
                const newOrders: Order[] = data.purchasedProducts.map((product: Product, index: number) => ({
                    id: `ORD-${Date.now()}-${index}`,
                    products: [{ product, quantity: 1 }],
                    total: product.price,
                    status: 'delivered',
                    date: new Date().toISOString(),
                    paymentMethod: 'stripe'
                }));
                setOrders(newOrders);
                setStats(prev => ({ ...prev, totalOrders: newOrders.length }));
            }
        }
    } catch (error: any) {
        console.error('Error fetching purchased products:', error);
    }
};

    // const fetchPurchasedProducts = async () => {
    //     try {
    //         const response = await api.get('/user/purchasedproducts');

    //         if (response.data && response.data.success && response.data.purchasedProducts) {
    //             setUser(prev => prev ? {
    //                 ...prev,
    //                 purchaseProduct: response.data.purchasedProducts
    //             } : null);

    //             // Convert purchased products to orders
    //             if (response.data.purchasedProducts.length > 0) {
    //                 const newOrders: Order[] = response.data.purchasedProducts.map((product: Product, index: number) => ({
    //                     id: `ORD-${Date.now()}-${index}`,
    //                     products: [{ product, quantity: 1 }],
    //                     total: product.price,
    //                     status: 'delivered',
    //                     date: new Date().toISOString(),
    //                     paymentMethod: 'stripe'
    //                 }));
    //                 setOrders(newOrders);
    //                 setStats(prev => ({ ...prev, totalOrders: newOrders.length }));
    //             }
    //         }
    //     } catch (error: any) {
    //         console.error('Error fetching purchased products:', error);
    //     }
    // };

    const fetchAdminStats = async () => {
        try {
            // Mock stats - in real app, get from admin endpoint
            setStats({
                totalProducts: products.length,
                totalUsers: 125, // Mock
                totalSales: 45289, // Mock
                totalOrders: orders.length,
            });
        } catch (error) {
            console.error('Error fetching admin stats:', error);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const username = usernameRef.current?.value?.trim() || '';
            const email = emailRef.current?.value?.trim() || '';
            const password = passwordRef.current?.value || '';

            if (!username || !email || !password) {
                throw new Error('All fields are required');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (authMode === 'otp') {
                const otp = otpRef.current?.value?.trim() || '';

                if (!otp || otp.length !== 6) {
                    throw new Error('Please enter a valid 6-digit OTP');
                }

                const response = await api.post('/auth/verify-signup', {
                    username,
                    email,
                    password,
                    otp
                });

                if (response.data &&( response.data as any ).success) {
                    localStorage.setItem('token', (response.data as any).token);
                    await fetchUserProfile();
                    setIsAuthModalOpen(false);
                    resetFormRefs();
                    setSuccess('Account created successfully!');
                }
            } else {
                // First send OTP
                const otpResponse = await api.post('/auth/send-otp', { email });

                if (otpResponse.data && (otpResponse.data as any).success) {
                    setAuthMode('otp');
                    setSuccess('OTP sent to your email! Please check and enter the code.');
                }
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || error.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const username = usernameRef.current?.value?.trim() || '';
            const password = passwordRef.current?.value || '';

            if (!username || !password) {
                throw new Error('Username and password are required');
            }

            const response = await api.post('/user/signin', {
                username,
                password
            });

            if (response.data && (response.data as any ).success  ) {
                localStorage.setItem('token', (response.data as any).token);
                await fetchUserProfile();
                setIsAuthModalOpen(false);
                resetFormRefs();
                setSuccess('Login successful!');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const username = adminUsernameRef.current?.value?.trim() || '';
            const password = adminPasswordRef.current?.value || '';

            if (!username || !password) {
                throw new Error('Admin credentials are required');
            }

            const response = await api.post('/admin/signin', {
                username,
                password
            });

            if (response.data && (response.data as any).success) {
                localStorage.setItem('adminToken', (response.data as any).token);
                setIsAdmin(true);
                setIsAuthModalOpen(false);
                setSuccess('Admin login successful!');
                setActiveTab('admin');
            }
        } catch (error: any) {
            console.error('Admin login error:', error);
            setError(error.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) {
            setError('Please login first');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const username = usernameRef.current?.value?.trim() || user.username;
            const avatar = avatarRef.current?.value?.trim() || user.avtar;

            const response = await api.put(`/user/update/${user._id}`, {
                username,
                avtar: avatar
            });

            if (response.data && (response.data as any).user) {
                setUser((response.data as any).user);
                localStorage.setItem('user', JSON.stringify((response.data as any).user));
                setSuccess('Profile updated successfully!');
            }
        } catch (error: any) {
            console.error('Update profile error:', error);
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePurchase = async (productId: string) => {
        if (!user) {
            setIsAuthModalOpen(true);
            setError('Please login to make a purchase');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Create payment intent first
            const paymentResponse = await api.post('/payment/create-payment-intent', {
                productId
            });

            if (paymentResponse.data && (paymentResponse.data as any).clientSecret ) {
                // Process purchase
                const purchaseResponse = await api.post(`/user/purchase/${productId}`);

                if (purchaseResponse.data && (purchaseResponse.data as any).success) {
                    // Remove from cart
                    setCart(prev => prev.filter(item => item.product._id !== productId));

                    // Refresh purchased products
                    await fetchPurchasedProducts();

                    // Update stats
                    setStats(prev => ({
                        ...prev,
                        totalSales: prev.totalSales + (products.find(p => p._id === productId)?.price || 0),
                        totalOrders: prev.totalOrders + 1
                    }));

                    setSuccess('Purchase successful! Payment processed.');
                    setIsCheckoutOpen(false);
                }
            }
        } catch (error: any) {
            console.error('Purchase error:', error);
            setError(error.response?.data?.message || 'Purchase failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const title = productTitleRef.current?.value?.trim() || '';
            const description = productDescRef.current?.value?.trim() || '';
            const price = productPriceRef.current?.value || '0';
            const image = productImageRef.current?.value?.trim() || '';
            const colour = productColorRef.current?.value?.trim() || '';
            const size = productSizeRef.current?.value?.trim() || '';
            const category = productCategoryRef.current?.value || 'Electronics';
            const stock = productStockRef.current?.value || '0';

            if (!title || !description || !price || !image || !colour || !size) {
                throw new Error('All fields are required');
            }

            const productData = {
                title,
                description,
                price: parseFloat(price),
                image,
                colour,
                size: size.split(',').map(s => s.trim()),
                category,
                stock: parseInt(stock)
            };

            let response;

            if (editingProduct) {
                response = await api.put(`/product/${editingProduct._id}`, productData);
            } else {
                response = await api.post('/product', productData);
            }

            if (response.data) {
                await fetchProducts();
                setIsProductFormOpen(false);
                setEditingProduct(null);
                resetProductFormRefs();
                setSuccess(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
            }
        } catch (error: any) {
            console.error('Product error:', error);
            setError(error.response?.data?.message || 'Failed to save product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api.delete(`/product/${productId}`);
            await fetchProducts();
            setSuccess('Product deleted successfully!');
        } catch (error: any) {
            console.error('Delete error:', error);
            setError(error.response?.data?.message || 'Failed to delete product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        if (!user) {
            setIsAuthModalOpen(true);
            setError('Please login to checkout');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            // Process each product in cart
            for (const item of cart) {
                await handlePurchase(item.product._id);
            }

            setCart([]);
        } catch (error: any) {
            console.error('Checkout error:', error);
            setError('Checkout failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('adminToken');
            setUser(null);
            setIsAdmin(false);
            setCart([]);
            setSuccess('Logged out successfully!');
            setActiveTab('home');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // ==================== HELPER FUNCTIONS ====================
    const resetFormRefs = () => {
        if (usernameRef.current) usernameRef.current.value = '';
        if (emailRef.current) emailRef.current.value = '';
        if (passwordRef.current) passwordRef.current.value = '';
        if (otpRef.current) otpRef.current.value = '';
        setError('');
        setSuccess('');
    };

    const resetProductFormRefs = () => {
        if (productTitleRef.current) productTitleRef.current.value = '';
        if (productDescRef.current) productDescRef.current.value = '';
        if (productPriceRef.current) productPriceRef.current.value = '';
        if (productImageRef.current) productImageRef.current.value = '';
        if (productColorRef.current) productColorRef.current.value = '';
        if (productSizeRef.current) productSizeRef.current.value = '';
        if (productCategoryRef.current) productCategoryRef.current.value = 'Electronics';
        if (productStockRef.current) productStockRef.current.value = '';
    };

    const addToCart = (product: Product) => {
        const existingItem = cart.find(item => item.product._id === product._id);

        if (existingItem) {
            setCart(cart.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity }]);
        }

        setQuantity(1);
        setSuccess(`${product.title} added to cart!`);
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product._id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.product._id === productId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const openEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);

        // Set form values
        setTimeout(() => {
            if (productTitleRef.current) productTitleRef.current.value = product.title;
            if (productDescRef.current) productDescRef.current.value = product.description;
            if (productPriceRef.current) productPriceRef.current.value = product.price.toString();
            if (productImageRef.current) productImageRef.current.value = product.image;
            if (productColorRef.current) productColorRef.current.value = product.colour;
            if (productSizeRef.current) productSizeRef.current.value = product.size?.join(', ') || '';
            if (productCategoryRef.current) productCategoryRef.current.value = product.category || 'Electronics';
            if (productStockRef.current) productStockRef.current.value = product.stock?.toString() || '0';
        }, 100);
    };

    // ==================== COMPONENTS ====================
    const AuthModal = () => (
        <AnimatePresence>
            {isAuthModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
                    onClick={() => setIsAuthModalOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsAuthModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                                {authMode === 'login' ? 'Welcome Back' : authMode === 'otp' ? 'Verify Account' : 'Create Account'}
                            </h2>
                            <p className="text-gray-400">Enter your credentials to continue</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                            {authMode !== 'login' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Username
                                        </label>
                                        <input
                                            ref={usernameRef}
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">
                                            Email
                                        </label>
                                        <input
                                            ref={emailRef}
                                            type="email"
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            {authMode === 'login' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Username
                                    </label>
                                    <input
                                        ref={usernameRef}
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            )}

                            {authMode !== 'otp' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            ref={passwordRef}
                                            type={showPassword ? "text" : "password"}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition pr-12"
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {authMode === 'otp' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Verification Code
                                    </label>
                                    <input
                                        ref={otpRef}
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-center text-2xl tracking-widest"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="text-sm text-gray-400 mt-2 text-center">
                                        Enter the 6-digit code sent to your email
                                    </p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : authMode === 'login' ? 'Sign In' : authMode === 'otp' ? 'Verify & Sign Up' : 'Send OTP'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => {
                                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                                    resetFormRefs();
                                }}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                            </button>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                            <button
                                onClick={() => {
                                    setIsAuthModalOpen(false);
                                    setIsAdminModalOpen(true);
                                }}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Admin Login
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const AdminLoginModal = () => (
        <AnimatePresence>
            {isAdminModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
                    onClick={() => setIsAdminModalOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsAdminModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                                Admin Login
                            </h2>
                            <p className="text-gray-400">Enter admin credentials</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Username
                                </label>
                                <input
                                    ref={adminUsernameRef}
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                    placeholder="Admin username"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Password
                                </label>
                                <input
                                    ref={adminPasswordRef}
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                                    placeholder="Admin password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging in...' : 'Login as Admin'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const CartSidebar = () => (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed inset-y-0 right-0 z-40 w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-gray-800 shadow-2xl"
                >
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-gray-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                    Your Cart ({cartCount})
                                </h2>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-12">
                                    <ShoppingBag size={64} className="mx-auto text-gray-700 mb-4" />
                                    <p className="text-gray-400">Your cart is empty</p>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            setActiveTab('shop');
                                        }}
                                        className="mt-4 px-6 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.product._id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl border border-gray-800">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-700">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-white">{item.product.title}</h3>
                                                <p className="text-sm text-gray-400">${item.product.price}</p>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, -1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product._id, 1)}
                                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-white">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <button
                                                            onClick={() => removeFromCart(item.product._id)}
                                                            className="text-sm text-red-400 hover:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-800 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="text-white">$9.99</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-4 border-t border-gray-700">
                                        <span className="font-semibold text-white">Total</span>
                                        <span className="font-bold text-white">${(cartTotal + 9.99).toFixed(2)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        setIsCheckoutOpen(true);
                                    }}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full py-3 border border-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const CheckoutModal = () => (
        <AnimatePresence>
            {isCheckoutOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
                    onClick={() => setIsCheckoutOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsCheckoutOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                                Checkout
                            </h2>
                            <p className="text-gray-400">Complete your purchase</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={checkoutData.name}
                                        onChange={e => setCheckoutData({ ...checkoutData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={checkoutData.address}
                                        onChange={e => setCheckoutData({ ...checkoutData, address: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="123 Main St"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={checkoutData.city}
                                        onChange={e => setCheckoutData({ ...checkoutData, city: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="New York"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        value={checkoutData.zipCode}
                                        onChange={e => setCheckoutData({ ...checkoutData, zipCode: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="10001"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Payment Method
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['credit_card', 'paypal', 'stripe', 'bank_transfer'].map((method) => (
                                        <label key={method} className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer ${checkoutData.paymentMethod === method
                                            ? 'border-purple-500 bg-purple-500/10'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value={method}
                                                checked={checkoutData.paymentMethod === method}
                                                onChange={e => setCheckoutData({ ...checkoutData, paymentMethod: e.target.value })}
                                                className="hidden"
                                            />
                                            <span className="text-sm capitalize">{method.replace('_', ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-800/30 rounded-xl p-6">
                                <h3 className="font-bold text-white mb-4">Order Summary</h3>
                                <div className="space-y-2">
                                    {cart.map((item) => (
                                        <div key={item.product._id} className="flex justify-between">
                                            <span className="text-gray-400">
                                                {item.product.title} × {item.quantity}
                                            </span>
                                            <span className="text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-gray-700">
                                        <div className="flex justify-between text-lg">
                                            <span className="font-semibold text-white">Total</span>
                                            <span className="font-bold text-white">${(cartTotal + 9.99).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading || cart.length === 0}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing Payment...' : `Pay $${(cartTotal + 9.99).toFixed(2)}`}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    const ProductFormModal = () => (
        <AnimatePresence>
            {isProductFormOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl"
                    onClick={() => setIsProductFormOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => {
                                setIsProductFormOpen(false);
                                setEditingProduct(null);
                                resetProductFormRefs();
                            }}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                                {editingProduct ? 'Edit Product' : 'Create Product'}
                            </h2>
                            <p className="text-gray-400">Add new product to the store</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm">
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Product Title
                                </label>
                                <input
                                    ref={productTitleRef}
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                    placeholder="Enter product title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    ref={productDescRef}
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white h-32"
                                    placeholder="Enter product description"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Price ($)
                                    </label>
                                    <input
                                        ref={productPriceRef}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        ref={productCategoryRef}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        required
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Stock Quantity
                                    </label>
                                    <input
                                        ref={productStockRef}
                                        type="number"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="Enter stock quantity"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Color
                                    </label>
                                    <input
                                        ref={productColorRef}
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="Enter color"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Sizes (comma separated)
                                </label>
                                <input
                                    ref={productSizeRef}
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                    placeholder="S, M, L, XL"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Image URL
                                </label>
                                <input
                                    ref={productImageRef}
                                    type="url"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                    placeholder="Enter image URL"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );



    const ProductCard = ({ product }: { product: Product }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => {
                setSelectedProduct(product);
                setActiveTab('product');
            }}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {isAdmin && (
                    <div className="absolute top-4 right-4 flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openEditProduct(product);
                            }}
                            className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product._id);
                            }}
                            className="p-2 bg-red-500/60 backdrop-blur-sm rounded-full hover:bg-red-500/80 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">{product.title}</h3>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        ${product.price}
                    </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">{product.colour}</span>
                    <span className="text-sm text-gray-400">{product.size?.join(', ')}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(product._id);
                        }}
                        className="px-4 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </motion.div>
    );




    const ProductDetailPage = () => {
        // State for product detail page
        const [detailQuantity, setDetailQuantity] = useState(1);
        const [selectedColor, setSelectedColor] = useState('');
        const [selectedSize, setSelectedSize] = useState('');

        // If no product is selected, show a fallback
        if (!selectedProduct) {
            return (
                <div className="text-center py-12">
                    <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No product selected</p>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        Back to Shop
                    </button>
                </div>
            );
        }

        // Add to cart function for product detail page
        const handleAddToCartDetail = () => {
            addToCart(selectedProduct);
            setSuccess(`${selectedProduct.title} added to cart!`);
        };

        // Buy now function for product detail page
        const handleBuyNowDetail = () => {
            if (!user) {
                setIsAuthModalOpen(true);
                return;
            }
            handlePurchase(selectedProduct._id);
        };

        return (
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                    <button onClick={() => setActiveTab('home')} className="hover:text-white">Home</button>
                    <ChevronRight size={16} />
                    <button onClick={() => setActiveTab('shop')} className="hover:text-white">Shop</button>
                    <ChevronRight size={16} />
                    <span className="text-white">{selectedProduct.title}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div>
                        <div className="rounded-2xl overflow-hidden mb-4">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-full h-[500px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{selectedProduct.title}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center">
                                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                    <span className="ml-2 text-white">4.8</span>
                                    <span className="mx-2 text-gray-400">•</span>
                                    <span className="text-gray-400">142 reviews</span>
                                </div>
                                <span className="text-green-400">In Stock</span>
                            </div>

                            <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                ${selectedProduct.price}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                            <p className="text-gray-300 leading-relaxed">{selectedProduct.description}</p>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Color</h3>
                            <div className="flex gap-3">
                                {selectedProduct.colour.split(',').map((color: string) => (
                                    <button
                                        key={color.trim()}
                                        onClick={() => setSelectedColor(color.trim())}
                                        className={`px-4 py-2 rounded-lg border ${selectedColor === color.trim()
                                            ? 'border-purple-500 bg-purple-500/10 text-white'
                                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                            }`}
                                    >
                                        {color.trim()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Size</h3>
                            <div className="flex gap-3">
                                {selectedProduct.size?.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-lg border ${selectedSize === size
                                            ? 'border-purple-500 bg-purple-500/10 text-white'
                                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-3">Quantity</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700"
                                >
                                    <Minimize size={20} />
                                </button>
                                <span className="w-16 text-center text-2xl">{detailQuantity}</span>
                                <button
                                    onClick={() => setDetailQuantity(detailQuantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleAddToCartDetail}
                                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNowDetail}
                                className="flex-1 py-4 border border-gray-700 text-white rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Additional Info */}
                        <div className="pt-6 border-t border-gray-800">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-gray-400 mb-1">Category</h4>
                                    <p className="text-white">{selectedProduct.category || 'General'}</p>
                                </div>
                                <div>
                                    <h4 className="text-gray-400 mb-1">Product ID</h4>
                                    <p className="text-white">{selectedProduct._id.slice(-8)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold mb-8">Related Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products
                            .filter(p => p._id !== selectedProduct._id)
                            .slice(0, 4)
                            .map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        // Stay on product tab but update the product
                                    }}
                                >
                                    <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-white mb-2">{product.title}</h3>
                                        <p className="text-purple-400 font-bold">${product.price}</p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    };


    const HomePage = () => (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 md:p-12 lg:p-16">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="block">Welcome to</span>
                        <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                            Nexus Commerce
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        Experience seamless shopping with our cutting-edge e-commerce platform.
                        Built with React, TypeScript, Node.js, and MongoDB for a modern shopping experience.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => setActiveTab('shop')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Start Shopping
                        </button>
                        {!user && (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="px-8 py-3 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Create Account
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section>
                <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: ShieldCheck,
                            title: "Secure Payments",
                            description: "Stripe integration with encrypted transactions"
                        },
                        {
                            icon: Truck,
                            title: "Fast Delivery",
                            description: "Worldwide shipping with real-time tracking"
                        },
                        {
                            icon: Headphones,
                            title: "24/7 Support",
                            description: "Round-the-clock customer service"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                <feature.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold">Featured Products</h2>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300"
                    >
                        View All <ChevronRight size={20} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </section>
        </div>
    );

    const ShopPage = () => (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold">All Products</h2>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <button
                            onClick={() => setIsProductFormOpen(true)}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            <Plus size={20} className="inline mr-2" />
                            Add Product
                        </button>
                    )}
                </div>
            </div>

            {isLoading && products.length === 0 ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                    <p className="text-gray-400">Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <ShoppingBag size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No products available</p>
                    {isAdmin && (
                        <button
                            onClick={() => setIsProductFormOpen(true)}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Add Your First Product
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );

    const AboutPage = () => (
        <div className="max-w-6xl mx-auto space-y-16">
            {/* Hero Section */}
            <section className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="block">About</span>
                    <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Nexus Commerce
                    </span>
                </h1>
                <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                    We're building the future of e-commerce with cutting-edge technology and
                    exceptional user experiences. Our platform is designed for both customers
                    and administrators.
                </p>
            </section>

            {/* Mission & Vision */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                        <Award size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-300 leading-relaxed">
                        To revolutionize online shopping by providing a seamless, secure, and
                        intuitive platform that connects buyers with quality products worldwide.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center mb-6">
                        <Globe size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-gray-300 leading-relaxed">
                        To become the most trusted e-commerce platform globally, known for
                        innovation, reliability, and customer satisfaction.
                    </p>
                </div>
            </section>

            {/* Technology Stack */}
            <section>
                <h2 className="text-3xl font-bold mb-8 text-center">Technology Stack</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { name: "React", icon: "⚛️", color: "from-blue-500 to-cyan-400" },
                        { name: "TypeScript", icon: "📘", color: "from-blue-600 to-blue-400" },
                        { name: "Node.js", icon: "🟢", color: "from-green-500 to-emerald-400" },
                        { name: "MongoDB", icon: "🍃", color: "from-green-600 to-green-400" },
                        { name: "Tailwind CSS", icon: "🎨", color: "from-teal-500 to-cyan-400" },
                        { name: "Stripe", icon: "💳", color: "from-purple-500 to-pink-400" },
                        { name: "Axios", icon: "📡", color: "from-indigo-500 to-purple-400" },
                        { name: "Framer Motion", icon: "✨", color: "from-pink-500 to-rose-400" },
                    ].map((tech, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 text-center">
                            <div className={`text-3xl mb-3 bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}>
                                {tech.icon}
                            </div>
                            <h3 className="font-bold text-white">{tech.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section>
                <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        "User Authentication & Authorization",
                        "Product Management (CRUD)",
                        "Shopping Cart System",
                        "Secure Payment Integration",
                        "Order Management",
                        "Admin Dashboard",
                        "Responsive Design",
                        "Real-time Updates",
                        "Error Handling",
                        "API Rate Limiting",
                        "Input Validation",
                        "Database Optimization"
                    ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-xl">
                            <Check size={20} className="text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section>
                <h2 className="text-3xl font-bold mb-8 text-center">Development Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: "Frontend Developer",
                            role: "React, TypeScript, Tailwind",
                            skills: ["UI/UX", "State Management", "Performance"]
                        },
                        {
                            name: "Backend Developer",
                            role: "Node.js, Express, MongoDB",
                            skills: ["API Design", "Database", "Security"]
                        },
                        {
                            name: "Full Stack Architect",
                            role: "System Design, DevOps",
                            skills: ["Scalability", "Deployment", "Monitoring"]
                        }
                    ].map((member, index) => (
                        <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                            <p className="text-purple-400 mb-4">{member.role}</p>
                            <div className="space-y-2">
                                {member.skills.map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span className="text-sm text-gray-300">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats */}
            <section className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { value: "100%", label: "Uptime" },
                        { value: "99.9%", label: "Satisfaction" },
                        { value: "< 1s", label: "Response Time" },
                        { value: "24/7", label: "Support" }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );

    const ContactPage = () => (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-gray-400">Get in touch with our team</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <Mail className="text-purple-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-400">Email</p>
                                    <p className="text-white">support@nexuscommerce.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Phone className="text-blue-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-400">Phone</p>
                                    <p className="text-white">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <MapPin className="text-green-400" size={24} />
                                </div>
                                <div>
                                    <p className="text-gray-400">Address</p>
                                    <p className="text-white">123 Tech Street, Silicon Valley, CA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, label: "Twitter" },
                                { icon: Github, label: "GitHub" },
                                { icon: Linkedin, label: "LinkedIn" },
                                { icon: Instagram, label: "Instagram" }
                            ].map((social, index) => (
                                <button
                                    key={index}
                                    className="flex-1 flex flex-col items-center justify-center p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800 transition-colors"
                                >
                                    <social.icon size={24} className="mb-2" />
                                    <span className="text-sm">{social.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Send Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Message
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white h-32"
                                placeholder="Your message..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );

    const DashboardPage = () => {
        if (!user) {
            return (
                <div className="text-center py-12">
                    <User size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Please login to view your dashboard</p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        Login
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user.username}!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="px-6 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            View Cart ({cartCount})
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Orders</p>
                                <p className="text-2xl font-bold text-white">{orders.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <Package className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Cart Items</p>
                                <p className="text-2xl font-bold text-white">{cartCount}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                <ShoppingCart className="text-pink-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Total Spent</p>
                                <p className="text-2xl font-bold text-white">${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <DollarSign className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Member Since</p>
                                <p className="text-2xl font-bold text-white">2024</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <Calendar className="text-green-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Update Profile */}
                        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6">Update Profile</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Username
                                    </label>
                                    <input
                                        ref={usernameRef}
                                        type="text"
                                        defaultValue={user.username}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="Enter new username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Avatar URL
                                    </label>
                                    <input
                                        ref={avatarRef}
                                        type="text"
                                        defaultValue={user.avtar || ''}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                                        placeholder="Enter avatar URL"
                                    />
                                </div>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Orders */}
                        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
                            <div className="space-y-4">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <div key={order.id} className="p-4 bg-gray-800/30 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-white">{order.id}</p>
                                                    <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-white">${order.total}</p>
                                                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                        order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-yellow-500/20 text-yellow-400'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Package size={48} className="mx-auto text-gray-600 mb-4" />
                                        <p className="text-gray-400">No orders yet</p>
                                        <button
                                            onClick={() => setActiveTab('shop')}
                                            className="mt-4 px-6 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                                        >
                                            Start Shopping
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                            <div className="text-center mb-6">
                                <img
                                    src={user.avtar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-2xl mx-auto mb-4 border-4 border-purple-500/30 object-cover"
                                />
                                <h3 className="font-bold text-lg text-white">{user.username}</h3>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                    <span className="text-gray-400">Orders</span>
                                    <span className="font-semibold text-white">{orders.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                    <span className="text-gray-400">Cart</span>
                                    <span className="font-semibold text-white">{cartCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-800/30">
                                    <span className="text-gray-400">Status</span>
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                            <h3 className="font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setActiveTab('shop')}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800 transition-colors"
                                >
                                    <ShoppingBag size={18} />
                                    <span>Continue Shopping</span>
                                </button>
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800 transition-colors"
                                >
                                    <ShoppingCart size={18} />
                                    <span>View Cart ({cartCount})</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800/30 hover:bg-gray-800 transition-colors text-red-400"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const AdminPage = () => {
        if (!isAdmin) {
            return (
                <div className="text-center py-12">
                    <Lock size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">Admin access required</p>
                    <button
                        onClick={() => setIsAdminModalOpen(true)}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        Admin Login
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-400">Manage your store and products</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsProductFormOpen(true)}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            <Plus size={20} className="inline mr-2" />
                            Add Product
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Logout Admin
                        </button>
                    </div>
                </div>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Total Products</p>
                                <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                <ShoppingBag className="text-purple-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Total Users</p>
                                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                <Users className="text-blue-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Total Sales</p>
                                <p className="text-2xl font-bold text-white">${stats.totalSales}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="text-green-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
                                <Package className="text-pink-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Management */}
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold">Product Management</h2>
                        <span className="text-sm text-gray-400">{products.length} products</span>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-8">
                            <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-400">No products yet</p>
                            <button
                                onClick={() => setIsProductFormOpen(true)}
                                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                            >
                                Add First Product
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b border-gray-800">
                                        <th className="pb-3">Product</th>
                                        <th className="pb-3">Price</th>
                                        <th className="pb-3">Category</th>
                                        <th className="pb-3">Stock</th>
                                        <th className="pb-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product._id} className="border-b border-gray-800/50">
                                            <td className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-white">{product.title}</p>
                                                        <p className="text-sm text-gray-400">{product.colour}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-white">${product.price}</p>
                                            </td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 rounded-full text-xs bg-gray-800">
                                                    {product.category || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs ${(product.stock || 0) > 10 ? 'bg-green-500/20 text-green-400' :
                                                    (product.stock || 0) > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {product.stock || 0} in stock
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditProduct(product)}
                                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ==================== MAIN RENDER ====================
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => setActiveTab('home')}
                        >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                <ShoppingBag size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                                NEXUS
                            </span>
                        </motion.div>

                        {/* Navigation Tabs */}
                        <div className="hidden md:flex items-center gap-8">
                            {['home', 'shop', 'about', 'contact', 'dashboard', 'product'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                                        />
                                    )}
                                </button>
                            ))}
                            {isAdmin && (
                                <button
                                    onClick={() => setActiveTab('admin')}
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Admin
                                    {activeTab === 'admin' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                                        />
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search products..."
                                    className="hidden md:block w-64 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            </div>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 hover:bg-gray-800 rounded-xl transition-colors"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-xl transition-colors">
                                        <img
                                            src={user.avtar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full border-2 border-purple-500"
                                        />
                                        <span className="hidden md:inline text-sm">{user.username}</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAuthModalOpen(true)}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                                >
                                    Sign In
                                </button>
                            )}

                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 hover:bg-gray-800 rounded-xl"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-800 overflow-hidden"
                        >
                            <div className="p-4 space-y-2">
                                {['home', 'shop', 'about', 'contact', 'dashboard'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab as any);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`block w-full px-4 py-3 rounded-xl text-left transition-colors ${activeTab === tab
                                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                                            : 'hover:bg-gray-800 text-gray-400'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                                {isAdmin && (
                                    <button
                                        onClick={() => {
                                            setActiveTab('admin');
                                            setIsMenuOpen(false);
                                        }}
                                        className={`block w-full px-4 py-3 rounded-xl text-left transition-colors ${activeTab === 'admin'
                                            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                                            : 'hover:bg-gray-800 text-gray-400'
                                            }`}
                                    >
                                        Admin
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="pt-24 pb-20">
                <div className="container mx-auto px-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400"
                        >
                            <div className="flex items-center justify-between">
                                <span>{error}</span>
                                <button onClick={() => setError('')} className="hover:text-red-300">
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400"
                        >
                            <div className="flex items-center justify-between">
                                <span>{success}</span>
                                <button onClick={() => setSuccess('')} className="hover:text-green-300">
                                    <X size={20} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'home' && <HomePage />}
                    {activeTab === 'shop' && <ShopPage />}
                    {activeTab === 'about' && <AboutPage />}
                    {activeTab === 'contact' && <ContactPage />}
                    {activeTab === 'dashboard' && <DashboardPage />}
                    {activeTab === 'admin' && <AdminPage />}
                    {activeTab === 'product' && <ProductDetailPage />}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 bg-black/50">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                    <ShoppingBag size={18} />
                                </div>
                                <span className="text-xl font-bold">NEXUS</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Complete e-commerce platform with modern technology stack.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">Home</button></li>
                                <li><button onClick={() => setActiveTab('shop')} className="hover:text-white transition-colors">Shop</button></li>
                                <li><button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">About</button></li>
                                <li><button onClick={() => setActiveTab('contact')} className="hover:text-white transition-colors">Contact</button></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Account</h3>
                            <ul className="space-y-2 text-gray-400">
                                {user ? (
                                    <>
                                        <li><button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                                        <li><button onClick={() => setIsCartOpen(true)} className="hover:text-white transition-colors">Cart</button></li>
                                        <li><button onClick={handleLogout} className="hover:text-white transition-colors">Logout</button></li>
                                    </>
                                ) : (
                                    <li><button onClick={() => setIsAuthModalOpen(true)} className="hover:text-white transition-colors">Login/Signup</button></li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4">Technology</h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>React + TypeScript</li>
                                <li>Node.js + Express</li>
                                <li>MongoDB + Mongoose</li>
                                <li>Stripe Payments</li>
                                <li>Tailwind CSS</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
                        <p>© 2024 Nexus Commerce Platform. Portfolio-ready full-stack application.</p>
                        <p className="mt-2">Built with best practices and proper error handling.</p>
                    </div>
                </div>
            </footer>

            {/* Modals */}
            <AuthModal />
            <AdminLoginModal />
            <CartSidebar />
            <CheckoutModal />
            <ProductFormModal />
        </div>
    );
};

export default PortfolioECommerce;