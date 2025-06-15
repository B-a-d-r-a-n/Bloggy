import React from "react";
// import { Link } from '@tanstack/react-router';
import type { ArticleFull } from "../../../core/types/article"; // Adjust path
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

// This component uses a library to safely render HTML from your rich text editor.
// It's crucial for preventing XSS attacks.
// npm install dompurify
import DOMPurify from "dompurify";

interface ArticleDetailDisplayProps {
  article: ArticleFull;
}

export default function ArticleDetailDisplay({
  article,
}: ArticleDetailDisplayProps) {
  // Sanitize the HTML content before rendering it.
  const cleanHtml = DOMPurify.sanitize(article.content);

  return (
    <article className="max-w-4xl mx-auto">
      {/* 1. Category Badge */}
      <div className="text-center mb-4">
        {article.category && (
          <div className="badge badge-primary badge-lg">
            {article.category.name}
          </div>
        )}
      </div>

      {/* 2. Main Title */}
      <h1 className="text-4xl lg:text-5xl font-extrabold text-center text-base-content mb-6">
        {article.title}
      </h1>

      {/* 3. Subtitle / Summary */}
      <p className="text-lg lg:text-xl text-center text-base-content/70 mb-8 max-w-3xl mx-auto">
        {article.summary}
      </p>

      {/* 4. Author and Meta Info */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-x-6 gap-y-4 mb-8 border-y border-base-300 py-4">
        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full">
              <img
                src={article.author.avatarUrl || "/default-avatar.png"}
                alt={article.author.name}
              />
            </div>
          </div>
          <div>
            <p className="font-bold text-base-content">{article.author.name}</p>
            {/* Link to the author's profile page can go here */}
            <p className="text-sm text-base-content/60">Author</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-x-6 gap-y-2 text-base-content/70">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5" />
            <span className="text-sm">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm">
              {article.readTimeInMinutes} min read
            </span>
          </div>
        </div>
      </div>

      {/* 5. Cover Image (Hero) */}
      {article.coverImageUrl && (
        <figure className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={article.coverImageUrl}
            alt={`Cover for ${article.title}`}
            className="w-full h-auto object-cover"
          />
        </figure>
      )}

      {/* 6. Article Content */}
      <div
        className="prose lg:prose-xl max-w-none mx-auto text-base-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      {/* 7. Tags Footer */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-base-300">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <div key={tag._id} className="badge badge-outline badge-lg">
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
