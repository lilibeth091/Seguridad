  import React, { useEffect, useRef, useState } from 'react';
  import { NavLink, useLocation } from 'react-router-dom';
  import Logo from '../images/logo/logo.svg';
  import SidebarLinkGroup from './SidebarLinkGroup';

  import { useSelector } from "react-redux";
  import { RootState } from "../../src/store/store";

  interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
  }

  const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
    const user = useSelector((state: RootState) => state.user.user);
    const location = useLocation();
    const { pathname } = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);

    const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
    const [sidebarExpanded, setSidebarExpanded] = useState(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
    );

    // close on click outside
    useEffect(() => {
      const clickHandler = ({ target }: MouseEvent) => {
        if (!sidebar.current || !trigger.current) return;
        if (
          !sidebarOpen ||
          sidebar.current.contains(target) ||
          trigger.current.contains(target)
        )
          return;
        setSidebarOpen(false);
      };
      document.addEventListener('click', clickHandler);
      return () => document.removeEventListener('click', clickHandler);
    });

    // close if the esc key is pressed
    useEffect(() => {
      const keyHandler = ({ keyCode }: KeyboardEvent) => {
        if (!sidebarOpen || keyCode !== 27) return;
        setSidebarOpen(false);
      };
      document.addEventListener('keydown', keyHandler);
      return () => document.removeEventListener('keydown', keyHandler);
    });

    useEffect(() => {
      localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
      if (sidebarExpanded) {
        document.querySelector('body')?.classList.add('sidebar-expanded');
      } else {
        document.querySelector('body')?.classList.remove('sidebar-expanded');
      }
    }, [sidebarExpanded]);

    return (
      <div> {user ?
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <NavLink to="/">
            <img src={Logo} alt="Logo" />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                GESTIÓN DE SEGURIDAD
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Usuarios --> */}
                <li>
                  <NavLink
                    to="/users/management"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('users') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <svg
                      className="fill-current"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                        fill=""
                      />
                      <path
                        d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                        fill=""
                      />
                    </svg>
                    Usuarios
                  </NavLink>
                </li>
                {/* <!-- Menu Item Usuarios --> */}

                {/* <!-- Menu Item Roles --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname.includes('/security/management') || pathname.includes('/users/roles')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname.includes('/security/management') || pathname.includes('/users/roles')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9 0.5625C4.58437 0.5625 1.125 4.02187 1.125 8.4375C1.125 12.8531 4.58437 16.3125 9 16.3125C13.4156 16.3125 16.875 12.8531 16.875 8.4375C16.875 4.02187 13.4156 0.5625 9 0.5625ZM9 15C5.33437 15 2.4375 12.1031 2.4375 8.4375C2.4375 4.77187 5.33437 1.875 9 1.875C12.6656 1.875 15.5625 4.77187 15.5625 8.4375C15.5625 12.1031 12.6656 15 9 15Z"
                              fill=""
                            />
                            <path
                              d="M9 4.125C8.31562 4.125 7.6875 4.54687 7.40625 5.175C7.26562 5.45625 7.21875 5.79375 7.21875 6.1875V7.5H6.5625C6.25313 7.5 6 7.75313 6 8.0625V12.1875C6 12.4969 6.25313 12.75 6.5625 12.75H11.4375C11.7469 12.75 12 12.4969 12 12.1875V8.0625C12 7.75313 11.7469 7.5 11.4375 7.5H10.7812V6.1875C10.7812 5.79375 10.7344 5.45625 10.5937 5.175C10.3125 4.54687 9.68438 4.125 9 4.125ZM9.9375 7.5H8.0625V6.1875C8.0625 5.90625 8.10938 5.73437 8.15625 5.625C8.29688 5.34375 8.57812 5.1875 9 5.1875C9.42188 5.1875 9.70313 5.34375 9.84375 5.625C9.89062 5.73437 9.9375 5.90625 9.9375 6.1875V7.5Z"
                              fill=""
                            />
                          </svg>
                          Roles
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/security/management?tab=roles"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Gestión de Roles
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/security/management?tab=userRoles"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Usuario-Rol
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Roles --> */}

                {/* <!-- Menu Item Permisos --> */}
                <SidebarLinkGroup
                  activeCondition={pathname.includes('permissions')}
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            pathname.includes('permissions') &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M14.5312 0.5625H3.46875C2.39062 0.5625 1.5 1.45312 1.5 2.53125V15.4688C1.5 16.5469 2.39062 17.4375 3.46875 17.4375H14.5312C15.6094 17.4375 16.5 16.5469 16.5 15.4688V2.53125C16.5 1.45312 15.6094 0.5625 14.5312 0.5625ZM15.1875 15.4688C15.1875 15.8156 14.878 16.125 14.5312 16.125H3.46875C3.12187 16.125 2.8125 15.8156 2.8125 15.4688V2.53125C2.8125 2.18437 3.12187 1.875 3.46875 1.875H14.5312C14.878 1.875 15.1875 2.18437 15.1875 2.53125V15.4688Z"
                              fill=""
                            />
                            <path
                              d="M6.9375 7.5H4.5C4.15312 7.5 3.84375 7.80937 3.84375 8.15625C3.84375 8.50313 4.15312 8.8125 4.5 8.8125H6.9375C7.28438 8.8125 7.59375 8.50313 7.59375 8.15625C7.59375 7.80937 7.28438 7.5 6.9375 7.5Z"
                              fill=""
                            />
                            <path
                              d="M13.5 11.625H4.5C4.15312 11.625 3.84375 11.9344 3.84375 12.2812C3.84375 12.6281 4.15312 12.9375 4.5 12.9375H13.5C13.8469 12.9375 14.1562 12.6281 14.1562 12.2812C14.1562 11.9344 13.8469 11.625 13.5 11.625Z"
                              fill=""
                            />
                            <path
                              d="M13.5 4.6875H4.5C4.15312 4.6875 3.84375 4.99687 3.84375 5.34375C3.84375 5.69063 4.15312 6 4.5 6H13.5C13.8469 6 14.1562 5.69063 14.1562 5.34375C14.1562 4.99687 13.8469 4.6875 13.5 4.6875Z"
                              fill=""
                            />
                          </svg>
                          Permisos
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/security/management?tab=permissions"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Gestión de Permisos
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/security/management?tab=rolePermissions"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Rol-Permiso
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Permisos --> */}
              </ul>
            </div>
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
      :<div></div>}</div>
    );
  };

  export default Sidebar;
