import AlurProsedur from '../components/AlurProsedur';
import HeroSection from '../components/Hero';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import FormSection from '../components/FormSection';
import Footer from '../components/Footer';


function Homepage() {
  return (
	<>
	<Navbar />
	<HeroSection />
	<Services />
	<AlurProsedur />
	<FormSection />
	<Footer />
	</>
  )
}

export default Homepage