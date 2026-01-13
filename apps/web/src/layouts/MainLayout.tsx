import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/issues',
      icon: <ProfileOutlined />,
      label: 'Issues',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sider */}
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div
          style={{
            height: 48,
            margin: 16,
            color: '#fff',
            fontWeight: 600,
          }}
        >
          Flow Issue
        </div>

        <Menu theme="dark" mode="inline" items={menuItems} onClick={({ key }) => navigate(key)} />
      </Sider>

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {collapsed ? (
            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18 }} />
          ) : (
            <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18 }} />
          )}

          <div style={{ marginLeft: 'auto' }}>
            {/* 这里以后放用户信息 */}
            Admin
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 16,
            padding: 16,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center' }}>Flow-Issue-System ©2026</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
