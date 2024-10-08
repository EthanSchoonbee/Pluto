import React from 'react';
import { SafeAreaView } from 'react-native';
import Login from './src/screens/Login';

const App = () => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <Login />
      </SafeAreaView>
  );
};

export default App;