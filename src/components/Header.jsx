import { Link } from 'react-router-dom';
import { memo } from "react";

export const Header = memo(() => {
  return (
    <header className="navbar bg-primary relative z-50">
      <div className="navbar-start">
      </div>
      <div className="navbar-center text-base-100 flex-1 justify-center">
        <Link to="/" className="btn btn-ghost normal-case text-xl md:text-2xl">
          からあげ様は揚げられたい
        </Link>
      </div>
      <div className="navbar-end">
        <Link to="/ranking" className="btn btn-ghost normal-case text-base-100">
          ランキング
        </Link>
      </div>
    </header>
  );
});