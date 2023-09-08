import CartDrawer from '@/components/Cart/CartDrawer';
import Header from '@/components/Navigation/Header';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      {/* BEGIN - NAVBAR */}
      <Header />
      {/* END - NAVBAR */}

      {/* BEGIN - MAIN CONTENT */}
      <main className='py-24 flex-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 transition-all duration-300'>
        <section className='container py-6'>
          {/* SCREEN CONTENT */}
          <Outlet />
          {/* SCREEN CONTENT */}
        </section>
      </main>
      {/* END - MAIN CONTENT */}

      {/* TOAST PROVIDER */}
      <Toaster position='top-center' />
      {/* TOAST PROVIDER */}

      {/* BEGIN - CART DRAWER */}
      <CartDrawer />
      {/* BEGIN - CART DRAWER */}
    </>
  );
};

export default App;
