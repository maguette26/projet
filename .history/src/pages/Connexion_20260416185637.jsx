// src/pages/Connexion.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/serviceAuth";
import Layout from "../components/commun/Layout";

const Connexion = () => {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleConnexion = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const responseData = await login(email, motDePasse);

      const { role, id } = responseData;

      const cleanedRole = role.replace("ROLE_", "");
      const roleToStore =
        cleanedRole === "USER" ? "UTILISATEUR" : cleanedRole;

      localStorage.setItem("role", roleToStore);
      localStorage.setItem("userId", id);

      window.dispatchEvent(new Event("storage"));

      setMessage("Connexion réussie ! Redirection...");

      switch (cleanedRole) {
        case "ADMIN":
          navigate("/tableauAdmin");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Connexion échouée. Vérifiez vos identifiants.";

      setMessage("Erreur : " + errorMessage);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f1a]">

        <div className="w-[900px] h-[500px] relative rounded-2xl overflow-hidden animate-glow">

          {/* Border glow */}
          <div className="absolute inset-0 border border-cyan-400 rounded-2xl opacity-40"></div>

          <div className="flex h-full">

            {/* LEFT SIDE */}
            <div className="w-1/2 flex flex-col justify-center px-12 bg-[#0b0f1a] backdrop-blur-md">

              <h2 className="text-3xl font-bold text-white mb-8">
                Login
              </h2>

              <form onSubmit={handleConnexion} className="space-y-6">

                <div>
                  <label className="text-gray-400 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full bg-transparent border-b border-gray-600 text-white py-2 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="********"
                    className="w-full bg-transparent border-b border-gray-600 text-white py-2 focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:scale-105 transition"
                >
                  Login
                </button>

                {message && (
                  <p
                    className={`text-center text-sm ${
                      message.includes("réussie")
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              <p className="text-gray-400 text-sm mt-6">
                Don’t have an account?{" "}
                <Link
                  to="/inscription"
                  className="text-cyan-400 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="w-1/2 relative flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600">

              {/* Diagonal overlay */}
              <div className="absolute inset-0 bg-[#0b0f1a] clip-diagonal"></div>

              <h1 className="text-white text-3xl font-bold z-10 text-center">
                WELCOME <br /> BACK!
              </h1>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Connexion;