import { Layout } from 'antd';
import CustomerHeader from './CustomerHeader';
import CustomerFooter from './CustomerFooter';

const { Content } = Layout;

const CustomerLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      <CustomerHeader />
      <Content className="bg-gray-50">
        {children}
      </Content>
      <CustomerFooter />
    </Layout>
  );
};

export default CustomerLayout;
