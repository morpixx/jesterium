"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login"); // "login" або "register"
  const [loginVal, setLoginVal] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: loginVal, password }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Login failed");
      }
      const data = await res.json();
      // Після успішного входу перенаправляємо користувача в профіль
      router.push("/profile");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: loginVal, email, password }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }
      const data = await res.json();
      alert(
        "Registration successful. Please check your email for a confirmation code."
      );
      // Опціонально: автоматичне переключення на форму входу після реєстрації
      setActiveTab("login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="home-container">
      <motion.div
        className="banner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/clown-juggling-coins.gif"
          alt="Juggling Clown"
          className="banner-img"
        />
        <h1>Have fun with Jesterium – crypto that brings a smile!</h1>
        <p>
          Welcome to Jesterium – the crypto project that fuses innovative blockchain technology with a circus show of creativity.
        </p>
        <Link href="/about">
          <motion.button className="learn-more" whileHover={{ scale: 1.1 }}>
            Learn More
          </motion.button>
        </Link>
      </motion.div>

      <div className="auth-container">
        <div className="tabs">
          <button
            onClick={() => setActiveTab("login")}
            className={activeTab === "login" ? "active" : ""}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={activeTab === "register" ? "active" : ""}
          >
            Register
          </button>
        </div>
        {error && <p className="error">Error: {error}</p>}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="form-section">
            <input
              type="text"
              placeholder="Login"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="toggle-password"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.05 }}>
              Login
            </motion.button>
          </form>
        )}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="form-section">
            <input
              type="text"
              placeholder="Login"
              value={loginVal}
              onChange={(e) => setLoginVal(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="toggle-password"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.05 }}>
              Register
            </motion.button>
          </form>
        )}
      </div>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
        }
        .banner {
          background: linear-gradient(135deg, #ffcc00, #ff9900);
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          margin-bottom: 30px;
        }
        .banner-img {
          width: 300px;
          height: auto;
          margin-bottom: 20px;
        }
        .learn-more {
          background: #222;
          color: #fff;
          border: none;
          padding: 10px 20px;
          margin-top: 20px;
          cursor: pointer;
        }
        .auth-container {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .tabs button {
          flex: 1;
          padding: 10px;
          background: #eee;
          border: none;
          cursor: pointer;
          font-weight: bold;
        }
        .tabs button.active {
          background: #ffcc00;
          color: #222;
        }
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-section input {
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 100%;
        }
        .password-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-wrapper input {
          flex: 1;
          padding-right: 60px;
        }
        .toggle-password {
          position: absolute;
          right: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          color: #555;
        }
        .form-section button {
          background: #222;
          color: #fff;
          border: none;
          padding: 10px;
          cursor: pointer;
          border-radius: 5px;
        }
        .error {
          color: red;
        }
      `}</style>
    </div>
  );
}