import Faq from '../../components/faq/Faq';
import Features from '../../components/features/Features';
import Hero from '../../components/hero/Hero';
import Signup from '../../components/signup/Signup';
import Footer from '../../components/footer/Footer';

const MainPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Signup />
      <Faq />
      <Footer />
    </>
  );
};

export default MainPage;
