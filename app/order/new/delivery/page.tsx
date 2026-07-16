// app/order/new/delivery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ArrowLeft,
  Store,
  Truck,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  Info,
  ChevronDown,
  Navigation,
  Building2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// ---------- Types ----------

interface DeliverySlot {
  id: string;
  label: string;
  value: string;
}

interface CampusLocation {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  pages: number;
}

interface OrderDetails {
  pages: number;
  copies: number;
  printType: string;
  binding: string;
  paperSize: string;
  pricing: Record<string, number>;
  fileName: string;
  filePages: number;
}

interface StoredData {
  file: UploadedFile | null;
  details: OrderDetails | null;
}

// ---------- Mock data ----------

const DELIVERY_SLOTS: DeliverySlot[] = [
  { id: "slot1", label: "8AM - 9AM", value: "8AM - 9AM" },
  { id: "slot2", label: "10AM - 11AM", value: "10AM - 11AM" },
  { id: "slot3", label: "12PM - 1PM", value: "12PM - 1PM" },
  { id: "slot4", label: "2PM - 3PM", value: "2PM - 3PM" },
  { id: "slot5", label: "4PM - 5PM", value: "4PM - 5PM" },
];

// Updated campus locations from the image
const CAMPUS_LOCATIONS: CampusLocation[] = [
  { id: "calc", label: "CALC", icon: Building2 },
  { id: "swlt", label: "SWLT", icon: Building2 },
  { id: "nlt", label: "NLT", icon: Building2 },
  { id: "sgs", label: "SGS", icon: Building2 },
  { id: "code", label: "Code", icon: Building2 },
  { id: "g_block", label: "G Block", icon: Building2 },
  { id: "nec", label: "NEC", icon: Building2 },
  { id: "cans", label: "CANS", icon: Building2 },
];

// Get stored data from session. Always returns the same shape (never a bare
// `null`) so callers can check individual fields without a top-level guard.
const getStoredData = (): StoredData => {
  if (typeof window === "undefined") {
    return { file: null, details: null };
  }
  const fileData = sessionStorage.getItem("uploadedFile");
  const orderDetails = sessionStorage.getItem("orderDetails");
  return {
    file: fileData ? JSON.parse(fileData) : null,
    details: orderDetails ? JSON.parse(orderDetails) : null,
  };
};

// Animation variants — typed as `Variants` so `type: "spring"` stays a literal
// instead of widening to `string`, which is what framer-motion's types require.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function DeliveryPage() {
  const router = useRouter();
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("slot3");
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Load stored data
  useEffect(() => {
    const data = getStoredData();
    if (!data.file || !data.details) {
      toast.error("Please complete the previous steps");
      router.push("/order/new/upload");
    }
    setIsLoading(false);
  }, [router]);

  // Handle continue
  const handleContinue = () => {
    if (deliveryType === "delivery") {
      if (!address && !selectedLocation) {
        toast.error("Please select or enter a delivery location");
        return;
      }
      if (!phone || phone.length < 10) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }

    // Save delivery details to session
    const deliveryData = {
      deliveryType,
      address: deliveryType === "delivery" ? address || selectedLocation : "",
      landmark: landmark || "",
      phone: phone || "",
      notes: notes || "",
      slot: DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.value || "12PM - 1PM",
    };
    sessionStorage.setItem("deliveryData", JSON.stringify(deliveryData));

    toast.success("Delivery details saved!");
    router.push("/order/new/shops");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/order/new/details" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Delivery Options</h1>
                <p className="text-sm text-gray-500">Choose how to receive your order</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-blue-600">3</span>
              <span className="text-gray-300">/</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex-1 flex items-center gap-2">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                ${step === 3 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : ""}
                ${step < 3 ? "bg-blue-400 text-white" : ""}
                ${step > 3 ? "bg-gray-200 text-gray-400" : ""}
              `}
              >
                {step < 3 ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`
                  flex-1 h-0.5 transition-all
                  ${step < 3 ? "bg-blue-400" : "bg-gray-200"}
                `}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>Upload</span>
          <span>Details</span>
          <span>Delivery</span>
          <span>Shop</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Delivery Type Selection */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you like to receive your order?
          </label>
          <div className="grid grid-cols-2 gap-4">
            {/* Pickup Option */}
            <button
              onClick={() => setDeliveryType("pickup")}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all
                ${deliveryType === "pickup" ? "border-blue-600 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${deliveryType === "pickup" ? "bg-blue-100" : "bg-gray-100"}
                `}
                >
                  <Store
                    className={`
                    w-6 h-6
                    ${deliveryType === "pickup" ? "text-blue-600" : "text-gray-400"}
                  `}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Pickup In-Store</p>
                  <p className="text-sm text-gray-500">Free</p>
                  <p className="text-xs text-gray-400 mt-1">Collect from shop when ready</p>
                </div>
                {deliveryType === "pickup" && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
              </div>
            </button>

            {/* Delivery Option */}
            <button
              onClick={() => setDeliveryType("delivery")}
              className={`
                relative p-6 rounded-2xl border-2 text-left transition-all
                ${deliveryType === "delivery" ? "border-blue-600 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                  ${deliveryType === "delivery" ? "bg-blue-100" : "bg-gray-100"}
                `}
                >
                  <Truck
                    className={`
                    w-6 h-6
                    ${deliveryType === "delivery" ? "text-blue-600" : "text-gray-400"}
                  `}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Doorstep Delivery</p>
                  <p className="text-sm text-gray-500">+ GHS 2.00</p>
                  <p className="text-xs text-gray-400 mt-1">Delivered to your location</p>
                </div>
                {deliveryType === "delivery" && <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />}
              </div>
            </button>
          </div>
        </motion.div>

        {/* Delivery Details (shown when delivery is selected) */}
        <AnimatePresence>
          {deliveryType === "delivery" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6 space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Delivery Location</span>
                </div>

                {/* Location Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a campus location
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl flex items-center justify-between hover:border-blue-400 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-gray-500" />
                        <span className={selectedLocation ? "text-gray-900" : "text-gray-400"}>
                          {selectedLocation
                            ? CAMPUS_LOCATIONS.find((l) => l.id === selectedLocation)?.label
                            : "Select a campus location"}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showLocationDropdown ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showLocationDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                        >
                          {CAMPUS_LOCATIONS.map((location) => (
                            <button
                              key={location.id}
                              onClick={() => {
                                setSelectedLocation(location.id);
                                setShowLocationDropdown(false);
                                setAddress(location.label);
                              }}
                              className={`
                                w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left
                                ${selectedLocation === location.id ? "bg-blue-50" : ""}
                              `}
                            >
                              <location.icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{location.label}</span>
                              {selectedLocation === location.id && <CheckCircle className="w-4 h-4 text-blue-600 ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Custom Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or enter a custom location
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., Legon Hall, Room 204"
                    className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Landmark <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g., Behind the cafeteria, near the fountain"
                    className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-3 bg-gray-100 border border-gray-300 rounded-xl">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">+233</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="24-XXX-XXXX"
                      className="flex-1 px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">We'll use this to contact you about your delivery</p>
                </div>

                {/* Delivery Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Notes <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for the delivery person..."
                    rows={2}
                    className="w-full px-4 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delivery Slot Selection */}
        <motion.div variants={itemVariants} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Delivery Time</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DELIVERY_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`
                  px-4 py-3 rounded-xl border-2 text-center transition-all
                  ${
                    selectedSlot === slot.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 hover:border-gray-400 bg-white text-gray-600"
                  }
                `}
              >
                <Clock
                  className={`
                  w-4 h-4 mx-auto mb-1
                  ${selectedSlot === slot.id ? "text-blue-600" : "text-gray-500"}
                `}
                />
                <span className="text-sm font-medium">{slot.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div variants={itemVariants}>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                {deliveryType === "delivery"
                  ? "Your order will be delivered to your specified campus location during your preferred time slot."
                  : "You can pick up your order from the shop when it's ready. You'll receive a notification."}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                ⏱️ Estimated delivery time: {DELIVERY_SLOTS.find((s) => s.id === selectedSlot)?.label}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mt-8 flex items-center justify-end gap-3">
          <Link href="/order/new/details" className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
            Back
          </Link>
          <motion.button
            onClick={handleContinue}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:scale-105 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue →
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}