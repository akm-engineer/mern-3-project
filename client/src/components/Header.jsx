/* eslint-disable react-hooks/exhaustive-deps */

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-purple-700 shadow-md">
      <div className="flex justify-between items-start max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold flex flex-wrap text-sm sm:text-xl">
            <span className="text-white">digitalFlake</span>
          </h1>
        </Link>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-white cursor-pointer hover:underline">
              Home
            </li>
          </Link>
          <Link to="/products">
            <li className="hidden sm:inline text-white cursor-pointer hover:underline">
              Products
            </li>
          </Link>
          <Link to="/categories">
            <li className="hidden sm:inline text-white cursor-pointer hover:underline">
              Categories
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700 cursor-pointer hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
