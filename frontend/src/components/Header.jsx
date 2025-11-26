import { Button, Dropdown, Space, Typography } from "antd";
import { DownOutlined, UserOutlined, LogoutOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
  };

  const userMenuItems = [
    {
      key: "my-tickets",
      label: "Vé của tôi",
      icon: <UserOutlined />,
      onClick: () => navigate("/my-tickets"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Title
          level={3}
          className="!mb-0 text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          🚌 Vé xe nhanh
        </Title>

        <Space size="middle">
          {isAuthenticated ? (
            <>
              <Button type="link" onClick={() => navigate("/my-tickets")}>
                Vé của tôi
              </Button>

              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Button type="text">
                  <Space>
                    <UserOutlined />
                    {user?.name || "Tài khoản"}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </>
          ) : (
            <>
              <Button type="link" onClick={() => navigate("/tickets/lookup")}>
                Tra cứu vé
              </Button>
              <Button type="link" icon={<LoginOutlined />} onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button type="primary" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </>
          )}

          <Button type="link" onClick={() => navigate("/operator/login")} className="text-gray-500">
            Nhà xe
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Header;
