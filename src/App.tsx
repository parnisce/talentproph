import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployersFAQ from './pages/how/EmployersFAQ';
import JobSeekerFAQ from './pages/how/JobSeekerFAQ';
import LearnToOutsource from './pages/how/LearnToOutsource';
import PricingPage from './pages/PricingPage';
import FindJobs from './pages/seeker/FindJobs';
import { UserProvider } from './context/UserContext';
import './index.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/faq/employers" element={<EmployersFAQ />} />
          <Route path="/faq/seekers" element={<JobSeekerFAQ />} />
          <Route path="/learn" element={<LearnToOutsource />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/jobs" element={<FindJobs />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/seeker/*" element={<SeekerDashboard />} />
          <Route path="/employer/*" element={<EmployerDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
