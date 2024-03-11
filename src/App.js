import Container from "react-bootstrap/esm/Container";
import "./App.scss";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";
import AppRoutes from "./routes/AppRoutes";
function App() {
  const { user, loginContext } = useContext(UserContext);
  console.log(user);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(
        localStorage.getItem("email") ? localStorage.getItem("email") : null,
        localStorage.getItem("token") ? localStorage.getItem("token") : null
      );
    }
  }, []);
  return (
    <div className="app-container">
      <Header />
      <Container>
        <AppRoutes />
      </Container>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
