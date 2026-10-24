export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
}

export interface WholesaleOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  companyName: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  vatTaxId: string;
  country: "UK" | "USA";
  shippingAddress: {
    line1: string;
    city: string;
    stateOrCounty: string;
    postalCode: string;
    countryName: string;
  };
  items: OrderItem[];
  currency: "GBP" | "USD";
  subtotal: number;
  volumeDiscount: number;
  shippingFee: number;
  taxAmount: number;
  total: number;
  status: "Pending Review" | "Payment Confirmed" | "Assay Hallmarking" | "Dispatched" | "Delivered";
  trackingCarrier?: string;
  trackingNumber?: string;
  paymentMethod: "Bank Wire Transfer (BACS/ACH)" | "Credit/Debit Card" | "Net 30 Terms";
  paymentStatus: "Paid" | "Pending Payment" | "Terms Approved";
  notes?: string;
}

export const INITIAL_ORDERS: WholesaleOrder[] = [
  {
    id: "ord-901",
    orderNumber: "ARG-UK-8821",
    createdAt: "2026-10-22T09:30:00Z",
    companyName: "Kensington Fine Jewels Ltd",
    buyerName: "Victoria Sterling",
    buyerEmail: "orders@kensingtonjewels.co.uk",
    buyerPhone: "+44 20 7946 0912",
    vatTaxId: "GB 928 411 902",
    country: "UK",
    shippingAddress: {
      line1: "42 Bond Street, Suite 3B",
      city: "London",
      stateOrCounty: "Greater London",
      postalCode: "W1S 2AA",
      countryName: "United Kingdom"
    },
    items: [
      {
        productId: "slv-001",
        name: "Solid 925 Sterling Silver Liquid Herringbone Snake Chain (3.5mm)",
        sku: "AG-NECK-001",
        quantity: 20,
        unitPrice: 13.34,
        lineTotal: 266.80,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"
      },
      {
        productId: "slv-002",
        name: "Sculptural Bold Dome Statement Ring (Solid 925 Silver)",
        sku: "AG-RING-002",
        quantity: 15,
        unitPrice: 11.20,
        lineTotal: 168.00,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80"
      }
    ],
    currency: "GBP",
    subtotal: 434.80,
    volumeDiscount: 21.74,
    shippingFee: 0, // Free over £300
    taxAmount: 82.61, // 20% UK VAT
    total: 495.67,
    status: "Dispatched",
    trackingCarrier: "Royal Mail Special Delivery Guaranteed by 1pm",
    trackingNumber: "RM772910384GB",
    paymentMethod: "Bank Wire Transfer (BACS/ACH)",
    paymentStatus: "Paid",
    notes: "Assay Office batch certificates enclosed inside package."
  },
  {
    id: "ord-902",
    orderNumber: "ARG-USA-4190",
    createdAt: "2026-10-23T15:10:00Z",
    companyName: "SoHo Mineral & Silver Co.",
    buyerName: "Marcus Vance",
    buyerEmail: "buyer@sohomineral.com",
    buyerPhone: "+1 (212) 555-0188",
    vatTaxId: "EIN 13-9827101",
    country: "USA",
    shippingAddress: {
      line1: "548 Broadway, Floor 4",
      city: "New York",
      stateOrCounty: "NY",
      postalCode: "10012",
      countryName: "United States"
    },
    items: [
      {
        productId: "slv-005",
        name: "Heavy Heavyweight Ribbed Torque Cuff Bangle (26g Solid 925)",
        sku: "AG-BRAC-005",
        quantity: 10,
        unitPrice: 42.70,
        lineTotal: 427.00,
        image: "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=300&q=80"
      },
      {
        productId: "slv-007",
        name: "Shimmering Tennis Bracelet (3mm AAA Zirconia, Solid 925)",
        sku: "AG-BRAC-007",
        quantity: 15,
        unitPrice: 21.55,
        lineTotal: 323.25,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"
      }
    ],
    currency: "USD",
    subtotal: 750.25,
    volumeDiscount: 75.03,
    shippingFee: 0,
    taxAmount: 0, // US Tax-free wholesale export
    total: 675.22,
    status: "Assay Hallmarking",
    trackingCarrier: "FedEx International Priority DDP",
    trackingNumber: "FX-8840291772",
    paymentMethod: "Credit/Debit Card",
    paymentStatus: "Paid",
    notes: "Shipped DDP with US Customs clearance prepaid."
  }
];
