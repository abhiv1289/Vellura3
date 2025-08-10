import { useMemo } from "react";
import { Link } from "react-router-dom";
import { usePlay } from "../Context/Play";

function LandingPage() {
  const { play, end } = usePlay();

  const effects = useMemo(() => null, [play, end]); // Placeholder for postprocessing

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-xl text-center animate-fade-in">
        <p className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug mb-8">
          WE WELCOME YOU <br />
          TO YOUR OWN SAFE SPACE.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-purple-600 text-white font-medium hover:bg-purple-700 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-full border-2 border-purple-600 text-purple-600 font-medium hover:bg-purple-600 hover:text-white transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
