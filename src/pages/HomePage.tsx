import { useState } from "react";
import { Link } from "react-router-dom";
import { WatchIcon } from "../icons/WatchIcon";

export function HomePage() {
  const [isWiggling, setIsWiggling] = useState(false);

  function handleIconClick() {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 400);
  }

  return (
    <div className="relative h-screen w-full bg-neutral-950 text-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <button
            onClick={handleIconClick}
            className={
              "cursor-pointer animate-glow-pulse " +
              (isWiggling ? "animate-wiggle" : "")
            }
          >
            <WatchIcon className="w-16 h-16" />
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Watch together,
          <br />
          perfectly in sync
        </h1>

        <p className="text-neutral-400 mb-10 text-base">
          Create a room, share the code, and hit play together.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/signup"
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 transition font-medium shadow-lg shadow-red-600/20"
          >
            Create Account
          </Link>

          <Link
            to="/signin"
            className="w-full py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}