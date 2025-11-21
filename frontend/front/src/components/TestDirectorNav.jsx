import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TestDirectorNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const forceDirectorDashboard = () => {
    console.log('🔄 Force navigation to director dashboard');
    console.log('👤 Current user:', user);
    navigate('/director-dashboard', { replace: true });
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999,
      background: 'red',
      color: 'white',
      padding: '10px',
      borderRadius: '5px'
    }}>
      <button onClick={forceDirectorDashboard}>
        🚀 Force Director Dashboard
      </button>
      <div>Role: {user?.role}</div>
    </div>
  );
};

export default TestDirectorNav;