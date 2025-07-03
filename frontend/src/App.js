import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import AdminDashboard from './pages/AdminDashboard'
import AdminAddFoodItem from "./pages/AdminAddFoodItem";
import AdminViewFoodItem from "./pages/AdminViewFoodItem";
import AdminEditFood from "./pages/AdminEditFood";
import AdminSettings from "./pages/AdminSettings";
import AdminChangePassword from "./pages/AdminChangePassword";
import AdminTableSettings from "./pages/AdminTableSettings";

  function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister/>}/>
        <Route path="/admin/login" element={<AdminLogin/>}/>
        <Route path="/admin/home" element={<AdminDashboard/>}/>
        <Route path="/admin/addfooditem" element={<AdminAddFoodItem/>}/>
        <Route path="/admin/viewfooditem/:id" element={<AdminViewFoodItem/>}/>
        <Route path="/admin/editfooditem/:id" element={<AdminEditFood/>}/>
        <Route path="/admin/settings" element={<AdminSettings/>}/>
        <Route path="/admin/changepassword/:id" element={<AdminChangePassword/>}/>
        <Route path="/admin/tablesettings/:id" element={<AdminTableSettings/>}/>
        
         </Routes>
    </Router>
    
  );
}
export default App;

 
