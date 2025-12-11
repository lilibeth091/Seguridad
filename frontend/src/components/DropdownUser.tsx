import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import SecurityService from '../services/securityService';
import Swal from 'sweetalert2';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = async () => {
    try {
      // Cerrar el dropdown
      setDropdownOpen(false);

      // Mostrar confirmación
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3C50E0',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Cerrar sesión
        await SecurityService.logout();

        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });

        // Redirigir al login
        navigate('/auth/signin');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al cerrar sesión. Intenta nuevamente.',
        icon: 'error',
        confirmButtonColor: '#3C50E0'
      });
    }
  };

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {user?.name || 'Usuario'}
          </span>
          <span className="block text-xs">{user?.email || 'user@example.com'}</span>
        </span>

        <span className="h-12 w-12 rounded-full overflow-hidden">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="User" 
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/images/user/user-01.png"
              alt="User"
              className="h-full w-full object-cover"
            />
          )}
        </span>

        <svg
          className={`hidden fill-current sm:block ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col overflow-y-auto border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              onClick={() => setDropdownOpen(false)}
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                  fill=""
                />
                <path
                  d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                  fill=""
                />
              </svg>
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="/pages/settings"
              className="flex items-center gap-3.5 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              onClick={() => setDropdownOpen(false)}
            >
              <svg
                className="fill-current"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.8656 8.86874C20.5219 8.49062 20.0406 8.28437 19.525 8.28437H19.4219L19.3531 8.21562C19.2155 8.07812 19.1124 7.90624 19.0437 7.73437L18.975 7.52812L18.9406 7.39062C18.9406 7.04687 19.0437 6.73749 19.25 6.49374L19.3187 6.39062C19.7656 5.84374 19.8343 5.09374 19.525 4.44999C19.2155 3.80624 18.5968 3.43124 17.9437 3.39687H17.8062C17.4281 3.39687 17.0843 3.25937 16.8062 3.01562L16.7031 2.91249C16.5655 2.77499 16.4624 2.60312 16.3937 2.43124L16.325 2.22499V2.12187C16.325 1.43437 15.9468 0.781242 15.3281 0.471867C14.7437 0.162492 14.0218 0.231242 13.5062 0.644992L13.4031 0.714867C13.0593 0.956867 12.6468 1.09999 12.2343 1.09999C11.8218 1.09999 11.4093 0.956867 11.0655 0.714867L10.9624 0.644992C10.4468 0.231242 9.72493 0.162492 9.14055 0.471867C8.5218 0.781242 8.14368 1.43437 8.14368 2.12187V2.22499L8.07493 2.39687C8.00618 2.56874 7.9031 2.74062 7.76555 2.87812L7.66243 2.98124C7.38431 3.22499 7.04055 3.36249 6.66243 3.36249H6.55931C5.9062 3.39687 5.28743 3.77187 4.97806 4.41562C4.66868 5.05937 4.73743 5.80937 5.18431 6.35624L5.25306 6.45937C5.45931 6.70312 5.56243 7.01249 5.56243 7.35624V7.45937L5.49368 7.63124C5.42493 7.80312 5.32181 7.97499 5.18431 8.11249L5.11556 8.18124C4.59993 8.52499 4.2218 9.07187 4.11868 9.71562C4.01556 10.325 4.18743 10.9687 4.59993 11.4156L4.66868 11.4843C4.9468 11.7281 5.08431 12.0375 5.08431 12.3812V12.4843L5.01556 12.6562C4.94681 12.8281 4.84368 13 4.70618 13.1375L4.63743 13.2406C4.19055 13.7875 4.1218 14.5375 4.43118 15.1812C4.74055 15.825 5.35931 16.2 6.0124 16.2343H6.14993C6.52806 16.2343 6.8718 16.3718 7.14993 16.6156L7.25306 16.7187C7.39056 16.8562 7.49368 17.0281 7.56243 17.2L7.63118 17.4062V17.5093C7.63118 18.1968 8.00931 18.85 8.62806 19.1593C9.2468 19.4687 9.96868 19.4 10.4843 18.9862L10.5874 18.9175C10.9312 18.6756 11.3437 18.5325 11.7562 18.5325C12.1687 18.5325 12.5812 18.6756 12.925 18.9175L13.0281 18.9862C13.2687 19.1593 13.5468 19.2625 13.8593 19.2625C14.1031 19.2625 14.3468 19.2281 14.5906 19.125C15.2093 18.8156 15.5874 18.1625 15.5874 17.475V17.3718L15.6562 17.2C15.7249 17.0281 15.8281 16.8562 15.9656 16.7187L16.0687 16.6156C16.3468 16.3718 16.6906 16.2343 17.0687 16.2343H17.1718C17.8249 16.2 18.4437 15.825 18.7531 15.1812C19.0624 14.5375 18.9937 13.7875 18.5468 13.2406L18.4781 13.1375C18.2374 12.8937 18.1343 12.5843 18.1343 12.2406V12.1375L18.2031 11.9656C18.2718 11.7937 18.3749 11.6218 18.5124 11.4843L18.5812 11.4156C19.0968 11.0718 19.475 10.525 19.5781 9.88124C19.6468 9.23749 19.475 8.59374 19.0624 8.14687L20.8656 8.86874ZM11.7906 13.7187C10.2218 13.7187 8.97806 12.475 8.97806 10.9062C8.97806 9.33749 10.2218 8.09374 11.7906 8.09374C13.3593 8.09374 14.6031 9.33749 14.6031 10.9062C14.6031 12.475 13.3593 13.7187 11.7906 13.7187Z"
                  fill=""
                />
              </svg>
              Account Settings
            </Link>
          </li>
        </ul>
        
        {/* Botón de Logout */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
              fill=""
            />
            <path
              d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
              fill=""
            />
          </svg>
          Log Out
        </button>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownUser;