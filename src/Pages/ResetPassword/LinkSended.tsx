import React from "react";

function LinkSended() {
  return (
    <section className="bg-background_grey">
      <div className="container">
        <a
          href="forgotpass"
          className="px-4 font-bold text-font_dark text-sm flex items-center gap-2 font-Nunito"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 19.5l-15-15m0 0v11.25m0-11.25h11.25"
            />
          </svg>
          <span>Back to sign in</span>
        </a>
        <div className="flex justify-center items-start w-full  max-w-md">
          <div className="mx-auto py-28 px-4">
            <h2 className="text-center font-Nunito font-bold text-font_black text-text_28 uppercase">
              Reset link sent
            </h2>
            <p className="font-Nunito text-center font-normal pt-4 text-font_black">
              Check your inbox for the link to reset your password.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LinkSended;
