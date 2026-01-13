import { Layout, Typography } from 'antd';
const { Header, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh', marginTop: '2vh' }}>
      <Header style={{ background: '#fff' }}>
        <Typography.Title level={3} style={{ margin: 0, color: '#0362fc' }}>
          Profile Manager
        </Typography.Title>
      </Header>
      <Content style={{ padding: '24px' }}>
        {
          // isi komponen utama
        }
      </Content>
    </Layout>
  );
}

export default App;
