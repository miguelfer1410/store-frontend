import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './screen/HomeScreen';
import LoginScreen from './screen/LoginScreen';
import { AuthProvider } from './auth/AuthContext'; // Importe o contexto
import AdminScreen from './screen/AdminScreen';
import AddNewProductScreen from './screen/AddNewProductScreen';
import ProductDetailsScreen from './screen/ProductDetailsScreen';
import { ContextProvider } from './context/Context';
import CartScreen from './screen/CartScreen';
import ProfileScreen from './screen/ProfileScreen';
import ManageProfileScreen from './screen/ManageProfileScreen';
import CheckoutScreen from './screen/CheckoutScreen';
import MessageScreen from './screen/MessageScreen';
import ForgotPasswordComponent from './components/ForgotPasswordComponent';
import RegisterStepper from './components/register/RegisterStepper'; // Novo import
import Footer from './components/Footer';
import About from './components/footer/About';

function App() {
  return (
      <ContextProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterStepper />} /> {/* Atualizado */}
              <Route path='/admin' element={<AdminScreen />} />
              <Route path='/add' element={<AddNewProductScreen />} />
              <Route path='/product/:id' element={<ProductDetailsScreen />} />
              <Route path='/cart' element={<CartScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/account/:id' element={<ManageProfileScreen />}/>
              <Route path='/checkout' element={<CheckoutScreen />} />
              <Route path='/messages' element={<MessageScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
              <Route path="/about" element={<About />} />
            </Routes>
            <Footer />
          </Router>
        </AuthProvider>
      </ContextProvider>

  );
}

export default App;
