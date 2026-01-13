import React from 'react';
import { Layout, Typography } from 'antd';
import { UserProvider } from './context/UserContext';
import UserList from './components/UserList';

const { Header, Content } = Layout;

function App() {
  return (
    <UserProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#f0f7ff', padding: '0 24px' }}>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              color: '#0362fc',
              marginTop: '1vh',
              textAlign: 'center',
            }}
          >
            Profile Manager
          </Typography.Title>
        </Header>
        <Content style={{ padding: '24px' }}>
          <UserList />
        </Content>
      </Layout>
    </UserProvider>
  );
}

export default App;
