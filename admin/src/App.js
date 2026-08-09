import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Items from './pages/Items';
import Users from './pages/Users';
import Transactions from './pages/Transactions';

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          {/* Sidebar menu */}
        </Sider>
        <Layout>
          <Header>Battle War Admin</Header>
          <Content>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/items" element={<Items />} />
              <Route path="/users" element={<Users />} />
              <Route path="/transactions" element={<Transactions />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
