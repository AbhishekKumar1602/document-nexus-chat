import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="h-full">
      <ChatInterface />
    </div>
  );
};

export default Dashboard;