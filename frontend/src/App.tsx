import Header from '@/components/Navigation/Header';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Header />
      {/* BEGIN - MAIN CONTENT */}
      <main className='py-24'>
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
    </>
  );
};

export default App;
