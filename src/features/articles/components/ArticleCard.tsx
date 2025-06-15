import ArticleActions from "./ArticleActions";
import type { ArticleListItem } from "../../../core/types/article";
import { Link } from "@tanstack/react-router";
import { getUserAvatar } from "../../../lib/utils";
interface ArticleCardProps {
  article: ArticleListItem;
}
export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group ">
      <Link
        to="/articles/$articleId"
        params={{ articleId: article._id }}
        className="block"
      >
        <figure className="h-56 overflow-hidden">
          <img
            src={
              article.coverImageUrl
                ? `${article.coverImageUrl}`
                : "/default-cover.jpg"
            }
            alt={`Cover image for ${article.title}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </figure>
      </Link>
      <div className="card-body p-6 gap-3">
        {article.category && (
          <div className="badge badge-primary badge-lg">
            {article.category.name}
          </div>
        )}
        <h2 className="card-title text-2xl lg:text-3xl font-bold !justify-start ">
          <Link
            to="/articles/$articleId"
            params={{ articleId: article._id }}
            className="link link-hover break-all"
          >
            {article.title}
          </Link>
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <img
                  src={getUserAvatar(
                    article.author.name,
                    article.author.avatarUrl
                  )}
                  alt={`Avatar of ${article.author.name}`}
                />
              </div>
            </div>
            <span className="font-semibold">{article.author.name}</span>
          </div>
          <span className="opacity-70">•</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span className="opacity-70">•</span>
          <span>{article.readTimeInMinutes} min read</span>
        </div>
        <p className="text-base-content/90 leading-relaxed mt-2 break-words">
          {article.summary}
        </p>
        <div className="card-actions justify-between items-center mt-auto border-t border-base-content/10 pt-4">
          <div className="flex flex-wrap gap-2">
            {article.tags?.map((tag) => (
              <div key={tag._id} className="badge badge-ghost">
                {tag.name}
              </div>
            ))}
          </div>
          {}
          <ArticleActions articleId={article._id} author={article.author} />
        </div>
      </div>
    </div>
  );
}
