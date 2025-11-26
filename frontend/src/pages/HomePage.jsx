import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import useBookingStore from '../store/bookingStore';
import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import PopularRoutes from "../components/PopularRoutes";
import Features from "../components/Features";

const HomePage = () => {
  const [form] = useForm();
  const navigate = useNavigate();
  const { searchCriteria, setSearchCriteria } = useBookingStore();

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero />
      <SearchForm
        form={form}
        searchCriteria={searchCriteria}
        setSearchCriteria={setSearchCriteria}
        navigate={navigate}
      />
      <PopularRoutes />
        <Features />
      </div>
    </div>
  );
};

export default HomePage;