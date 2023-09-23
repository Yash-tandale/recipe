import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { useCookies } from "react-cookie";

const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };

  return (
    <nav>
      <Link to="/" className="title">
        Delish
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <button className="menu-lines"></button>
        <button className="menu-lines"></button>
        <button className="menu-lines"></button>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/create-recipe">CreateRecipe</NavLink>
        </li>
        {!cookies.access_token ? (
          <li>
            <Link to="/auth">Login/Register</Link>
          </li>
        ) : (
          <>
            <li>
              <NavLink to="/saved-recipe">SavedRecipe</NavLink>
            </li>
            <li>
              <Link onClick={logout}> Logout </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
