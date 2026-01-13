import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { ConfigProvider } from 'antd';

const Root = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1976d2',
      },
    }}
  >
    <App />
  </ConfigProvider>
);

describe('Root bootstrap (index.tsx)', () => {
  test('renders App inside ConfigProvider with correct theme', () => {
    render(<Root />);
    expect(screen.getByText(/Profile Manager/i)).toBeInTheDocument();
    const root = document.documentElement;
    const primaryColor = getComputedStyle(root).getPropertyValue(
      '--ant-primary-color'
    ).trim();

    expect(primaryColor).toBe('#1976d2');
  });
});
