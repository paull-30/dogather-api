import './features.scss';

function Features() {
  return (
    <>
      <div className='features__section'>
        <img src='/Features.svg' alt='app description' />
      </div>
      <div className='features__section_sm'>
        <img
          className='features__section_sm-man'
          src='/Illustration.svg'
          alt='man presenting'
        />
        <img
          className='features__section_sm-project'
          src='/feature_sm.svg'
          alt='app description'
        />
      </div>
    </>
  );
}

export default Features;
