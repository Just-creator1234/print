// app/shop/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { 
  Package, 
  Printer, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp, 
  Users, 
  DollarSign, 
  AlertCircle,
  ChevronDown,
  Search,
  Filter,
  Eye,
  Check,
  X,
  RefreshCw,
  Bell,
  Settings,
  LogOut,
  User,
  Store,
  Calendar,
  BarChart3,
  Phone,
  MapPin,
  FileText,
  Copy,
  Truck
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Mock shop data
const MOCK_SHOP = {
  id: "shop1",
  name: "Mentor Printing",
  address: "Central Campus, UG",
  phone: "024-XXX-XXXX",
  email: "mentor@printpulse.com",
  status: "OPEN",
  pricePerSheet: 0.40,
  deliveryFee: 2.00,
  rating: 4.8,
  totalOrders: 142,
  revenue: 2840.00
};

// Mock orders
const MOCK_ORDERS = [
  {
    id: "PRT-2026-004",
    customer: "Kwame Mensah",
    customerPhone: "024-XXX-XXXX",
    fileName: "Assignment_1.pdf",
    pages: 20,
    copies: 2,
    total: 18.00,
    deliveryType: "delivery",
    address: "UG - Legon Hall, Room 204",
    slot: "12PM - 1PM",
    status: "pending",
    time: "5 min ago"
  },
  {
    id: "PRT-2026-003",
    customer: "Abena Osei",
    customerPhone: "024-XXX-XXXX",
    fileName: "Research_Paper.pdf",
    pages: 35,
    copies: 3,
    total: 45.00,
    deliveryType: "pickup",
    address: "In-store pickup",
    slot: "2PM - 3PM",
    status: "printing",
    time: "20 min ago"
  },
  {
    id: "PRT-2026-002",
    customer: "John Doe",
    customerPhone: "024-XXX-XXXX",
    fileName: "Report.docx",
    pages: 50,
    copies: 2,
    total: 42.00,
    deliveryType: "delivery",
    address: "Commonwealth Hall, Room 101",
    slot: "10AM - 11AM",
    status: "ready",
    time: "45 min ago"
  },
  {
    id: "PRT-2026-001",
    customer: "Sarah Johnson",
    customerPhone: "024-XXX-XXXX",
    fileName: "Presentation.pptx",
    pages: 15,
    copies: 5,
    total: 32.00,
    deliveryType: "pickup",
    address: "In-store pickup",
    slot: "8AM - 9AM",
    status: "collected",
    time: "2 hours ago"
  }
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border border-amber-200",
    dotColor: "bg-amber-500",
    icon: Clock,
    action: "Accept"
  },
  printing: {
    label: "Printing",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    dotColor: "bg-blue-500",
    icon: Printer,
    action: "Mark Ready"
  },
  ready: {
    label: "Ready",
    color: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    dotColor: "bg-indigo-500",
    icon: Package,
    action: "Dispatch"
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-purple-50 text-purple-700 border border-purple-200",
    dotColor: "bg-purple-500",
    icon: Truck,
    action: "Delivered"
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dotColor: "bg-emerald-500",
    icon: CheckCircle,
    action: "Complete"
  },
  collected: {
    label: "Collected",
    color: "bg-green-50 text-green-700 border border-green-200",
    dotColor: "bg-green-500",
    icon: CheckCircle,
    action: "Completed"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-rose-50 text-rose-700 border border-rose-200",
    dotColor: "bg-rose-500",
    icon: XCircle,
    action: "Refund"
  }
};

// Animation variants — typed as `Variants` so framer-motion keeps `type: "spring"`
// as the literal union member it expects, instead of widening it to `string`.
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function ShopDashboardPage() {
  const [shopStatus, setShopStatus] = useState<"OPEN" | "BUSY" | "CLOSED">("OPEN");
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Handle status update
  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      setIsLoading(false);
      
      const order = orders.find(o => o.id === orderId);
      toast.success(`Order ${orderId} ${newStatus === 'printing' ? 'started printing' : 
        newStatus === 'ready' ? 'marked ready' : 
        newStatus === 'out_for_delivery' ? 'dispatched' : 
        'updated'}`);
      
      // If ready, show delivery code
      if (newStatus === 'ready') {
        toast.success(`Delivery code: 482931`, { duration: 5000 });
      }
    }, 800);
  };

  // Get filtered orders
  const getFilteredOrders = () => {
    let filtered = orders;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.fileName.toLowerCase().includes(query)
      );
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  // Stats
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    printing: orders.filter(o => o.status === "printing").length,
    ready: orders.filter(o => o.status === "ready").length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PrintPulse</h1>
                  <p className="text-xs text-gray-500">Shop Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toast.success("Refreshing orders...")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-200">
                MP
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Shop Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg shadow-blue-100/30 p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-inner">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{MOCK_SHOP.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {MOCK_SHOP.address}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-500" />
                    {MOCK_SHOP.phone}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-amber-500">
                    <span>⭐</span>
                    {MOCK_SHOP.rating}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Shop Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all shadow-sm
                    ${shopStatus === 'OPEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : ''}
                    ${shopStatus === 'BUSY' ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' : ''}
                    ${shopStatus === 'CLOSED' ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' : ''}
                  `}
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${
                    shopStatus === 'OPEN' ? 'bg-emerald-500' :
                    shopStatus === 'BUSY' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}></span>
                  {shopStatus}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showStatusDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
                    >
                      {[
                        { value: 'OPEN', label: '🟢 Open - Accepting Orders' },
                        { value: 'BUSY', label: '🟡 Busy - Limited Orders' },
                        { value: 'CLOSED', label: '🔴 Closed - No Orders' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setShopStatus(option.value as any);
                            setShowStatusDropdown(false);
                            toast.success(`Shop status updated to ${option.value}`);
                          }}
                          className={`
                            w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors
                            ${shopStatus === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                          `}
                        >
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/shop/analytics"
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-medium border border-blue-100"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-lg shadow-blue-100/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-lg shadow-blue-100/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-lg shadow-blue-100/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.printing}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Printer className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-100 shadow-lg shadow-blue-100/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-emerald-600">GHS {stats.revenue.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Orders Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg shadow-blue-100/20 overflow-hidden"
        >
          {/* Orders Header */}
          <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">Orders</h3>
              <p className="text-sm text-gray-500">Manage incoming orders</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm w-full sm:w-48 bg-gray-50/50"
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-gray-50/50"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="printing">Printing</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="collected">Collected</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig];
                const StatusIcon = status?.icon || Clock;
                const isPending = order.status === "pending";
                const isPrinting = order.status === "printing";
                const isReady = order.status === "ready";
                const isCollected = order.status === "collected";

                return (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    className="p-4 hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{order.id}</span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-sm text-gray-700">{order.customer}</span>
                              <span className="text-xs text-gray-300">•</span>
                              <span className="text-sm text-gray-600 truncate">{order.fileName}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-0.5">
                              <span>{order.pages} pages × {order.copies} copies</span>
                              <span className="text-gray-300">•</span>
                              <span className="font-medium text-gray-700">GHS {order.total.toFixed(2)}</span>
                              <span className="text-gray-300">•</span>
                              <span className="flex items-center gap-1">
                                {order.deliveryType === "delivery" ? (
                                  <>
                                    <Truck className="w-3 h-3 text-blue-500" />
                                    {order.address}
                                  </>
                                ) : (
                                  <>
                                    <Package className="w-3 h-3 text-blue-500" />
                                    Pickup
                                  </>
                                )}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-400">{order.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <span className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                          ${status?.color}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status?.dotColor}`}></span>
                          {status?.label}
                        </span>

                        {/* Action Buttons */}
                        {isPending && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "printing")}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                          >
                            Accept
                          </button>
                        )}

                        {isPrinting && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "ready")}
                            className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                          >
                            Ready
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "out_for_delivery")}
                            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm shadow-purple-200"
                          >
                            Dispatch
                          </button>
                        )}

                        {isCollected && (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg">
                            Completed
                          </span>
                        )}

                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    <AnimatePresence>
                      {selectedOrder === order.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Customer</p>
                              <p className="font-medium text-gray-900">{order.customer}</p>
                              <p className="text-xs text-gray-400">{order.customerPhone}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Delivery</p>
                              <p className="font-medium text-gray-900 capitalize">{order.deliveryType}</p>
                              <p className="text-xs text-gray-400">{order.address}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Time Slot</p>
                              <p className="font-medium text-gray-900">{order.slot}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Order Details</p>
                              <p className="font-medium text-gray-900">{order.pages} pages</p>
                              <p className="text-xs text-gray-400">{order.copies} copies</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Showing {filteredOrders.length} orders</span>
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}