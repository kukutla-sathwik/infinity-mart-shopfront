
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  
  // If someone tries to access this page directly without placing an order, redirect to home
  useEffect(() => {
    if (items.length > 0) {
      navigate("/cart");
    }
  }, [items, navigate]);
  
  const orderNumber = "ORD" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0");
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 sm:p-10">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                <p className="text-xl text-gray-600 mb-6">Thank you for your purchase</p>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <p className="text-gray-700 mb-2">Order Number:</p>
                  <p className="text-xl font-semibold text-purple-700">{orderNumber}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Order Confirmation</h3>
                      <p className="text-sm text-gray-600">
                        A confirmation email has been sent to your email address.
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Processing</h3>
                      <p className="text-sm text-gray-600">
                        We're processing your order and will prepare it for shipping.
                      </p>
                    </div>
                    
                    <div className="p-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">Shipping</h3>
                      <p className="text-sm text-gray-600">
                        Your order will be shipped within 1-3 business days.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link to="/">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Link to="/profile">
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                      View Order History
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
