import './signup.scss';

function Signup() {
  return (
    <div className='cta__section'>
      <img src='/CTA Illustration.svg' />
      <h1>Get started with building your ideas</h1>
      <form>
        <input type='text' placeholder='Enter your email...' />
        <button>sign up</button>
      </form>
    </div>
  );
}

export default Signup;
