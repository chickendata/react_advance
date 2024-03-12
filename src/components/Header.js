import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logoApp from "../assets/img/logo192.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../redux/action/userAction";
const Header = () => {
  const user = useSelector((state) => state.user.account);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(handleLogoutRedux());
  };

  useEffect(() => {
    if (user && user.auth === false && window.location.pathname !== "login") {
      navigate("/");
      toast.success("Log out success!");
    }
  }, [user]);
  return (
    <>
      <Navbar
        expand="lg"
        className="navbar navbar-expand-lg navbar-light bg-light"
      >
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logoApp}
              width={30}
              height={30}
              className="d-inline-block align-top"
              alt="react-bootstraps logo"
            />
            <span>Nguyen Viet Phuong</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              <>
                <Nav className="me-auto d-flex justify-content-between">
                  <NavLink className="nav-link" to="/">
                    Home
                  </NavLink>
                  <NavLink className="nav-link" to="/user">
                    Manager User
                  </NavLink>
                </Nav>
                <Nav>
                  {user && user.email && (
                    <span className="nav-link">Welcome {user.email} </span>
                  )}
                  <NavDropdown title="Settings" id="basic-nav-dropdown">
                    {user && user.auth === true ? (
                      <NavDropdown.Item
                        className="dropdown-item"
                        to="/logout"
                        onClick={() => handleLogout()}
                      >
                        Log out
                      </NavDropdown.Item>
                    ) : (
                      <NavLink className="dropdown-item" to="/login">
                        Login
                      </NavLink>
                    )}

                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
