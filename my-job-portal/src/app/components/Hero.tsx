"use client"
import React from 'react';
import { Layout, Input } from 'antd';
import { Button, Flex } from '@chakra-ui/react';

import { Space, Typography } from 'antd';
import { IoColorPalette } from 'react-icons/io5';
const { Text, Link,Title} = Typography;

const { Header, Footer, Content } = Layout;
const { Search } = Input;

const onSearch = (value: string) => console.log(value);

const headerStyle: React.CSSProperties = {
  color: '#fff',
  height: 100,
  padding: '0 50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between', // push items to ends
  backgroundColor: '#ffffffff',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: '200%',
  //     color: '#000',
  backgroundColor: '#ffffffff',
};

const footerStyle: React.CSSProperties = {
  display: 'flex wrap',
  alignItems: 'center',
  justifyContent: 'space-between', // push items to ends
  color: '#fff',
  backgroundColor: '#03afffff',
};

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  width: 'calc(100% - 8px)',
  maxWidth: 'calc(100% - 8px)',
};

const Hero: React.FC = () => (
  <Flex gap="large">
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        {/* Left side - Logo */}
        <img
          draggable="false"
          alt="logo"
          src="/Logo/default-monochrome.svg"
          width={100}
        />

        {/* Right side - Search box */}
        <Search
          placeholder="Search jobs..."
          allowClear
          onSearch={onSearch}
          style={{ width: 250 }}
        />
      </Header>
      <Content style={contentStyle}>
        <>
          <Title>🌟 Welcome to Nexora</Title>
          <Title level={5}>Next-Gen Job Finding Application — where opportunities meet talent.
            Find your dream job, connect with top companies, and take the next big step in your career.
          </Title>
          <Button color={'red.1000'} border={'ActiveBorder'}>
            Check Out for Latest Openings here
          </Button>
        </>
      </Content>
      <Footer style={footerStyle}>
      <text>Made with ❤ by
      An Indian</text> 
      © 2025 Nexora.
      </Footer>
    </Layout>
  </Flex>
);
export default Hero;
