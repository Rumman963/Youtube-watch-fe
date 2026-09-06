import { useState , type SyntheticEvent  } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";


export function SignUp(){
    const [username , setUsername] = useState("");
    const [password , setPassword] = useState("");
    const[error , setError] = useState("");
     const navigate = useNavigate();
    
     async function handleSubmit(e:SyntheticEvent){

         e.preventDefault();

         if (!username || !password) {
         setError("Please fill in both fields");
         return;

    }

    try {
      
      const response = await axios.post( API_BASE_URL + "/signup", {
        username: username,
        password: password,
      });

      console.log(response.data);

      navigate("/signin");

     } catch(err: any){

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
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

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

        {/* Only show this paragraph if there is an error */}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 font-medium"
        >
          Sign Up
        </button>

        <p className="text-neutral-400 text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-red-500 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
    )
}
