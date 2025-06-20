import React, { useState } from "react";
import "./LoginSignUp.css";
import { API_URL } from "../../constants.js";
import { useNavigate } from "react-router-dom";

const LoginSignUp = ({ setUser, refreshHeader }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("elev");
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setErrorMessage(""); // curăță mesajul anterior

    // validare câmpuri goale
    if (
      (isLogin && (!email || !parola)) ||
      (!isLogin && (!nume || !email || !parola))
    ) {
      setErrorMessage("Te rugăm să completezi toate câmpurile.");
      return;
    }

    try {
      const resource = isLogin ? "/autentificare" : "/creare-cont";
      const response = await fetch(API_URL + resource, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nume,
          email,
          parola,
          elev: role === "elev",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.jwt) localStorage.setItem("jwt", data.jwt);
        if (data.userData) {
          localStorage.setItem("userData", JSON.stringify(data.userData));
          setUser(data.userData);
        }
        navigate("/");
        refreshHeader()
      } else {
        setErrorMessage(data.message || "Email sau parolă incorecte.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Eroare la conectare. Încearcă din nou.");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-toggle">
          <button className={isLogin ? "active" : ""} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={!isLogin ? "active" : ""} onClick={() => setIsLogin(false)}>
            Sign Up
          </button>
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {isLogin ? (
          <div className="form">
            <h2>Login Form</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
            />
            <a>Forgot Password</a>
            <button onClick={handleSubmit}>Login</button>
            <p>
              Not a member?{" "}
              <a href="#" onClick={() => setIsLogin(false)}>
                Sign up now
              </a>
            </p>
          </div>
        ) : (
          <div className="form">
            <h2>Sign Up Form</h2>
            <input
              type="text"
              placeholder="Name"
              value={nume}
              onChange={(e) => setNume(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={parola}
              onChange={(e) => setParola(e.target.value)}
            />
            <div className="role-selector">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="profesor"
                  checked={role === "profesor"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Profesor
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="elev"
                  checked={role === "elev"}
                  onChange={(e) => setRole(e.target.value)}
                />
                Elev
              </label>
            </div>
            <button onClick={handleSubmit}>Confirm</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginSignUp;
