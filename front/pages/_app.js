import "../styles/globals.css";
import "../components/button.css"
import "../components/logine.css"
import "../components/tets.css"
import "../components/por.css"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



import Layout from "../components/layout";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ToastContainer />

    </Layout>
  );
}

export default MyApp;
