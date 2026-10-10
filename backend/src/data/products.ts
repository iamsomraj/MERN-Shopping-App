import type { IProduct } from '../models/Product.js';
import { slugify } from '../utils/slugify.js';

type SeedProduct = Pick<IProduct, 'name' | 'description' | 'category' | 'brand' | 'price' | 'qtyInStock'> &
  Partial<Pick<IProduct, 'compareAtPrice' | 'isFeatured'>> & { image: string };

const img = (name: string) => `/images/products/${name}.webp`;

const seedProducts: SeedProduct[] = [
  {
    name: 'Fjallraven Laptop Backpack',
    image: img('fjallraven-laptop-backpack'),
    category: 'Bags',
    brand: 'Fjallraven',
    price: 109.99,
    compareAtPrice: 129.99,
    qtyInStock: 50,
    isFeatured: true,
    description:
      'A durable everyday pack in water-resistant Vinylon F with a padded sleeve that fits up to a 15" laptop. Two side pockets, a roomy main compartment and comfortable shoulder straps make it an ideal commuter.',
  },
  {
    name: "Men's Slim Fit T-Shirt",
    image: img('mens-slim-fit-tee'),
    category: 'Men',
    brand: 'Northline',
    price: 24.99,
    qtyInStock: 100,
    description:
      'A soft, breathable cotton-blend tee with a modern slim cut. Raglan sleeves and a henley placket give a clean casual look that layers well under jackets.',
  },
  {
    name: "Men's Cotton Jacket",
    image: img('mens-cotton-jacket'),
    category: 'Men',
    brand: 'Northline',
    price: 59.99,
    qtyInStock: 80,
    isFeatured: true,
    description:
      'A lightweight cotton jacket for spring and autumn — great for hiking, camping or the daily commute. Multiple pockets and a relaxed fit keep it practical.',
  },
  {
    name: "Men's Casual Shirt",
    image: img('mens-casual-shirt'),
    category: 'Men',
    brand: 'Harbor & Co.',
    price: 18.99,
    qtyInStock: 4,
    description:
      'A slim-fitting casual shirt in a breathable weave. Easy to dress up or down, it pairs as well with chinos as with jeans.',
  },
  {
    name: 'Dragon Station Chain Bracelet',
    image: img('dragon-chain-bracelet'),
    category: 'Jewelry',
    brand: 'John Hardy',
    price: 695.0,
    qtyInStock: 30,
    isFeatured: true,
    description:
      'From the Legends collection — a sterling-silver chain bracelet inspired by the mythical water dragon that protects the ocean’s pearl. Wear facing inward to be bestowed with love and abundance.',
  },
  {
    name: 'Gold Petite Micropave Ring',
    image: img('micropave-ring'),
    category: 'Jewelry',
    brand: 'Lumen',
    price: 168.0,
    qtyInStock: 20,
    description:
      'A delicate band in 18k gold plate set with a row of tiny micropavé stones. Elegant on its own and made for stacking.',
  },
  {
    name: 'Gold Plated Princess Necklace',
    image: img('princess-necklace'),
    category: 'Jewelry',
    brand: 'Lumen',
    price: 9.99,
    compareAtPrice: 14.99,
    qtyInStock: 150,
    description:
      'A classic created-solitaire pendant on a fine gold-plated chain. A thoughtful gift for anniversaries, birthdays or just because.',
  },
  {
    name: 'Rose Gold Double Earrings',
    image: img('rose-gold-earrings'),
    category: 'Jewelry',
    brand: 'Pierced Owl',
    price: 10.99,
    qtyInStock: 0,
    description:
      'Double-flared tunnel plugs in rose-gold-plated stainless steel. Hypoallergenic and comfortable for everyday wear.',
  },
  {
    name: 'Portable External Hard Drive 2TB',
    image: img('portable-hard-drive'),
    category: 'Electronics',
    brand: 'WD',
    price: 64.0,
    qtyInStock: 60,
    description:
      'USB 3.0 and USB 2.0 compatible, with fast data transfers and improved PC performance. Plug-and-play setup and 2TB of space for photos, videos and backups.',
  },
  {
    name: 'Internal SSD SATA III 1TB',
    image: img('sata-ssd'),
    category: 'Electronics',
    brand: 'SanDisk',
    price: 109.0,
    qtyInStock: 40,
    description:
      'Easy upgrade for faster boot-ups, shutdowns, application loads and response. Read speeds up to 535MB/s and write speeds up to 350MB/s.',
  },
  {
    name: '256GB SSD 3D NAND SATA III',
    image: img('nand-ssd-256gb'),
    category: 'Electronics',
    brand: 'Silicon Power',
    price: 109.0,
    compareAtPrice: 129.99,
    qtyInStock: 3,
    description:
      '3D NAND flash for high transfer speeds and great endurance. SLC cache technology boosts performance, with TRIM and garbage collection support.',
  },
  {
    name: 'Gaming Drive for PlayStation 4',
    image: img('ps4-gaming-drive'),
    category: 'Electronics',
    brand: 'WD',
    price: 114.0,
    qtyInStock: 30,
    isFeatured: true,
    description:
      'Expand your PS4 gaming experience with up to 4TB of extra storage. Sleek design, quick setup and a 3-year limited warranty.',
  },
  {
    name: '21.5" Full HD IPS Monitor',
    image: img('ips-monitor'),
    category: 'Electronics',
    brand: 'Acer',
    price: 599.0,
    qtyInStock: 25,
    description:
      'A 21.5" Full HD (1920 x 1080) widescreen IPS display with Radeon FreeSync. 75Hz refresh rate, ultra-thin zero-frame design and HDMI & VGA ports.',
  },
  {
    name: '49" 144Hz Curved Gaming Monitor',
    image: img('curved-gaming-monitor'),
    category: 'Electronics',
    brand: 'Samsung',
    price: 999.99,
    compareAtPrice: 1199.99,
    qtyInStock: 15,
    isFeatured: true,
    description:
      'A 49" super ultrawide 32:9 QLED gaming monitor with a 144Hz refresh rate and 1ms response time. Dual 27" screens side by side, without the gap.',
  },
  {
    name: "Women's 3-in-1 Snowboard Jacket",
    image: img('snowboard-jacket'),
    category: 'Women',
    brand: 'Alpine Ridge',
    price: 56.99,
    qtyInStock: 75,
    description:
      'A detachable fleece liner and waterproof shell you can wear together or apart. Adjustable hood, cuffs and multiple zip pockets keep you warm on the slopes.',
  },
  {
    name: "Women's Hooded Moto Jacket",
    image: img('hooded-moto-jacket'),
    category: 'Women',
    brand: 'Harbor & Co.',
    price: 29.95,
    compareAtPrice: 39.95,
    qtyInStock: 100,
    description:
      'Faux leather with a removable hood, two front pockets and a zip closure. A versatile layer for every season.',
  },
  {
    name: 'Striped Climbing Raincoat',
    image: img('striped-raincoat'),
    category: 'Women',
    brand: 'Alpine Ridge',
    price: 39.99,
    qtyInStock: 90,
    description:
      'A lightweight, breathable raincoat with a striped lining and adjustable drawstring waist. Packs small and keeps you dry on the trail.',
  },
  {
    name: 'Short Sleeve Boat Neck Top',
    image: img('boat-neck-top'),
    category: 'Women',
    brand: 'Mira',
    price: 9.85,
    qtyInStock: 120,
    description: 'A soft, stretchy boat-neck top with a lightweight feel. Pairs easily with jeans, skirts or shorts.',
  },
  {
    name: 'Moisture Wicking Athletic Shirt',
    image: img('athletic-shirt'),
    category: 'Women',
    brand: 'Pace',
    price: 7.95,
    qtyInStock: 150,
    description:
      'Lightweight, breathable fabric that pulls sweat away from your skin. A relaxed fit for runs, workouts and everything in between.',
  },
  {
    name: "Women's Cotton Graphic T-Shirt",
    image: img('graphic-tee'),
    category: 'Women',
    brand: 'Mira',
    price: 12.99,
    qtyInStock: 110,
    description: 'A 95% cotton tee with a playful graphic print. Soft, comfortable and an easy everyday staple.',
  },
];

export const products = seedProducts.map((product) => ({
  ...product,
  slug: slugify(product.name),
  images: [product.image],
}));
