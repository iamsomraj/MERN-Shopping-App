import { type HydratedDocument, Schema, type Types, model } from 'mongoose';
import { slugify } from '../utils/slugify.js';

export interface IProduct {
  user: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: string;
  brand: string;
  /** Primary image; always mirrors `images[0]`. */
  image: string;
  images: string[];
  price: number;
  /** Original price shown struck through when the product is on sale. */
  compareAtPrice?: number | null;
  qtyInStock: number;
  isAvailable: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    category: { type: String, required: true, default: 'General', index: true },
    brand: { type: String, default: '' },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, default: 0, min: 0 },
    compareAtPrice: { type: Number, default: null },
    qtyInStock: { type: Number, required: true, default: 1, min: 0 },
    isAvailable: { type: Boolean, required: true, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('validate', async function () {
  if (this.images.length === 0 && this.image) {
    this.images = [this.image];
  }
  if (this.images[0]) {
    this.image = this.images[0];
  }
  if (!this.slug && this.name) {
    const base = slugify(this.name) || 'product';
    const taken = await Product.exists({ slug: base, _id: { $ne: this._id } });
    this.slug = taken ? `${base}-${this._id.toString().slice(-6)}` : base;
  }
});

export const Product = model<IProduct>('Product', productSchema);
