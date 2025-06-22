import { Link } from "@tanstack/react-router";
import type { ArticleListItem } from "../../../core/types/article";
import { getUserAvatar } from "../../../lib/utils";
import ArticleActions from "./ArticleActions";
import {
  ChatBubbleOvalLeftEllipsisIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import type { Tag } from "../../../core/types/tag";
interface ArticleCardProps {
  article: ArticleListItem;
}
export default function ArticleCard({ article }: ArticleCardProps) {
  if (!article || !article.author) return null;
  return (
    <div className="card w-full max-w-3xl bg-base-100 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 group">
      {article.coverImageUrl && (
        <Link to="/articles/$articleId" params={{ articleId: article._id }}>
          <figure className="aspect-video bg-base-300">
            <img
              src={article.coverImageUrl}
              alt={`Cover for ${article.title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </figure>
        </Link>
      )}
      <div className="card-body p-6 md:p-8">
        {/* Category and Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {article.category && (
            <div className="badge badge-primary font-semibold">
              {article.category.name}
            </div>
          )}
          {article.tags?.slice(0, 3).map((tag: Tag) => (
            <div key={tag._id} className="badge badge-ghost">
              #{tag.name}
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 className="card-title text-2xl lg:text-3xl font-bold leading-tight">
          <Link
            to="/articles/$articleId"
            params={{ articleId: article._id }}
            className="link link-hover"
          >
            {article.title}
          </Link>
        </h2>

        {/* Author Meta */}
        <div className="flex items-center gap-3 mt-4">
          <Link
            to="/profile/$userId"
            params={{ userId: article.author._id }}
            className="avatar"
          >
            <div className="w-10 h-10 rounded-full">
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
              to="/profile/$userId"
              params={{ userId: article.author._id }}
              className="font-semibold link link-hover text-base-content"
            >
              {article.author.name}
            </Link>
            <p className="text-xs text-base-content/60">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-base-content/80 leading-relaxed my-4 break-words">
          {article.summary}
        </p>

        {/* Footer: Stats & Actions */}
        <div className="card-actions justify-between items-center mt-auto pt-4 border-t border-base-content/10">
          <div className="flex items-center gap-4 text-sm text-base-content/70">
            {}
            <div
              className="flex items-center gap-1.5"
              title={`${article.starsCount} stars`}
            >
              <StarIcon className="w-5 h-5" />
              <span className="font-medium">{article.starsCount}</span>
            </div>
            {}
            <div
              className="flex items-center gap-1.5"
              title={`${article.totalCommentCount} comments`}
            >
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
              <span className="font-medium">{article.totalCommentCount}</span>
            </div>
          </div>
          <ArticleActions articleId={article._id} author={article.author} />
        </div>
      </div>
    </div>
  );
}
