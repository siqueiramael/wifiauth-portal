
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Units from './pages/Units';
import Controllers from './pages/Controllers';
import Settings from './pages/Settings';
import Policies from './pages/Policies';
import NotFound from './pages/NotFound';
import Index from './pages/Index';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      
      <Route path="/units" element={
        <ProtectedRoute>
          <Units />
        </ProtectedRoute>
      } />
      
      <Route path="/controllers" element={
        <ProtectedRoute>
          <Controllers />
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />

      <Route path="/policies" element={
        <ProtectedRoute>
          <Policies />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
