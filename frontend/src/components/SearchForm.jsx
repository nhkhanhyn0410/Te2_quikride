// src/components/SearchForm.jsx
import { useState } from "react";
import { Card, Form, AutoComplete, Input, DatePicker, Button, Row, Col } from "antd";
import { SearchOutlined, SwapOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const popularCities = [
  "Hà Nội",
  "TP HCM",
  "Đà Nẵng",
  "Nha Trang",
  "Huế",
  "Vũng Tàu",
  "Cần Thơ",
  "Hải Phòng",
];

const SearchForm = ({ form, searchCriteria, setSearchCriteria, navigate }) => {
  const [loading, setLoading] = useState(false);
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);

  const handleFromSearch = (value) => {
    setFromOptions(
      popularCities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .map((city) => ({ value: city }))
    );
  };

  const handleToSearch = (value) => {
    setToOptions(
      popularCities
        .filter((city) => city.toLowerCase().includes(value.toLowerCase()))
        .map((city) => ({ value: city }))
    );
  };

  const handleSwapCities = () => {
    const fromCity = form.getFieldValue("fromCity");
    const toCity = form.getFieldValue("toCity");
    form.setFieldsValue({
      fromCity: toCity,
      toCity: fromCity,
    });
  };

  const disabledDate = (current) => current && current < dayjs().startOf("day");

  const handleSearch = async (values) => {
    try {
      setLoading(true);
      const searchData = {
        fromCity: values.fromCity,
        toCity: values.toCity,
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : null,
        passengers: 1,
      };

      if (!searchData.fromCity || !searchData.toCity) {
        toast.error("Vui lòng nhập điểm đi và điểm đến");
        return;
      }

      if (!searchData.date) {
        toast.error("Vui lòng chọn ngày đi");
        return;
      }

      setSearchCriteria(searchData);
      navigate("/trips");
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl rounded-2xl max-w-4xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{
          fromCity: searchCriteria.fromCity || "",
          toCity: searchCriteria.toCity || "",
          date: searchCriteria.date ? dayjs(searchCriteria.date) : null,
        }}
      >
        <Row gutter={[16, 16]}>
          {/* Điểm đi */}
          <Col xs={24} md={11}>
            <Form.Item
              name="fromCity"
              label="Điểm đi"
              rules={[{ required: true, message: "Vui lòng nhập điểm đi" }]}
            >
              <AutoComplete
                options={fromOptions}
                onSearch={handleFromSearch}
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              >
                <Input
                  size="large"
                  placeholder="VD: Hà Nội, TP HCM..."
                  prefix={<SearchOutlined />}
                />
              </AutoComplete>
            </Form.Item>
          </Col>

          {/* Swap */}
          <Col xs={24} md={2} className="flex items-center justify-center">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={handleSwapCities}
              className="mt-6"
            />
          </Col>

          {/* Điểm đến */}
          <Col xs={24} md={11}>
            <Form.Item
              name="toCity"
              label="Điểm đến"
              rules={[{ required: true, message: "Vui lòng nhập điểm đến" }]}
            >
              <AutoComplete
                options={toOptions}
                onSearch={handleToSearch}
                filterOption={(inputValue, option) =>
                  option.value.toLowerCase().includes(inputValue.toLowerCase())
                }
              >
                <Input
                  size="large"
                  placeholder="VD: Đà Nẵng, Nha Trang..."
                  prefix={<SearchOutlined />}
                />
              </AutoComplete>
            </Form.Item>
          </Col>

          {/* Ngày đi */}
          <Col xs={24}>
            <Form.Item
              name="date"
              label="Ngày đi"
              rules={[{ required: true, message: "Vui lòng chọn ngày đi" }]}
            >
              <DatePicker
                size="large"
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="Chọn ngày đi"
                disabledDate={disabledDate}
                suffixIcon={<CalendarOutlined />}
              />
            </Form.Item>
          </Col>

          {/* Submit */}
          <Col xs={24}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              icon={<SearchOutlined />}
              className="w-full h-12 text-lg font-semibold"
            >
              Tìm chuyến xe
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default SearchForm;
