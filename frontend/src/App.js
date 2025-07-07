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
import AdminTableConfigure from "./pages/AdminTableConfigure";
import UserRegister from "./pages/UserRegister";
import UserLogin from "./pages/UserLogin";
import AdminUserRequest from "./pages/AdminUserRequest";
import UserDashboard from "./pages/UserDashboard";
import UserSettings from "./pages/UserSettings";
import UserViewFoodItem from "./pages/UserViewFoodItem";
import UserChangePassword from "./pages/UserChangePassword";
import UserTakeOrders from "./pages/UserTakeOrders";
import UserDisplayOrders from "./pages/UserDisplayOrders";
import UserAllOrders from "./pages/UserAllOrders";
import UserViewOrders from "./pages/UserViewOrders";
import AdminAllOrders from "./pages/AdminAllOrders";
import AdminTableStatus from "./pages/AdminTableStatus";

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
        <Route path="/admin/tableconfigure"  element={<AdminTableConfigure/>}/>
        <Route path="/admin/adminuserrequest/:email" element={<AdminUserRequest/>}/>
        <Route path="/admin/allorders" element={<AdminAllOrders/>}/>
        <Route path="/admin/tables/:type/:number" element={<AdminTableStatus/>}/>
        <Route path="/users/register"  element={<UserRegister/>}/>
        <Route path="/users/login" element={<UserLogin/>}/>
        <Route path="/users/dashboard" element={<UserDashboard/>}/>
        <Route path="/users/settings" element={<UserSettings/>}/>
        <Route path="/users/viewfooditems" element={<UserViewFoodItem/>}/>
        <Route path="/users/changepassword" element={<UserChangePassword/>}/>
        <Route path="/users/takeorders" element={<UserTakeOrders/>}/>
        <Route path="/users/tables/:type/:number" element={<UserDisplayOrders/>}/>
        <Route path="/users/allorders" element={<UserAllOrders/>}/>
        <Route path="/users/vieworders" element={<UserViewOrders/>}/>
         </Routes>
    </Router>
    
  );
}
export default App;

 
