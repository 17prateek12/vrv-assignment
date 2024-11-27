'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
    const pathname = usePathname(); // Get the current route pathname

    // A utility function to check if the current route is active
    const isActive = (path) => {
        return pathname === path
            ? 'bg-pink-500 font-bold text-white'
            : 'bg-gray-300';
    };

    return (
        <div className="w-full h-[64px] flex flex-row">
            <Link
                href="/"
                className={`flex justify-center items-center w-1/2 cursor-pointer h-full ${isActive('/')}`}
            >
                USER
            </Link>
            <Link
                href="/rolepage"
                className={`flex justify-center items-center w-1/2 cursor-pointer h-full ${isActive('/rolepage')}`}
            >
                ROLE
            </Link>
        </div>
    );
};

export default NavBar;
