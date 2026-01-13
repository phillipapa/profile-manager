import React, { useState } from 'react';
import { Table, Avatar, Spin, Alert, Button, Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { User } from '../types/user';
import { useUserContext } from '../context/UserContext';
import UserDetailModal from './UserDetailModal';
import UserFormModal from './UserFormModal';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const UserList: React.FC = () => {
  const {
    state: { users, loading, error },
    dispatch,
  } = useUserContext();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const openDetail = (user: User) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const openForm = (mode: 'add' | 'edit', user?: User) => {
    setFormMode(mode);
    setSelectedUser(user ?? null);
    setFormOpen(true);
  };

  const handleDelete = (id: number) => {
    dispatch({ type: 'DELETE_USER', payload: id });
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Avatar',
      dataIndex: 'avatarUrl',
      key: 'avatar',
      render: url => <Avatar src={url} />,
      width: 80,
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      responsive: ['md'],
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      responsive: ['lg'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              openDetail(record);
            }}
          />
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              openForm('edit', record);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={e => {
              e.stopPropagation();
              handleDelete(record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  if (loading) {
    return <Spin tip="Loading..." style={{ display: 'block', marginTop: 40 }} />;
  }

  if (error) {
    return <Alert title="Error" description={error} type="error" showIcon />;
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm('add')}>
          Add User
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        pagination={{ pageSize: 5 }}
        onRow={record => ({
          onClick: () => openDetail(record),
        })}
        scroll={{ x: 800 }}
      />

      {selectedUser && <UserDetailModal open={isDetailOpen} onClose={() => setDetailOpen(false)} user={selectedUser} />}

      <UserFormModal open={isFormOpen} onClose={() => setFormOpen(false)} mode={formMode} user={selectedUser} />
    </>
  );
};

export default UserList;
