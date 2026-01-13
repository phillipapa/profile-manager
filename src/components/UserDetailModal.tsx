import React from 'react';
import { Modal, Descriptions, Avatar } from 'antd';

import { User } from '../types/user';

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

const UserDetailModal: React.FC<Props> = ({ open, onClose, user }) => {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title={<span>{user.name}&apos;s Details</span>}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Avatar src={user.avatarUrl} size={96} />
      </div>

      <Descriptions column={1} bordered>
        <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
        <Descriptions.Item label="E-mail">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Website">{user.website}</Descriptions.Item>
        <Descriptions.Item label="Company">{user.company.name}</Descriptions.Item>
        <Descriptions.Item label="Address">{`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default UserDetailModal;
