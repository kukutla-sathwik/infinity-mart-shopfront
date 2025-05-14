
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured: boolean;
  rating: number;
  inStock: boolean;
}

// Mock product data
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    price: 99.99,
    description: "Premium wireless headphones with noise cancellation technology for an immersive audio experience.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "electronics",
    featured: true,
    rating: 4.5,
    inStock: true
  },
  {
    id: "2",
    name: "Smart Watch",
    price: 149.99,
    description: "Track your fitness, receive notifications, and more with this sleek smart watch.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "electronics",
    featured: true,
    rating: 4.3,
    inStock: true
  },
  {
    id: "3",
    name: "Cotton T-Shirt",
    price: 24.99,
    description: "Classic comfortable cotton t-shirt available in various colors.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "clothing",
    featured: false,
    rating: 4.1,
    inStock: true
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    price: 89.99,
    description: "Stylish sunglasses with UV protection for both men and women.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessories",
    featured: true,
    rating: 4.7,
    inStock: true
  },
  {
    id: "5",
    name: "Portable Bluetooth Speaker",
    price: 59.99,
    description: "Powerful sound in a compact, waterproof design. Perfect for outdoor adventures.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "electronics",
    featured: false,
    rating: 4.2,
    inStock: true
  },
  {
    id: "6",
    name: "Leather Wallet",
    price: 39.99,
    description: "Genuine leather wallet with multiple card slots and RFID protection.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "accessories",
    featured: false,
    rating: 4.0,
    inStock: true
  },
  {
    id: "7",
    name: "Stainless Steel Water Bottle",
    price: 29.99,
    description: "Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "home",
    featured: false,
    rating: 4.4,
    inStock: true
  },
  {
    id: "8",
    name: "Scented Candle Set",
    price: 34.99,
    description: "Set of 3 premium scented candles made with natural soy wax.",
    image: "https://images.unsplash.com/photo-1603006905393-c279c399ba30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    category: "home",
    featured: true,
    rating: 4.6,
    inStock: true
  }
];

// Simulate API calls with delays for realism
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (): Promise<Product[]> => {
  await delay(500); // Simulate network delay
  return products;
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  await delay(300);
  return products.find(product => product.id === id);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  await delay(400);
  return products.filter(product => product.featured);
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  await delay(500);
  return products.filter(product => product.category === category);
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  await delay(600);
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) || 
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};
