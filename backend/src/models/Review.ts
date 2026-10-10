import { type HydratedDocument, type Model, Schema, type Types, model } from 'mongoose';
import { Product } from './Product.js';

export interface IReview {
  product: Types.ObjectId;
  user: Types.ObjectId;
  name: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewModel extends Model<IReview> {
  recalcProductRating(productId: Types.ObjectId): Promise<void>;
}

export type ReviewDocument = HydratedDocument<IReview>;

const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: '' },
    comment: { type: String, required: true },
    isVerifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product.
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

reviewSchema.static('recalcProductRating', async function (productId: Types.ObjectId) {
  const [stats] = await this.aggregate<{ rating: number; numReviews: number }>([
    { $match: { product: productId } },
    { $group: { _id: '$product', rating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);
  await Product.updateOne(
    { _id: productId },
    { rating: stats ? Math.round(stats.rating * 10) / 10 : 0, numReviews: stats?.numReviews ?? 0 }
  );
});

export const Review = model<IReview, ReviewModel>('Review', reviewSchema);
