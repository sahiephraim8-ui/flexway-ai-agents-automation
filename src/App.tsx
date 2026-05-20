import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import IntakeForm from './components/IntakeForm';
import WorkflowForm from './components/WorkflowForm';
import WhatsAppForm from './components/WhatsAppForm';
import SuccessPage from './components/SuccessPage';
import AdminPage from './components/AdminPage';
import OptimisationForm from './components/OptimisationForm';
import ClientTracking from './components/ClientTracking';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/formulaire" element={<IntakeForm />} />
        <Route path="/workflows" element={<WorkflowForm />} />
        <Route path="/whatsapp-ia" element={<WhatsAppForm />} />
        <Route path="/merci" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/optimisation" element={<OptimisationForm />} />
        <Route path="/suivi/:token" element={<ClientTracking />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
