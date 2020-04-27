import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import { Container, Content } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Container>
      <Content>
        <div>Dashboard</div>

        <Link onClick={signOut} to="/">
          <FiLogOut />
          Logout
        </Link>
      </Content>
    </Container>
  );
};

export default Dashboard;
