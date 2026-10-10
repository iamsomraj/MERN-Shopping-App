import { z } from 'zod';

// Admins either pick a bundled image (served by the frontend) or paste an absolute URL.
const imageSchema = z.union([
  z.string().regex(/^\/images\/[\w./-]+$/, 'Invalid image path'),
  z.url({ protocol: /^https?$/ }),
]);

// No defaults here: Zod applies inner defaults even under .partial(), which would reset
// omitted fields on update. Defaults are added only for create.
const productFields = {
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(2000),
  category: z.string().trim().min(2).max(40),
  brand: z.string().trim().max(60),
  price: z.coerce.number().nonnegative(),
  compareAtPrice: z.coerce.number().positive().nullable().optional(),
  qtyInStock: z.coerce.number().int().nonnegative(),
  images: z.array(imageSchema).min(1).max(8),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
};

const compareAtAbovePrice = (product: { price?: number; compareAtPrice?: number | null }) =>
  product.compareAtPrice == null || product.price == null || product.compareAtPrice > product.price;

const compareAtMessage = { message: 'Compare-at price must be higher than the price', path: ['compareAtPrice'] };

export const createProductSchema = z
  .object({
    ...productFields,
    description: productFields.description.default(''),
    brand: productFields.brand.default(''),
    isFeatured: productFields.isFeatured.default(false),
    isAvailable: productFields.isAvailable.default(true),
  })
  .refine(compareAtAbovePrice, compareAtMessage);

export const updateProductSchema = z.object(productFields).partial().refine(compareAtAbovePrice, compareAtMessage);

export const SORT_OPTIONS = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'] as const;

export const productQuerySchema = z.object({
  keyword: z.string().trim().max(100).optional(),
  category: z.string().trim().max(40).optional(),
  brand: z.string().trim().max(60).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  inStock: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  featured: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  onSale: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  sort: z.enum(SORT_OPTIONS).default('featured'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(48).default(12),
});
