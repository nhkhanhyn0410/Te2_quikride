// src/pages/HomePage.jsx
import { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";

import Header from "../components/Header";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import PopularRoutes from "../components/PopularRoutes";
import Features from "../components/Features";

import useBookingStore from "../store/bookingStore";

const HomePage = () => {
  const [form] = Form.useForm();
  const { searchCriteria, setSearchCriteria } = useBookingStore();
  const [loading, setLoading] = useState(false);

  const handleSwapCities = () => {
    const fromCity = form.getFieldValue("fromCity");
    const toCity = form.getFieldValue("toCity");
    form.setFieldsValue({ fromCity: toCity, toCity: fromCity });
  };

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  const handleSearch = (values) => {
    setSearchCriteria({
      fromCity: values.fromCity,
      toCity: values.toCity,
      date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : null,
      passengers: 1,
    });
    // navigate("/trips");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero />
        <SearchForm
          form={form}
          searchCriteria={searchCriteria}
          handleSwapCities={handleSwapCities}
          disabledDate={disabledDate}
          loading={loading}
          handleSearch={handleSearch}
        />
        <PopularRoutes />
        <Features />
      </div>
    </div>
  );
};

export default HomePage;
