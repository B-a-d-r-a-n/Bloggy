import { Link } from "@tanstack/react-router";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center px-4">
      <ExclamationTriangleIcon className="w-24 h-24 text-warning mb-6" />
      <h1 className="text-5xl md:text-6xl font-extrabold text-base-content">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-bold text-base-content/80 mt-4">
        Page Not Found
      </h2>
      <p className="max-w-md mt-4 text-base-content/70">
        Oops! It seems like you've taken a wrong turn. The page you are looking
        for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/" className="btn btn-primary btn-lg">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
