export interface IRecord {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProduct extends IRecord {
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  image: string;
  images: string[];
  price: number;
  compareAtPrice?: number | null;
  qtyInStock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
}

export interface Paginated {
  page: number;
  pages: number;
  total: number;
}

export interface IProductPage extends Paginated {
  products: IProduct[];
}

export interface ICategory {
  name: string;
  count: number;
  image: string;
}

export interface IProductFilters {
  categories: ICategory[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export interface IReview extends IRecord {
  product: string;
  user: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
}

export interface IReviewPage extends Paginated {
  reviews: IReview[];
  rating: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  viewerHasReviewed: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: string;
}

export interface IAuthUser extends IUser {
  token: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface IOrderItem {
  _id: string;
  product: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
}

export interface IOrder extends IRecord {
  user: Pick<IUser, '_id' | 'name' | 'email'>;
  products: IOrderItem[];
  shippingAddress?: IShippingAddress;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  isPaymentDone: boolean;
  paymentResult?: { id: string; status: string; updateTime?: string; email?: string };
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
}

export interface IOrderPage extends Paginated {
  orders: IOrder[];
}

export interface IAdminStats {
  revenue: number;
  ordersCount: number;
  ordersByStatus: Partial<Record<OrderStatus, number>>;
  usersCount: number;
  productsCount: number;
  lowStock: Array<Pick<IProduct, '_id' | 'name' | 'slug' | 'image' | 'qtyInStock'>>;
  recentOrders: IOrder[];
  salesByDay: Array<{ date: string; total: number; orders: number }>;
}

/** The subset of a product kept in the cart and recently viewed lists. */
export type IProductSummary = Pick<
  IProduct,
  '_id' | 'slug' | 'name' | 'image' | 'price' | 'compareAtPrice' | 'qtyInStock' | 'category' | 'rating' | 'numReviews'
>;

export interface ICartItem extends IProductSummary {
  qty: number;
}
