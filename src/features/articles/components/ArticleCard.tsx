import React from "react";
import ArticleActions from "./ArticleActions";

export default function ArticleCard() {
  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl transition-shadow duration-300 hover:shadow-2xl overflow-hidden">
      <figure>
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Shoes"
          className="w-full h-56 object-cover"
        />
      </figure>

      <div className="card-body p-6 gap-4">
        <h2 className="card-title text-2xl font-bold justify-center text-center">
          Title of the article
        </h2>

        <p className="text-center text-sm italic text-base-content/70 -mt-2">
          a 12 minutes read
        </p>

        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Author avatar"
              className="w-10 h-10 avatar rounded-full cursor-pointer object-cover"
            />
            <span className="font-semibold hover:underline hover:underline-offset-4 transition cursor-pointer">
              Author name
            </span>
          </div>
          <ArticleActions onDelete={() => 1} onEdit={() => 2} />
        </div>

        <p className="text-base-content/90 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
          officia odio corporis fuga, nobis, exercitationem voluptate neque
          perferendis ipsum amet, iure enim rem doloribus. Alias obcaecati amet
          quasi repudiandae itaque.
        </p>

        <div className="card-actions justify-between items-center mt-auto border-t border-base-content/10 pt-4">
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span>12.5k views</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="badge badge-outline">Fashion</div>
            <div className="badge badge-outline">Products</div>
          </div>
        </div>
      </div>
    </div>
  );
}
