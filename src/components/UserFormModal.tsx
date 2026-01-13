import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { User } from '../types/user';
import { useUserContext } from '../context/UserContext';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  user: User | null;
};

const UserFormModal: React.FC<Props> = ({ open, onClose, mode, user }) => {
  const [form] = Form.useForm();
  const { dispatch } = useUserContext();

  useEffect(() => {
    if (mode === 'edit' && user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [mode, user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (mode === 'add') {
        const newUser: User = {
          ...values,
          id: Math.random(),
          avatarUrl: `https://picsum.photos/seed/${Math.random()}/80/80`,
          address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
          },
          company: {
            name: '',
            catchPhrase: '',
            bs: '',
          },
        };
        dispatch({ type: 'ADD_USER', payload: newUser });
        message.success('User added');
      } else if (mode === 'edit' && user) {
        const updated: User = {
          ...user,
          ...values,
        };
        dispatch({ type: 'UPDATE_USER', payload: updated });
        message.success('User updated');
      }

      onClose();
    } catch (err) {
      // handled by ant
    }
  };

  return (
    <Modal
      open={open}
      title={mode === 'add' ? 'Add New User' : 'Edit User'}
      okText={mode === 'add' ? 'Add' : 'Save'}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Enter your name' }]}>
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Enter desired username' }]}>
          <Input placeholder="johndoe" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]}>
          <Input placeholder="johndoe@example.com" />
        </Form.Item>

        <Form.Item name="phone" label="Phone">
          <Input placeholder="(021) 522-12345" />
        </Form.Item>

        <Form.Item name="website" label="Website">
          <Input placeholder="example.com" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
