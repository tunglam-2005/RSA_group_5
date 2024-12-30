
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RSAUserLoginTemplate from "./templates/RSAUserLoginTemplate";
import RSALogin from "./pages/RSALogin";
import RSARegister from "./pages/RSARegister";
import RSASignupTemplate from "./templates/RSAUserSignUpTemplate";
import { GlobalNavigate } from "./util/RSAGlobalNavigate";
import SecureCommunicationRSA from "./Component/SecureCommunicationRSA";
import RSAHome from "./pages/RSAHome";
import RSASendMessage from "./pages/RSASendMessage/RSASendMessage";
import RSAReceiveMessage from "./pages/RSAReceiveMessage/RSAReceiveMessage";
import Modal from "./HOC/Modal";

function App() {
   

  return (
    <BrowserRouter>
    
    <GlobalNavigate />
    <Modal />
      <Routes>
        <Route path="/login" element={<RSAUserLoginTemplate Component={RSALogin}/>}></Route>
        <Route path="/register" element={<RSASignupTemplate Component={RSARegister}/>}></Route>
        <Route path="/app" element={<SecureCommunicationRSA />}></Route>
        <Route path="/home" element={<RSAHome />}></Route>
        <Route path="/" element={<RSAHome />}></Route>
        <Route path="/sendmessage" element={<RSASendMessage />}></Route>
        <Route path="/receivemessage" element={<RSAReceiveMessage />}></Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
