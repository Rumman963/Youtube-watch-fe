import { Link } from "react-router-dom";
import { WatchIcon } from "../icons/WatchIcon";

export function HomePage() {
  return (
    <div className="h-screen w-full bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="justify-end">
            <WatchIcon/>
        </div>
        <h1 className="text-3xl font-bold mb-3">
          Watch together, perfectly in sync
        </h1>

        <p className="text-neutral-400 mb-10">
          Create a room, share the code, and hit play together.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/signup"
            className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-500 font-medium"
          >
            Create Account
          </Link>

          <Link
            to="/signin"
            className="w-full py-3 rounded-lg border border-neutral-700 hover:border-neutral-500 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}