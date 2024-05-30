import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import './layout.scss';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className='content'>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
