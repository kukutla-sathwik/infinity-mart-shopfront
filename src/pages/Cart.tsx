
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { isAuthenticated } = useAuth();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const navigate = useNavigate();

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      navigate("/login?redirect=checkout");
    }
  };

  // Calculate totals
  const shippingFee = subtotal > 50 ? 0 : 5.99;
  const total = subtotal - discount + shippingFee;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
          
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/products">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row py-6 border-b border-gray-200 last:border-0">
                        <div className="flex-shrink-0 h-24 w-24 sm:h-32 sm:w-32 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 sm:ml-6 mt-4 sm:mt-0 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                <Link to={`/products/${item.id}`} className="hover:text-purple-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-xl font-semibold text-purple-700">${item.price.toFixed(2)}</p>
                            </div>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-red-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center mt-4">
                            <div className="flex border border-gray-300 rounded">
                              <button
                                type="button"
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                              <button
                                type="button"
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <span className="ml-auto text-lg font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 p-6 flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Link to="/products">
                      <Button variant="outline" className="text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-purple-300">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">
                          {shippingFee === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${shippingFee.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-xl text-purple-700">${total.toFixed(2)}</span>
                        </div>
                        {subtotal < 50 && shippingFee > 0 && (
                          <p className="text-sm text-green-600 mt-2">
                            Add ${(50 - subtotal).toFixed(2)} more to qualify for free shipping!
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex">
                        <Input
                          type="text"
                          id="promo-code"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-grow"
                        />
                        <Button
                          type="button"
                          className="ml-2 bg-purple-600 hover:bg-purple-700"
                          onClick={applyPromoCode}
                        >
                          Apply
                        </Button>
                      </div>
                      {promoError && (
                        <p className="mt-2 text-sm text-red-600">{promoError}</p>
                      )}
                      {discount > 0 && (
                        <p className="mt-2 text-sm text-green-600">Promo code applied successfully!</p>
                      )}
                      <p className="mt-2 text-xs text-gray-500">Try "WELCOME10" for 10% off your order</p>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                        size="lg"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                    
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <svg className="h-5 w-5 text-gray-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        Secure checkout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;
