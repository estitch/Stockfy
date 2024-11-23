import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import common from '../assets/index';
import { IconFileSearch, IconFilePlus } from '@tabler/icons-react'

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navLinkClasses = ({ isActive }) => `
    flex items-center gap-4 border-2 border-solid border-sky-800 rounded-lg p-2
    ${isActive ? 'bg-sky-800 text-white' : ''}
  `;

  const iconClasses = ({ isActive }) => `
    w-7 h-7 
    ${!isOpen ? 'mx-auto' : ''} 
    ${isActive ? 'text-white' : 'text-sky-800'}
  `;

  return (
    <div
      className={`relative bg-white text-white h-screen border-r-2 shadow-lg p-4 ${
        isOpen ? 'w-64' : 'w-28'
      } transition-all duration-300 flex flex-col`}
    >
      <button
        className="object-cover top-8 -right-4 absolute z-10 p-2 transition-transform duration-300"
        onClick={toggleSidebar}
      >
        <img
          src={common.arrow}
          alt="Toggle icon"
          className={`w-6 h-6 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="w-20 flex items-center p-4">
        <img
          src={common.logo}
          alt="Logo"
          className="mr-4"
        />
        {isOpen && <h2 className="text-2xl text-sky-800 font-bold">Stockfy</h2>}
      </div>

      <nav className="text-sky-800 flex flex-col p-4 space-y-4">
        <NavLink 
          to="/add-product" 
          className={navLinkClasses}
        >
          <IconFilePlus 
            stroke={2} 
            className={iconClasses}
          />
          {isOpen && 'Registro'}
        </NavLink>

        <NavLink
          to="list-product"
          className={navLinkClasses}
        >
          <IconFileSearch 
            stroke={2} 
            className={iconClasses}
          />
          {isOpen && 'Consulta'}
        </NavLink>
      </nav>
    </div>
  );
}