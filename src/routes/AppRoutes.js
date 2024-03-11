import { Route, Routes } from "react-router-dom";
import TableUser from "../components/TableUser";
import Home from "../components/Home";
import LoginUser from "../components/Login";
import PrivateRoute from "./PrivateRoutes";
import NotFound from "./NotFound";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginUser />} />
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <TableUser />
            </PrivateRoute>
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
