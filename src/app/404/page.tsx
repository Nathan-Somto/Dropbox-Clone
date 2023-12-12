import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <img
        src="https://assets.dropbox.com/www/en-us/illustrations/spot/look-magnifying-glass.svg"
        alt="Error: 404"
        className="h-48 object-cover w-48 mb-2"
      />
      <div className="text-center">
        <div className=" ">
          {" "}
          <h1 className="max-w-xl  mx-auto mb-12 text-3xl font-semibold ">
            <span>Error (404)</span> {" "}
            <span className="mt-4 block font-medium text-primary/80 text-xl">
              We can't find the page you're looking for.
            </span>
          </h1>{" "}
          <div className=" text-muted-foreground">
            {" "}
            <p className="mb-4 "> Here are a few links that may be helpful: </p>
            <ul className="text-blue-500 space-y-2 text-sm/5 dark:text-blue-900">
              {" "}
              <li>
                <Link to="/">Home</Link>
              </li>{" "}
              <li>
                <Link to="/sign-in">Sign in</Link>
              </li>
            </ul>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default NotFound;
