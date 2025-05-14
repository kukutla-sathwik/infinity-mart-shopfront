
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { getProducts, getProductsByCategory, searchProducts, Product } from "@/services/productService";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Products = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [error, setError] = useState("");
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let loadedProducts;
        if (category) {
          loadedProducts = await getProductsByCategory(category);
        } else {
          loadedProducts = await getProducts();
        }
        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);

  useEffect(() => {
    const filterAndSortProducts = async () => {
      setLoading(true);
      try {
        let results = [...products];
        
        // Apply search filter if query exists
        if (searchQuery.trim()) {
          results = await searchProducts(searchQuery);
        }
        
        // Apply sorting
        switch (sortBy) {
          case "price-low":
            results.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            results.sort((a, b) => b.price - a.price);
            break;
          case "name-asc":
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            results.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "rating":
            results.sort((a, b) => b.rating - a.rating);
            break;
          // For "featured", we don't sort as they come pre-sorted by featured status
          default:
            break;
        }
        
        setFilteredProducts(results);
        
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setLoading(false);
      }
    };

    filterAndSortProducts();
  }, [searchQuery, sortBy, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle the actual filtering
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category 
              ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` 
              : "All Products"}
          </h1>
          
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="ml-2 bg-purple-600 hover:bg-purple-700">
                Search
              </Button>
            </form>
            
            <div className="flex justify-end">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mt-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden product-card">
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xl font-semibold text-purple-700">${product.price.toFixed(2)}</p>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-500">({product.rating})</span>
                    </div>
                    <Button
                      className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
