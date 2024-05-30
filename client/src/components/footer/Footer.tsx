import './footer.scss';

function Footer() {
  return (
    <div className='footer'>
      <div>
        <img src='/Logo.svg' alt='logo' />
      </div>
      <div className='column_container'>
        <div className='footer_column'>
          <h5>Product</h5>
          <a href='/'>Docs</a>
          <a href='/'>What's new</a>
        </div>
        <div className='footer_column'>
          <h5>Build</h5>
          <a href='/'>Templates</a>
          <a href='/'>API docs</a>
          <a href='/'>Guides & tutorials</a>
          <a href='/'>Become an affiliate</a>
        </div>
        <div className='footer_column'>
          <h5>Get started</h5>
          <a href='/'>Sign up</a>
          <a href='/'>Log in</a>
        </div>
        <div className='footer_column'>
          <h5>Resources</h5>
          <a href='/'>About us</a>
          <a href='/'>Email us</a>
          <a href='/'>Terms & privacy</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
