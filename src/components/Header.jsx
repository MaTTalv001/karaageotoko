import { Link } from 'react-router-dom';
import { memo } from "react";

export const Header = memo(() => {
  return (
    <header className="navbar bg-base-300 relative z-50">
      <div className="navbar-center flex-1 justify-center">
        <Link to="/" className="btn btn-ghost normal-case text-xl md:text-2xl">
          からあげ様は揚げられたい
        </Link>
      </div>
    </header>
  );
});