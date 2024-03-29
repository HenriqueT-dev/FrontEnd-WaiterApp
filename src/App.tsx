import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Header from "./Components/Header";
import Orders from "./Components/Orders";
import { GlobalStyles } from "./styles/GlobalStyles";

export default function App(){
  return(
    <>
    <GlobalStyles />
    <Header />
    <Orders />
    <ToastContainer position="bottom-center"/>
    </>
  )
}
