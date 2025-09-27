import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage'; // Renamed import
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import HistoryPage from './pages/HistoryPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes like login are direct children */}
          {/*<Route path="/register" element={<RegisterPage />} />*/}
          {/*<Route path="/login" element={<LoginPage />} />*/}

          {/* Protected routes are nested inside the ProtectedRoute component */}
          {/*<Route path="/" element={<ProtectedRoute />}>*/}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="history" element={<HistoryPage />} />
            {/*</Route>*/}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;