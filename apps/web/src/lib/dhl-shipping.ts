import { Order, OrderTimelineEvent, ShippingRate } from "./types";

export interface Country {
  code: string;
  name: string;
  region: "domestic" | "eu" | "international";
}

export const COUNTRIES: Country[] = [
  // Domestic
  { code: "DE", name: "Germany", region: "domestic" },
  // EU
  { code: "AT", name: "Austria", region: "eu" },
  { code: "BE", name: "Belgium", region: "eu" },
  { code: "BG", name: "Bulgaria", region: "eu" },
  { code: "HR", name: "Croatia", region: "eu" },
  { code: "CZ", name: "Czech Republic", region: "eu" },
  { code: "DK", name: "Denmark", region: "eu" },
  { code: "EE", name: "Estonia", region: "eu" },
  { code: "FI", name: "Finland", region: "eu" },
  { code: "FR", name: "France", region: "eu" },
  { code: "GR", name: "Greece", region: "eu" },
  { code: "HU", name: "Hungary", region: "eu" },
  { code: "IE", name: "Ireland", region: "eu" },
  { code: "IT", name: "Italy", region: "eu" },
  { code: "LV", name: "Latvia", region: "eu" },
  { code: "LT", name: "Lithuania", region: "eu" },
  { code: "LU", name: "Luxembourg", region: "eu" },
  { code: "NL", name: "Netherlands", region: "eu" },
  { code: "PL", name: "Poland", region: "eu" },
  { code: "PT", name: "Portugal", region: "eu" },
  { code: "RO", name: "Romania", region: "eu" },
  { code: "SK", name: "Slovakia", region: "eu" },
  { code: "SI", name: "Slovenia", region: "eu" },
  { code: "ES", name: "Spain", region: "eu" },
  { code: "SE", name: "Sweden", region: "eu" },
  // International
  { code: "US", name: "United States", region: "international" },
  { code: "CA", name: "Canada", region: "international" },
  { code: "GB", name: "United Kingdom", region: "international" },
  { code: "CH", name: "Switzerland", region: "international" },
  { code: "NO", name: "Norway", region: "international" },
  { code: "AU", name: "Australia", region: "international" },
  { code: "JP", name: "Japan", region: "international" },
  { code: "KR", name: "South Korea", region: "international" },
  { code: "CN", name: "China", region: "international" },
  { code: "IN", name: "India", region: "international" },
  { code: "BR", name: "Brazil", region: "international" },
  { code: "MX", name: "Mexico", region: "international" },
  { code: "ZA", name: "South Africa", region: "international" },
  { code: "NG", name: "Nigeria", region: "international" },
  { code: "GH", name: "Ghana", region: "international" },
  { code: "KE", name: "Kenya", region: "international" },
  { code: "AE", name: "United Arab Emirates", region: "international" },
  { code: "SA", name: "Saudi Arabia", region: "international" },
  { code: "TR", name: "Turkey", region: "international" },
  { code: "EG", name: "Egypt", region: "international" },
  { code: "SG", name: "Singapore", region: "international" },
  { code: "MY", name: "Malaysia", region: "international" },
  { code: "TH", name: "Thailand", region: "international" },
  { code: "PH", name: "Philippines", region: "international" },
  { code: "NZ", name: "New Zealand", region: "international" },
  { code: "AR", name: "Argentina", region: "international" },
  { code: "CL", name: "Chile", region: "international" },
  { code: "CO", name: "Colombia", region: "international" },
];

function getRegion(countryCode: string): "domestic" | "eu" | "international" {
  return COUNTRIES.find((c) => c.code === countryCode)?.region ?? "international";
}

export function getShippingRates(countryCode: string, subtotal: number): ShippingRate[] {
  const region = getRegion(countryCode);

  if (region === "domestic") {
    const rates: ShippingRate[] = [
      {
        id: "dhl-paket",
        name: "DHL Paket",
        description: "Standard domestic shipping",
        price: subtotal >= 50 ? 0 : 4.99,
        currency: "EUR",
        estimatedDays: { min: 1, max: 3 },
      },
      {
        id: "dhl-express",
        name: "DHL Express",
        description: "Next business day delivery",
        price: 9.99,
        currency: "EUR",
        estimatedDays: { min: 1, max: 1 },
      },
    ];
    return rates;
  }

  if (region === "eu") {
    return [
      {
        id: "dhl-europaket",
        name: "DHL Europaket",
        description: "Standard EU shipping",
        price: subtotal >= 100 ? 0 : 7.99,
        currency: "EUR",
        estimatedDays: { min: 3, max: 5 },
      },
      {
        id: "dhl-express-eu",
        name: "DHL Express",
        description: "Express EU delivery",
        price: 14.99,
        currency: "EUR",
        estimatedDays: { min: 1, max: 2 },
      },
    ];
  }

  // International
  return [
    {
      id: "dhl-paket-intl",
      name: "DHL Paket International",
      description: "Standard international shipping",
      price: 12.99,
      currency: "EUR",
      estimatedDays: { min: 7, max: 14 },
    },
    {
      id: "dhl-express-intl",
      name: "DHL Express Worldwide",
      description: "Express international delivery",
      price: 24.99,
      currency: "EUR",
      estimatedDays: { min: 2, max: 4 },
    },
  ];
}

export function generateWaybill(): string {
  const prefix = "JJD00039000";
  const suffix = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + suffix;
}

export function generateOrderNumber(): string {
  return "EK-" + Date.now().toString(36).toUpperCase();
}

export function generateMockTimeline(order: Order): OrderTimelineEvent[] {
  const created = new Date(order.createdAt);
  const now = new Date();
  const hoursSinceOrder = (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  // Determine how far along based on a hash of the order ID
  let hash = 0;
  for (let i = 0; i < order.id.length; i++) {
    hash = (hash * 31 + order.id.charCodeAt(i)) | 0;
  }
  const progressStage = Math.abs(hash) % 6;

  const stages: { status: Order["status"]; label: string; description: string; location: string; hoursOffset: number }[] = [
    { status: "confirmed", label: "Order Confirmed", description: "Your order has been placed and confirmed.", location: "Online", hoursOffset: 0 },
    { status: "processing", label: "Processing", description: "Your order is being prepared for shipment.", location: "Warehouse, Germany", hoursOffset: 4 },
    { status: "shipped", label: "Shipped", description: "Package has been handed to DHL.", location: "DHL Hub, Leipzig", hoursOffset: 12 },
    { status: "in_transit", label: "In Transit", description: "Package is on its way to your destination.", location: "In Transit", hoursOffset: 48 },
    { status: "out_for_delivery", label: "Out for Delivery", description: "Package is out for delivery in your area.", location: order.shippingAddress.city, hoursOffset: 96 },
    { status: "delivered", label: "Delivered", description: "Package has been delivered successfully.", location: order.shippingAddress.city, hoursOffset: 100 },
  ];

  // For recent orders use time-based progress, for older orders use hash-based
  const activeStage = hoursSinceOrder < 1 ? 0 : Math.min(progressStage, stages.length - 1);

  return stages.map((stage, index) => ({
    status: stage.status,
    label: stage.label,
    description: stage.description,
    location: stage.location,
    timestamp: new Date(created.getTime() + stage.hoursOffset * 60 * 60 * 1000).toISOString(),
    completed: index <= activeStage,
  }));
}
