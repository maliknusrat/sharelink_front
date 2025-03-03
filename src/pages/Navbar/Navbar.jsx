import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/signin');
    };

    return (
        <div className="navbar bg-base-300">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </label>
                </div>
                <a className="btn btn-ghost normal-case text-xl">Share Link</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/fileupload">File Upload</Link></li>
                    <li><Link to="/allfiles">Files</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="btn btn-sm bg-red-500 text-white">
                        Log Out
                    </button>
                ) : (
                    <Link to="/signin" className="btn btn-sm">Log In</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;
