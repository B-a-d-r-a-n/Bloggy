import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  HeartIcon,
  PencilSquareIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useCurrentUser } from "../features/auth/queries";
function AboutPage() {
  const { data: user } = useCurrentUser();
  return (
    <div className="bg-base-100 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 space-y-16">
        {/* --- 1. Hero Section --- */}
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
            About Bloggy
          </h1>
          <p className="text-lg md:text-xl text-base-content/80 max-w-2xl mx-auto">
            A space for curious minds to share ideas, tell stories, and connect
            with a community of passionate writers and readers.
          </p>
        </header>

        {/* --- 2. Our Story Section --- */}
        <section>
          <div className="prose lg:prose-lg max-w-none mx-auto text-base-content">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p>
              In a fast-paced digital world, we wanted to create a corner of the
              internet dedicated to thoughtful, long-form content. Bloggy was
              born from a simple idea: that everyone has a story worth telling
              and knowledge worth sharing. Our mission is to provide a clean,
              beautiful, and intuitive platform that empowers creators and
              delights readers.
            </p>
            <p>
              We believe that writing is a powerful tool for connection and
              understanding. Whether you're an expert in your field, a hobbyist
              with a passion, or simply have a unique perspective to share,
              Bloggy is your stage. We handle the technology so you can focus on
              what matters most: your words.
            </p>
          </div>
        </section>

        {/* --- 3. Our Values Section --- */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Value 1: Creativity */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <PencilSquareIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Empower Creators</h3>
              <p className="mt-2 text-base-content/70">
                Providing simple, powerful tools to make publishing beautiful
                content effortless.
              </p>
            </div>
            {/* Value 2: Community */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <UsersIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Build Community</h3>
              <p className="mt-2 text-base-content/70">
                Fostering a respectful and engaging environment for discussion
                and connection.
              </p>
            </div>
            {/* Value 3: Quality */}
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <HeartIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Focus on Quality</h3>
              <p className="mt-2 text-base-content/70">
                Prioritizing a clean, ad-free reading experience that respects
                both writers and readers.
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. Call to Action (CTA) Section --- */}
        {/* We only render this entire section if the user is NOT logged in */}
        {!user && (
          <section className="text-center bg-base-200 p-8 md:p-12 rounded-lg">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <p className="max-w-xl mx-auto mt-4 text-base-content/80">
              Ready to share your voice or discover your next favorite author?
              Create an account and start your journey with Bloggy today.
            </p>
            <div className="mt-6">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started for Free
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
export const Route = createFileRoute("/about")({
  component: AboutPage,
});
