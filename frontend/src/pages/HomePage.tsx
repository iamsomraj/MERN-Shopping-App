import { featuredQuery, type ProductQuery, useProductFilters, useProducts } from '@/api/products';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { Hero } from '@/components/home/Hero';
import { Section } from '@/components/home/Section';
import { ValueProps } from '@/components/home/ValueProps';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { usePageMeta } from '@/hooks/use-page-meta';

function ProductRow({ query, count = 4 }: { query: ProductQuery; count?: number }) {
  const { data } = useProducts({ ...query, limit: count });
  return data ? <ProductGrid products={data.products} /> : <ProductGridSkeleton count={count} />;
}

export default function HomePage() {
  usePageMeta(undefined, {
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'One Stop EShop',
      url: 'https://one-stop-eshop.vercel.app/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://one-stop-eshop.vercel.app/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  });
  const { data: featured } = useProducts(featuredQuery);
  const { data: filters } = useProductFilters();

  return (
    <div className='space-y-16 pb-8 md:space-y-20'>
      <Hero products={featured?.products.slice(0, 3)} />
      <ValueProps />
      <Section
        title='Shop by category'
        description='Find exactly what you are looking for.'
        href='/shop'
        linkLabel='All products'>
        <CategoryGrid categories={filters?.categories} />
      </Section>
      <Section
        title='Featured picks'
        description='Our favourites this season.'
        href='/shop?featured=true'>
        {featured ? <ProductGrid products={featured.products.slice(0, 4)} /> : <ProductGridSkeleton count={4} />}
      </Section>
      <Section
        title='Deals you’ll love'
        description='Limited-time prices on popular items.'
        href='/shop?onSale=true'>
        <ProductRow query={{ onSale: true }} />
      </Section>
      <Section
        title='Top rated'
        description='Loved by our customers.'
        href='/shop?sort=rating'>
        <ProductRow query={{ sort: 'rating' }} />
      </Section>
      <RecentlyViewed />
    </div>
  );
}
