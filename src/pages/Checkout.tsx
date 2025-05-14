
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Wallet } from "lucide-react";

const Checkout = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [sameAddress, setSameAddress] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || "",
    lastName: user?.name?.split(' ')[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZipCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  // Calculate totals
  const shippingFee = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shippingFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user selects
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Validate billing info
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.zipCode.trim()) errors.zipCode = "Zip code is required";
    
    // Validate shipping info if different from billing
    if (!sameAddress) {
      if (!formData.shippingAddress.trim()) errors.shippingAddress = "Shipping address is required";
      if (!formData.shippingCity.trim()) errors.shippingCity = "Shipping city is required";
      if (!formData.shippingState.trim()) errors.shippingState = "Shipping state is required";
      if (!formData.shippingZipCode.trim()) errors.shippingZipCode = "Shipping zip code is required";
    }
    
    // Validate payment info
    if (paymentMethod === "credit-card") {
      if (!formData.cardName.trim()) errors.cardName = "Name on card is required";
      if (!formData.cardNumber.trim()) errors.cardNumber = "Card number is required";
      if (!formData.cardExpiry.trim()) errors.cardExpiry = "Expiration date is required";
      if (!formData.cardCvv.trim()) errors.cardCvv = "Security code is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "There are some issues with your information.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    try {
      // In a real app, this would be an API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      
      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={formErrors.firstName ? "border-red-500" : ""}
                      />
                      {formErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={formErrors.lastName ? "border-red-500" : ""}
                      />
                      {formErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? "border-red-500" : ""}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? "border-red-500" : ""}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Billing Address */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Billing Address</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={formErrors.address ? "border-red-500" : ""}
                      />
                      {formErrors.address && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={formErrors.city ? "border-red-500" : ""}
                        />
                        {formErrors.city && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State
                        </Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => handleSelectChange("state", value)}
                        >
                          <SelectTrigger className={formErrors.state ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="NY">New York</SelectItem>
                            <SelectItem value="TX">Texas</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors.state && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          Zip Code
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={formErrors.zipCode ? "border-red-500" : ""}
                        />
                        {formErrors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-gray-900">Shipping Address</h2>
                    <div className="flex items-center">
                      <Checkbox
                        id="sameAddress"
                        checked={sameAddress}
                        onCheckedChange={(checked) => setSameAddress(checked as boolean)}
                      />
                      <label htmlFor="sameAddress" className="ml-2 text-sm text-gray-700">
                        Same as billing address
                      </label>
                    </div>
                  </div>
                  
                  {!sameAddress && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">
                          Street Address
                        </Label>
                        <Input
                          id="shippingAddress"
                          name="shippingAddress"
                          value={formData.shippingAddress}
                          onChange={handleInputChange}
                          className={formErrors.shippingAddress ? "border-red-500" : ""}
                        />
                        {formErrors.shippingAddress && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.shippingAddress}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700">
                            City
                          </Label>
                          <Input
                            id="shippingCity"
                            name="shippingCity"
                            value={formData.shippingCity}
                            onChange={handleInputChange}
                            className={formErrors.shippingCity ? "border-red-500" : ""}
                          />
                          {formErrors.shippingCity && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.shippingCity}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingState" className="block text-sm font-medium text-gray-700">
                            State
                          </Label>
                          <Select
                            value={formData.shippingState}
                            onValueChange={(value) => handleSelectChange("shippingState", value)}
                          >
                            <SelectTrigger className={formErrors.shippingState ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                              <SelectItem value="IL">Illinois</SelectItem>
                            </SelectContent>
                          </Select>
                          {formErrors.shippingState && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.shippingState}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="shippingZipCode" className="block text-sm font-medium text-gray-700">
                            Zip Code
                          </Label>
                          <Input
                            id="shippingZipCode"
                            name="shippingZipCode"
                            value={formData.shippingZipCode}
                            onChange={handleInputChange}
                            className={formErrors.shippingZipCode ? "border-red-500" : ""}
                          />
                          {formErrors.shippingZipCode && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.shippingZipCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-6">Payment Method</h2>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit-card" id="credit-card" className="border-purple-600" />
                      <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                        <CreditCard className="h-5 w-5 text-purple-600 mr-2" />
                        <span>Credit / Debit Card</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 rounded-lg border p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="paypal" id="paypal" className="border-purple-600" />
                      <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                        <Wallet className="h-5 w-5 text-purple-600 mr-2" />
                        <span>PayPal</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          className={formErrors.cardName ? "border-red-500" : ""}
                        />
                        {formErrors.cardName && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Card Number
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={formErrors.cardNumber ? "border-red-500" : ""}
                        />
                        {formErrors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                            Expiration Date
                          </Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className={formErrors.cardExpiry ? "border-red-500" : ""}
                          />
                          {formErrors.cardExpiry && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.cardExpiry}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700">
                            CVV
                          </Label>
                          <Input
                            id="cardCvv"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={formErrors.cardCvv ? "border-red-500" : ""}
                          />
                          {formErrors.cardCvv && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.cardCvv}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {paymentMethod === "paypal" && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        You will be redirected to PayPal to complete your purchase securely.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Items ({items.length})</h3>
                    
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm text-gray-700">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
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
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900">Total</span>
                        <span className="text-xl text-purple-700">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 py-3"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        "Place Order"
                      )}
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
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
