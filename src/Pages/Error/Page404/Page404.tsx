import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div className="grid h-screen place-items-center m-auto">
      <h1 className="text-4xl">
        Page Not Found.
        <Link className="underline" to="/">
          Go to Dashboard
        </Link>
      </h1>
    </div>
  );
};

export default Page404;
