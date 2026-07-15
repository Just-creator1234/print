// // app/page.tsx (or app/dashboard/page.tsx)
// "use client"


// import { useState } from "react";
// import { 
//   MapPin, 
//   Clock, 
//   Star, 
//   FileText, 
//   Package, 
//   CheckCircle,
//   Plus,
//   Bell,
//   User,
//   Search,
//   Navigation
// } from "lucide-react";

// import Link from "next/link";

// // Mock Data
// const mockShops = [
//   {
//     id: 1,
//     name: "Mentor Printing",
//     lat: 5.651,
//     lng: -0.186,
//     status: "open",
//     pricePerSheet: 0.40,
//     distance: "0.3 km",
//     rating: 4.8,
//     reviews: 120,
//     waitTime: "15 min",
//     address: "Central Campus, UG"
//   },
//   {
//     id: 2,
//     name: "Mistic Printing",
//     lat: 5.648,
//     lng: -0.182,
//     status: "busy",
//     pricePerSheet: 0.60,
//     distance: "0.7 km",
//     rating: 4.5,
//     reviews: 85,
//     waitTime: "40 min",
//     address: "East Legon Campus"
//   },
//   {
//     id: 3,
//     name: "Golden Print",
//     lat: 5.645,
//     lng: -0.178,
//     status: "closed",
//     pricePerSheet: 0.60,
//     distance: "1.2 km",
//     rating: 4.2,
//     reviews: 45,
//     waitTime: "--",
//     address: "West Campus Mall"
//   },
//   {
//     id: 4,
//     name: "Emmanuel Printing",
//     lat: 5.655,
//     lng: -0.190,
//     status: "open",
//     pricePerSheet: 0.60,
//     distance: "1.5 km",
//     rating: 4.6,
//     reviews: 98,
//     waitTime: "20 min",
//     address: "North Campus"
//   }
// ];

// const mockOrders = [
//   {
//     id: "PRT-2026-003",
//     fileName: "Assignment_2.pdf",
//     pages: 30,
//     copies: 1,
//     shop: "Emmanuel Printing",
//     status: "collected",
//     date: "Jan 15, 2026",
//     total: 18.00
//   },
//   {
//     id: "PRT-2026-002",
//     fileName: "Report.docx",
//     pages: 50,
//     copies: 2,
//     shop: "Mentor Printing",
//     status: "delivered",
//     date: "Jan 14, 2026",
//     total: 42.00
//   },
//   {
//     id: "PRT-2026-001",
//     fileName: "Assignment_1.pdf",
//     pages: 20,
//     copies: 2,
//     shop: "Mentor Printing",
//     status: "out_for_delivery",
//     date: "Jan 13, 2026",
//     total: 18.00
//   }
// ];

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-700",
//   accepted: "bg-blue-100 text-blue-700",
//   printing: "bg-purple-100 text-purple-700",
//   ready: "bg-indigo-100 text-indigo-700",
//   out_for_delivery: "bg-orange-100 text-orange-700",
//   delivered: "bg-green-100 text-green-700",
//   collected: "bg-emerald-100 text-emerald-700",
//   cancelled: "bg-red-100 text-red-700"
// };

// const statusLabels = {
//   pending: "Pending",
//   accepted: "Accepted",
//   printing: "Printing",
//   ready: "Ready",
//   out_for_delivery: "Out for Delivery",
//   delivered: "Delivered",
//   collected: "Collected",
//   cancelled: "Cancelled"
// };

// export default function DashboardPage() {
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [hoveredShop, setHoveredShop] = useState(null);

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'collected': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
//       case 'delivered': return <Package className="w-4 h-4 text-green-600" />;
//       case 'out_for_delivery': return <Navigation className="w-4 h-4 text-orange-600 animate-pulse" />;
//       default: return <Clock className="w-4 h-4 text-yellow-600" />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-2">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold text-lg">P</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">PrintPulse</h1>
//                 <p className="text-xs text-gray-500">Print. Deliver. Relax.</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
//                 <Bell className="w-5 h-5 text-gray-600" />
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>
//               <div className="flex items-center gap-3">
//                 <div className="text-right hidden sm:block">
//                   <p className="text-sm font-medium text-gray-900">Kwame Mensah</p>
//                   <p className="text-xs text-gray-500">Student</p>
//                 </div>
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                   KM
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Welcome Section */}
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">
//               Welcome back, Kwame! 👋
//             </h2>
//             <p className="text-gray-500">Ready to print something today?</p>
//           </div>
//           <Link
//             href="/order/new/upload"
//             className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
//           >
//             <Plus className="w-5 h-5" />
//             New Order
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Active Orders</p>
//                 <p className="text-2xl font-bold text-gray-900">2</p>
//               </div>
//               <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                 <Package className="w-5 h-5 text-blue-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Awaiting</p>
//                 <p className="text-2xl font-bold text-gray-900">1</p>
//               </div>
//               <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
//                 <Clock className="w-5 h-5 text-yellow-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Completed</p>
//                 <p className="text-2xl font-bold text-gray-900">15</p>
//               </div>
//               <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
//                 <CheckCircle className="w-5 h-5 text-green-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500">Rating</p>
//                 <p className="text-2xl font-bold text-gray-900">4.8</p>
//               </div>
//               <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
//                 <Star className="w-5 h-5 text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Map Section */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
//           <div className="p-4 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <MapPin className="w-5 h-5 text-blue-600" />
//                 <h3 className="font-semibold text-gray-900">Near You - Printing Shops</h3>
//               </div>
//               <div className="flex items-center gap-3 text-xs">
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Open
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Busy
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <span className="w-2 h-2 rounded-full bg-red-500"></span> Closed
//                 </span>
//               </div>
//             </div>
//           </div>
          
//           {/* Interactive Map */}
//           <div className="relative h-72 bg-gradient-to-br from-blue-50 to-purple-50">
//             {/* Map Background with Grid */}
//             <div className="absolute inset-0 bg-[url('/map-grid.svg')] bg-cover opacity-10"></div>
            
//             {/* Shop Pins on Map */}
//             <div className="relative w-full h-full">
//               {mockShops.map((shop) => (
//                 <div
//                   key={shop.id}
//                   className="absolute"
//                   style={{
//                     left: `${20 + (shop.lng - (-0.190)) * 600}px`,
//                     bottom: `${20 + (shop.lat - 5.645) * 800}px`
//                   }}
//                   onMouseEnter={() => setHoveredShop(shop.id)}
//                   onMouseLeave={() => setHoveredShop(null)}
//                 >
//                   <button
//                     onClick={() => setSelectedShop(selectedShop === shop.id ? null : shop.id)}
//                     className="group relative"
//                   >
//                     {/* Pin */}
//                     <div className={`
//                       w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all
//                       ${shop.status === 'open' ? 'bg-green-500 hover:bg-green-600' : ''}
//                       ${shop.status === 'busy' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
//                       ${shop.status === 'closed' ? 'bg-red-500 hover:bg-red-600' : ''}
//                       ${hoveredShop === shop.id ? 'scale-110' : ''}
//                     `}>
//                       <MapPin className="w-4 h-4 text-white" />
//                     </div>
                    
//                     {/* Shop Name Tooltip */}
//                     {hoveredShop === shop.id && (
//                       <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg">
//                         {shop.name}
//                         <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
//                       </div>
//                     )}
//                   </button>
                  
//                   {/* Shop Info Popup */}
//                   {selectedShop === shop.id && (
//                     <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-20">
//                       <div className="flex items-start justify-between mb-2">
//                         <div>
//                           <h4 className="font-semibold text-gray-900">{shop.name}</h4>
//                           <p className="text-xs text-gray-500">{shop.address}</p>
//                         </div>
//                         <div className={`
//                           px-2 py-0.5 rounded-full text-xs font-medium
//                           ${shop.status === 'open' ? 'bg-green-100 text-green-700' : ''}
//                           ${shop.status === 'busy' ? 'bg-yellow-100 text-yellow-700' : ''}
//                           ${shop.status === 'closed' ? 'bg-red-100 text-red-700' : ''}
//                         `}>
//                           {shop.status === 'open' ? 'Open' : shop.status === 'busy' ? 'Busy' : 'Closed'}
//                         </div>
//                       </div>
                      
//                       <div className="space-y-1.5 text-sm">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-500">Distance</span>
//                           <span className="font-medium text-gray-900">{shop.distance}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-500">Price/sheet</span>
//                           <span className="font-medium text-gray-900">GHS {shop.pricePerSheet.toFixed(2)}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-500">Est. time</span>
//                           <span className="font-medium text-gray-900">{shop.waitTime}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-500">Rating</span>
//                           <span className="font-medium text-gray-900 flex items-center gap-1">
//                             <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                             {shop.rating} ({shop.reviews})
//                           </span>
//                         </div>
//                       </div>
                      
//                       <Link
//                         href="/order/new/shops"
//                         className="mt-3 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all block text-center"
//                       >
//                         Order Here
//                       </Link>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Recent Orders */}
//         <div>
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//               <FileText className="w-5 h-5 text-blue-600" />
//               Recent Orders
//             </h3>
//             <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//               View All →
//             </Link>
//           </div>
          
//           <div className="space-y-3">
//             {mockOrders.map((order) => (
//               <Link
//                 key={order.id}
//                 href={`/order/${order.id}`}
//                 className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <FileText className="w-5 h-5 text-gray-600" />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <p className="text-sm font-medium text-gray-900 truncate">
//                             {order.fileName}
//                           </p>
//                           <span className="text-xs text-gray-400">•</span>
//                           <p className="text-xs text-gray-500">{order.pages} pages</p>
//                           <span className="text-xs text-gray-400">•</span>
//                           <p className="text-xs text-gray-500">{order.shop}</p>
//                         </div>
//                         <div className="flex items-center gap-3 text-xs text-gray-500">
//                           <span>{order.id}</span>
//                           <span>•</span>
//                           <span>{order.date}</span>
//                           <span>•</span>
//                           <span>GHS {order.total.toFixed(2)}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className={`
//                       inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
//                       ${statusColors[order.status]}
//                     `}>
//                       {getStatusIcon(order.status)}
//                       {statusLabels[order.status]}
//                     </span>
//                     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                     </svg>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// app/dashboard/page.tsx
"use client";

import dynamic from "next/dynamic";
import {
  MapPin,
  Clock,
  Star,
  FileText,
  Package,
  CheckCircle,
  Plus,
  Bell,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import type { Shop } from "@/components/ShopMap";

// Leaflet touches `window` on import, so the map must never render on the server.
const ShopMap = dynamic(() => import("@/components/ShopMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
      Loading map…
    </div>
  ),
});

// ---------- Types ----------

type OrderStatus =
  | "pending"
  | "accepted"
  | "printing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "collected"
  | "cancelled";

interface Order {
  id: string;
  fileName: string;
  pages: number;
  copies: number;
  shop: string;
  status: OrderStatus;
  date: string;
  total: number;
}

// ---------- Mock Data ----------

const mockShops: Shop[] = [
  {
    id: 1,
    name: "Mentor Printing",
    lat: 5.1042,
    lng: -1.2865,
    status: "open",
    pricePerSheet: 0.4,
    distance: "0.3 km",
    rating: 4.8,
    reviews: 120,
    waitTime: "15 min",
    address: "Central Campus, UCC",
  },
  {
    id: 2,
    name: "Mistic Printing",
    lat: 5.1058,
    lng: -1.289,
    status: "busy",
    pricePerSheet: 0.6,
    distance: "0.7 km",
    rating: 4.5,
    reviews: 85,
    waitTime: "40 min",
    address: "East Campus, UCC",
  },
  {
    id: 3,
    name: "Golden Print",
    lat: 5.102,
    lng: -1.284,
    status: "closed",
    pricePerSheet: 0.6,
    distance: "1.2 km",
    rating: 4.2,
    reviews: 45,
    waitTime: "--",
    address: "West Campus Mall, UCC",
  },
  {
    id: 4,
    name: "Emmanuel Printing",
    lat: 5.107,
    lng: -1.29,
    status: "open",
    pricePerSheet: 0.6,
    distance: "1.5 km",
    rating: 4.6,
    reviews: 98,
    waitTime: "20 min",
    address: "North Campus, UCC",
  },
];

const mockOrders: Order[] = [
  {
    id: "PRT-2026-003",
    fileName: "Assignment_2.pdf",
    pages: 30,
    copies: 1,
    shop: "Emmanuel Printing",
    status: "collected",
    date: "Jan 15, 2026",
    total: 18.0,
  },
  {
    id: "PRT-2026-002",
    fileName: "Report.docx",
    pages: 50,
    copies: 2,
    shop: "Mentor Printing",
    status: "delivered",
    date: "Jan 14, 2026",
    total: 42.0,
  },
  {
    id: "PRT-2026-001",
    fileName: "Assignment_1.pdf",
    pages: 20,
    copies: 2,
    shop: "Mentor Printing",
    status: "out_for_delivery",
    date: "Jan 13, 2026",
    total: 18.0,
  },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  accepted: "bg-blue-100 text-blue-700",
  printing: "bg-blue-100 text-blue-800",
  ready: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-blue-100 text-blue-700",
  collected: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  printing: "Printing",
  ready: "Ready",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  collected: "Collected",
  cancelled: "Cancelled",
};

function getStatusIcon(status: OrderStatus) {
  switch (status) {
    case "collected":
      return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    case "delivered":
      return <Package className="w-4 h-4 text-blue-600" />;
    case "out_for_delivery":
      return <Navigation className="w-4 h-4 text-orange-600 animate-pulse" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-600" />;
  }
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PrintPulse</h1>
                <p className="text-xs text-gray-500">Print. Deliver. Relax.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Kwame Mensah</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  KM
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, Kwame! 👋</h2>
            <p className="text-gray-500">Ready to print something today?</p>
          </div>
          <Link
            href="/order/new/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            New Order
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Awaiting</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Near You - Printing Shops</h3>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Open
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-300"></span> Busy
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Closed
                </span>
              </div>
            </div>
          </div>

          {/* Real interactive Leaflet map */}
          <div className="relative h-96">
            <ShopMap shops={mockShops} />
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Recent Orders
            </h3>
            <Link href="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {mockOrders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.fileName}
                          </p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{order.pages} pages</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{order.shop}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{order.id}</span>
                          <span>•</span>
                          <span>{order.date}</span>
                          <span>•</span>
                          <span>GHS {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                    >
                      {getStatusIcon(order.status)}
                      {statusLabels[order.status]}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}