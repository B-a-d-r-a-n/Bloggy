import { getUserAvatar } from "../../../lib/utils";
import {
  ClockIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import ArticleActions from "./ArticleActions";
import DOMPurify from "dompurify";
import type { ArticleFull } from "../../../core/types/article";
import { Link } from "@tanstack/react-router";
import { marked } from "marked";
import StarButton from "./StarButton";
interface ArticleDetailDisplayProps {
  article: ArticleFull;
}
export default function ArticleDetailDisplay({
  article,
}: ArticleDetailDisplayProps) {
  const rawHtml = marked.parse(article.content) as string;
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  const scrollToComments = () => {
    document
      .getElementById("comment-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <article className="max-w-4xl mx-auto">
      {/* Header Section */}
      <header className="text-center mb-8">
        {article.category && (
          <div className="badge badge-primary font-semibold mb-4 text-sm py-3 px-4">
            {article.category.name}
          </div>
        )}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-base-content leading-tight break-words">
          {article.title}
        </h1>
        <p className="text-lg lg:text-xl text-base-content/70 mt-4 max-w-3xl mx-auto">
          {article.summary}
        </p>
      </header>
      {/* Cover Image */}
      {article.coverImageUrl && (
        <figure className="mb-8 lg:mb-12 rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-video bg-base-300">
            <img
              src={article.coverImageUrl}
              alt={`Cover for ${article.title}`}
              className="w-full h-full object-cover"
            />
          </div>
        </figure>
      )}
      {/* Author and Meta Info Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 my-8 border-y border-base-300 py-4">
        <div className="flex items-center gap-4">
          <Link
            params={{ userId: article.author._id }}
            to={`/profile/$userId`}
            className="avatar"
          >
            <div className="w-14 h-14 rounded-full">
              <img
                src={getUserAvatar(
                  article.author.name,
                  article.author.avatarUrl
                )}
                alt={article.author.name}
              />
            </div>
          </Link>
          <div>
            <Link
              params={{ userId: article.author._id }}
              to={`/profile/$userId`}
              className="font-bold text-base-content link link-hover"
            >
              {article.author.name}
            </Link>
            <p className="text-sm text-base-content/60">
              Published on{" "}
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        {/* Meta Info: Read Time & Comment Count */}
        <div className="flex items-center gap-x-6 text-base-content/70">
          <div className="flex items-center gap-2" title="Read time">
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm">
              {article.readTimeInMinutes} min read
            </span>
          </div>
          {}
          <button
            onClick={scrollToComments}
            className="flex items-center gap-2 hover:text-primary transition-colors"
            title="Scroll to comments"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-sm">
              {article.totalCommentCount} comments
            </span>
          </button>
        </div>
        <StarButton
          articleId={article._id}
          starredBy={article.starredBy}
          starsCount={article.starsCount}
        />
      </div>

      {/* Article Content */}
      <div
        className="prose lg:prose-xl max-w-none mx-auto text-base-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />

      {/* Footer: Tags & Actions */}
      <div className="flex flex-wrap justify-between items-start gap-4 mt-12 pt-6 border-t border-base-300">
        {}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <div key={tag._id} className="badge badge-lg badge-outline">
                #{tag.name}
              </div>
            ))}
          </div>
        )}

        {/* only render if the current user is the author */}
        <div className="flex-shrink-0">
          <ArticleActions articleId={article._id} author={article.author} />
        </div>
      </div>
    </article>
  );
}
