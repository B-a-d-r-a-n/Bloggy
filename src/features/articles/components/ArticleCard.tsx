import React from "react";

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

          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-square btn-sm"
              aria-label="Delete"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-error"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>

            <button
              className="btn btn-ghost btn-square btn-sm"
              aria-label="Edit"
            >
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
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </div>
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
