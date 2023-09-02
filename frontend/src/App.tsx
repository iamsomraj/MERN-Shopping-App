import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Header />
      <main className='py-24'>
        <section className='container py-6'>
          <Outlet />
        </section>
      </main>
    </>
  );
};

export default App;
