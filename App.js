import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import ListScreen from './src/screens/ListScreen';
import UserDataScreen from './src/screens/UserDataScreen';

const AppContent = () => {
  const { userToken, isLoading } = useContext(AuthContext);
  const [screen, setScreen] = React.useState("products");

  if (isLoading) return null;

  if (!userToken) return <LoginScreen />;

  if (screen === "user") {
    return <UserDataScreen setScreen={setScreen} />;
  }

  if (screen === "products") {
    return <ListScreen setScreen={setScreen} />;
  }

  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}