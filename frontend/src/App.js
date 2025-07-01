import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard'
  function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/home" element={<AdminDashboard/>}/>
      </Routes>
    </Router>
    
  );
}
export default App;

 
