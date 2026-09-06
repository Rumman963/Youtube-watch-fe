import { useState, type SyntheticEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { WatchIcon } from "../icons/WatchIcon";

export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isWiggling, setIsWiggling] = useState(false);
  const navigate = useNavigate();

  function handleIconClick() {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL + "/signin", {
        username: username,
        password: password,
      });

      console.log(response.data);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);

      navigate("/join");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="h-screen w-full bg-neutral-950 text-white flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={handleIconClick}
            className={"cursor-pointer " + (isWiggling ? "animate-wiggle" : "")}
          >
            <WatchIcon />
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-3 mb-3 rounded-lg bg-neutral-900 border border-neutral-700 outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-3 rounded-lg bg-neutral-900 border border-neutral-700 outline-none"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 font-medium"
        >
          Sign In
        </button>

        <p className="text-neutral-400 text-sm text-center mt-4">
          New here?{" "}
          <Link to="/signup" className="text-red-500 hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}