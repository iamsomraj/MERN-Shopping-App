import { slugify } from '../utils/slugify.js';

export interface SeedReview {
  productSlug: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
}

const JOHN = 'john@example.com';
const JANE = 'jane@example.com';
const SOMRAJ = 'somraj@example.com';

const review = (product: string, userEmail: string, rating: number, title: string, comment: string): SeedReview => ({
  productSlug: slugify(product),
  userEmail,
  rating,
  title,
  comment,
});

export const reviews: SeedReview[] = [
  review(
    'Fjallraven Laptop Backpack',
    JOHN,
    5,
    'My daily carry',
    'Fits my 15" laptop with room to spare and has survived a rainy winter.'
  ),
  review(
    'Fjallraven Laptop Backpack',
    JANE,
    4,
    'Great, a bit stiff at first',
    'Straps were stiff for a week, now it is the comfiest bag I own.'
  ),
  review('Fjallraven Laptop Backpack', SOMRAJ, 5, 'Worth it', 'Simple, tough and looks good. Would buy again.'),
  review("Men's Slim Fit T-Shirt", JOHN, 4, 'Nice fit', 'True to size and soft. Slight shrink after the first wash.'),
  review("Men's Cotton Jacket", JOHN, 5, 'Perfect spring jacket', 'Light enough for warm days, plenty of pockets.'),
  review("Men's Cotton Jacket", SOMRAJ, 4, 'Good value', 'Well made for the price. Sleeves run a little long.'),
  review("Men's Casual Shirt", JANE, 3, 'Okay', 'Bought for my partner — looks good, but the fabric creases easily.'),
  review(
    'Dragon Station Chain Bracelet',
    JANE,
    5,
    'Stunning',
    'Even more beautiful in person. Heavy and well finished.'
  ),
  review(
    'Gold Petite Micropave Ring',
    JANE,
    4,
    'Delicate and pretty',
    'Lovely sparkle. I sized up half a size and it fits well.'
  ),
  review('Gold Plated Princess Necklace', JANE, 4, 'Great gift', 'My sister loved it. The chain is fine but sturdy.'),
  review(
    'Gold Plated Princess Necklace',
    JOHN,
    5,
    'Anniversary win',
    'Arrived quickly in a nice box. She wears it every day.'
  ),
  review(
    'Portable External Hard Drive 2TB',
    SOMRAJ,
    5,
    'Fast and reliable',
    'Backed up my entire photo library in under an hour.'
  ),
  review(
    'Portable External Hard Drive 2TB',
    JOHN,
    4,
    'Does the job',
    'Plug and play on Mac and Windows. Cable is a bit short.'
  ),
  review(
    'Internal SSD SATA III 1TB',
    SOMRAJ,
    5,
    'Old laptop feels new',
    'Boot time went from a minute to ten seconds.'
  ),
  review('256GB SSD 3D NAND SATA III', JOHN, 4, 'Solid budget SSD', 'Good speeds for the price, easy install.'),
  review(
    'Gaming Drive for PlayStation 4',
    JOHN,
    5,
    'No more deleting games',
    'Set up in two minutes and load times are the same as internal.'
  ),
  review(
    '21.5" Full HD IPS Monitor',
    SOMRAJ,
    4,
    'Crisp picture',
    'Great colours for the size. Stand is basic but fine.'
  ),
  review(
    '49" 144Hz Curved Gaming Monitor',
    SOMRAJ,
    5,
    'Absolutely immersive',
    'Racing games on this are unreal. Needs a big desk!'
  ),
  review(
    '49" 144Hz Curved Gaming Monitor',
    JOHN,
    4,
    'Huge and gorgeous',
    'Took some time to tune the settings, but worth it.'
  ),
  review(
    "Women's 3-in-1 Snowboard Jacket",
    JANE,
    5,
    'Warm and versatile',
    'Wore the shell in autumn and both layers on the slopes.'
  ),
  review("Women's Hooded Moto Jacket", JANE, 4, 'Cute and comfy', 'Looks like real leather. The hood is a nice touch.'),
  review('Striped Climbing Raincoat', JANE, 4, 'Kept me dry', 'Survived a full day of hiking in the rain.'),
  review('Short Sleeve Boat Neck Top', JANE, 5, 'Bought three', 'So soft and flattering. Bought it in three colours.'),
  review('Moisture Wicking Athletic Shirt', JANE, 3, 'Fine for the gym', 'Does what it says, but runs small.'),
  review("Women's Cotton Graphic T-Shirt", JANE, 4, 'Fun print', 'The print held up after many washes.'),
];
