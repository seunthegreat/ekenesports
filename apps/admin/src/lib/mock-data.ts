import { Category, Sport, Product, Order, Customer } from "./types";

// ... (existing code: sports, categories, mockProducts)

export const mockOrders: Order[] = [
  {
    id: "o1",
    orderNumber: "ES-1001",
    waybill: "DHL-9928172",
    items: [
      { productId: "p1", variantId: "v1", quantity: 1, name: "Elite Performance Football Jersey", variant: "Black / S", price: 85.00, image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800" }
    ],
    shippingAddress: { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+123456789", street: "123 Victory St", city: "London", state: "Greater London", postalCode: "EC1A 1BB", country: "United Kingdom" },
    shippingRate: { id: "sr1", name: "DHL Express", description: "Standard delivery", price: 15.00, currency: "EUR", estimatedDays: { min: 2, max: 4 } },
    payment: { method: "stripe" },
    subtotal: 85.00,
    shippingCost: 15.00,
    total: 100.00,
    status: "delivered",
    timeline: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: "o2",
    orderNumber: "ES-1002",
    waybill: "",
    items: [
      { productId: "p2", variantId: "v4", quantity: 1, name: "Pro Court Basketball Shoes", variant: "Red / 42", price: 120.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800" }
    ],
    shippingAddress: { firstName: "Sarah", lastName: "Smith", email: "sarah@example.com", phone: "+4477889900", street: "45 Regent St", city: "Manchester", state: "Greater Manchester", postalCode: "M1 1AE", country: "United Kingdom" },
    shippingRate: { id: "sr1", name: "DHL Express", description: "Standard delivery", price: 15.00, currency: "EUR", estimatedDays: { min: 2, max: 4 } },
    payment: { method: "stripe" },
    subtotal: 120.00,
    shippingCost: 15.00,
    total: 135.00,
    status: "processing",
    timeline: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
  }
];



export const sports: Sport[] = [
  { id: "1", name: "Football", slug: "football", icon: "soccer-ball", image: "/images/sports/football.jpg" },
  { id: "2", name: "Basketball", slug: "basketball", icon: "basketball", image: "/images/sports/basketball.jpg" },
  { id: "3", name: "Running", slug: "running", icon: "activity", image: "/images/sports/running.jpg" },
];

export const categories: Category[] = [
  { id: "1", name: "Jerseys", slug: "jerseys", parentId: null, sportId: "1", image: "/images/categories/jerseys.jpg" },
  { id: "2", name: "Shoes", slug: "shoes", parentId: null, sportId: "1", image: "/images/categories/shoes.jpg" },
  { id: "3", name: "Shorts", slug: "shorts", parentId: null, sportId: "2", image: "/images/categories/shorts.jpg" },
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Elite Performance Football Jersey",
    slug: "elite-performance-football-jersey",
    description: "Designed for champions. Breathable fabric and ergonomic fit.",
    basePrice: 85.00,
    compareAtPrice: 95.00,
    brand: "Ekene Sport",
    gender: "men",
    tags: ["featured", "new"],
    sportId: "1",
    categoryId: "1",
    images: [{ url: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800", alt: "Jersey Front" }],
    variants: [
      { id: "v1", size: "S", color: "Black", colorHex: "#000000", sku: "ES-FT-J-001-S", price: 85.00, compareAtPrice: null, stock: 25 },
      { id: "v2", size: "M", color: "Black", colorHex: "#000000", sku: "ES-FT-J-001-M", price: 85.00, compareAtPrice: null, stock: 15 },
      { id: "v3", size: "L", color: "Black", colorHex: "#000000", sku: "ES-FT-J-001-L", price: 85.00, compareAtPrice: null, stock: 5 },
    ],
    featured: true,
    isNew: true,
    rating: 4.8,
    reviewCount: 124,
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Pro Court Basketball Shoes",
    slug: "pro-court-basketball-shoes",
    description: "Ultimate grip and cushion for the perfect jump.",
    basePrice: 120.00,
    compareAtPrice: null,
    brand: "Ekene Sport",
    gender: "unisex",
    tags: ["bestseller"],
    sportId: "2",
    categoryId: "2",
    images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800", alt: "Basketball Shoes" }],
    variants: [
      { id: "v4", size: "42", color: "Red", colorHex: "#FF0000", sku: "ES-BK-S-002-42", price: 120.00, compareAtPrice: null, stock: 10 },
      { id: "v5", size: "43", color: "Red", colorHex: "#FF0000", sku: "ES-BK-S-002-43", price: 120.00, compareAtPrice: null, stock: 8 },
    ],
    featured: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 98,
    createdAt: new Date().toISOString(),
  }
];

export const mockCustomers: Customer[] = [
  {
    id: "c1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+123456789",
    totalOrders: 5,
    totalSpend: 425.00,
    lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    status: "active",
    addresses: [
      { firstName: "John", lastName: "Doe", email: "john@example.com", phone: "+123456789", street: "123 Victory St", city: "London", state: "Greater London", postalCode: "EC1A 1BB", country: "United Kingdom" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()
  },
  {
    id: "c2",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah@example.com",
    phone: "+4477889900",
    totalOrders: 12,
    totalSpend: 1540.50,
    lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: "active",
    addresses: [
      { firstName: "Sarah", lastName: "Smith", email: "sarah@example.com", phone: "+4477889900", street: "45 Regent St", city: "Manchester", state: "Greater Manchester", postalCode: "M1 1AE", country: "United Kingdom" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString()
  },
  {
    id: "c3",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    phone: "+1555123456",
    totalOrders: 1,
    totalSpend: 85.00,
    lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    status: "inactive",
    addresses: [
      { firstName: "Michael", lastName: "Brown", email: "michael@example.com", phone: "+1555123456", street: "789 Sunset Blvd", city: "Los Angeles", state: "California", postalCode: "90001", country: "USA" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString()
  }
];
