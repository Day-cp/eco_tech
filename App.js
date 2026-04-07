import React, { useContext, useState } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ListScreen from './src/screens/ListScreen';
import UserDataScreen from './src/screens/UserDataScreen';
import SolicitudesScreen from './src/screens/SolicitudesScreen';
import HomeScreen from './src/screens/homeScreen';
import ChatScreen from './src/screens/ChatScreen';

const AppContent = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [screen, setScreen] = useState("home");

  if (isLoading) return null;
  if (!userToken) return <LoginScreen />;

  switch (screen) {
    case "home":
      return <HomeScreen setScreen={setScreen} />;

    case "user":
      return <UserDataScreen setScreen={setScreen} />;

    case "solicitudes":
      return <SolicitudesScreen setScreen={setScreen} />;

    case "Products":
      return <ListScreen setScreen={setScreen} />;

    case "Chat":
      return <ChatScreen setScreen={setScreen} />;

    default:
      return <HomeScreen setScreen={setScreen} />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}