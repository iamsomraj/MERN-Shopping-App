import Header from '@/components/Navigation/Header';
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
    </>
  );
};

export default App;
