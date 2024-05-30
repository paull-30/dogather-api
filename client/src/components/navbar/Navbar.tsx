import { Link } from 'react-router-dom';
import './navbar.scss';
import { useState } from 'react';

function Navbar() {
  const [open, setIsOpen] = useState(false);

  return (
    <div className='container'>
      <div className='container__logo'>
        <Link to='/'>
          <img className='logo' src='/Logo.svg' alt='logo' />
        </Link>

        <div
          className='container__logo__burger'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className={`burgerSpan ${open ? 'transformTop' : ''}`}></span>
          <span
            className={`burgerSpan ${open ? 'transformMiddle' : ''}`}
          ></span>
          <span
            className={`burgerSpan ${open ? 'transformBottom' : ''}`}
          ></span>
        </div>
      </div>

      <div className={`container__links ${open ? 'showLinks' : ''}`}>
        <div className='container__links-group'>
          <Link to='/aboutUs'>about us</Link>
          <span>
            <img src='/arrow.svg' />
          </span>
        </div>

        <div className='container__links-group'>
          <Link to='/features'>features</Link>
          <span>
            <img src='/arrow.svg' />
          </span>
        </div>

        <div className='container__links-group'>
          <Link to='contact'>contact</Link>
          <span>
            <img src='/arrow.svg' />
          </span>
        </div>
      </div>
      <div className={`container__register ${open ? 'showLinks' : ''}`}>
        <Link className='container__register-signIn' to='/login'>
          login
        </Link>
        <span>
          <img src='/arrow.svg' />
        </span>
        <Link className='container__register-signUp' to='/register'>
          register
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
