"use client";

import { useState } from 'react';
import { useAuth } from '@/context/auth';

// ✅ Confirmation Modal Component
const LogoutConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoggingOut: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to Logout?
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <p className="text-gray-600">
              You will be redirected to the login page and will need to login again to access your account.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging out...
                </>
              ) : (
                'Log Out'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ Enhanced Logout Button with Confirmation
export default function LogoutButton() {
  const { logout, userData } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    console.log('Logout button clicked - showing confirmation modal');
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    console.log('Logout confirmed by user');
    setIsLoggingOut(true);

    try {
      // Add a small delay for better UX (shows the loading state)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Perform the actual logout
      logout();

      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      setIsLoggingOut(false);
      // Could show an error message here
    }
  };

  const handleCloseModal = () => {
    if (!isLoggingOut) {
      console.log('Logout cancelled by user');
      setShowModal(false);
    }
  };

  // ✅ Handle keyboard shortcuts
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && showModal && !isLoggingOut) {
      handleConfirmLogout();
    } else if (event.key === 'Escape' && showModal && !isLoggingOut) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div
        className="flex items-center gap-2 py-2 pr-2 rounded cursor-pointer hover:bg-gray-100 transition"
        onKeyDown={handleKeyDown}
      >
        <button
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full"
          aria-label={`Logout ${userData?.email || 'current user'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 -0.5 25 25"
            fill="none"
            className={isLoggingOut ? 'animate-pulse' : ''}
          >
            <path
              d="M7.04401 9.53165C7.33763 9.23949 7.33881 8.76462 7.04665 8.47099C6.75449 8.17737 6.27962 8.17619 5.98599 8.46835L7.04401 9.53165ZM2.97099 11.4683C2.67737 11.7605 2.67619 12.2354 2.96835 12.529C3.26051 12.8226 3.73538 12.8238 4.02901 12.5317L2.97099 11.4683ZM5.98599 15.5317C6.27962 15.8238 6.75449 15.8226 7.04665 15.529C7.33881 15.2354 7.33763 14.7605 7.04401 14.4683L5.98599 15.5317ZM3.5 11.25C3.08579 11.25 2.75 11.25 3.5 12.75V11.25ZM17.5 12.75C17.9142 12.75 18.25 12.4142 18.25 12C18.25 11.5858 17.9142 11.25 17.5 11.25V12.75ZM3.5 12.75L17.5 12.75V11.25L3.5 11.25V12.75Z"
              fill="currentColor"
            />
            <path
              d="M9.5 15C9.5 17.2091 11.2909 19 13.5 19H17.5C19.7091 19 21.5 17.2091 21.5 15V9C21.5 6.79086 19.7091 5 17.5 5H13.5C11.2909 5 9.5 6.79086 9.5 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="font-bold">
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </p>
        </button>
      </div>

      {/* Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}