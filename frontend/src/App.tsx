import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <div>Header</div>
      <Outlet />
      <div>Footer</div>
    </>
  );
};

export default App;
