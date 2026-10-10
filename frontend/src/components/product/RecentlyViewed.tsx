import { Section } from '@/components/home/Section';
import { useRecentStore } from '@/stores/recent';
import { Link } from 'react-router';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';

/** Horizontal strip of products viewed on this device. */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const products = useRecentStore((state) => state.products).filter((product) => product._id !== excludeId);
  if (products.length === 0) return null;
  return (
    <Section title='Recently viewed'>
      <ul className='-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2'>
        {products.map((product) => (
          <li
            key={product._id}
            className='w-36 shrink-0 snap-start sm:w-44'>
            <Link
              to={`/products/${product.slug}`}
              className='group block space-y-2'>
              <ProductImage
                src={product.image}
                alt=''
                tileClassName='rounded-xl border'
                className='transition-transform group-hover:scale-105'
              />
              <p className='line-clamp-1 text-sm font-medium group-hover:underline'>{product.name}</p>
              <PriceTag
                price={product.price}
                compareAtPrice={product.compareAtPrice}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
