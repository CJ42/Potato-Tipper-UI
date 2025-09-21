import React from 'react';
import Link from 'next/link';

import RainbowKitCustomConnectButton from '../RainbowKitCustomConnectButton/RainbowKitCustomConnectButton';

/**
 * Provides a top navigation bar including links to all pages.
 */
const NavBar: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <div>
              <Link
                href="/"
                className="flex items-center py-5 px-2 text-gray-700 hover:text-gray-900"
              >
                <span className="font-bold ml-2">🥔 POTATO Tipper</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {/* <Link
              href="/"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Home
            </Link> */}
            {/* <Link
              href="/dashboard"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link> */}
            {/* <Link
              href="/stats"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Live Stats
            </Link> */}
            {/* <Link
              href="/leaderboard"
              className="py-5 px-3 text-gray-700 hover:text-gray-900"
            >
              Leaderboard
            </Link> */}
          </div>
          <div className="flex items-center space-x-4">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
