import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useLogoutMutation } from '../store/api/authApi';
import { toast } from 'react-toastify';
import { UserRole } from '../types';
import {
  FiHome,
  FiFileText,
  FiAward,
  FiUser,
  FiUsers,
  FiBookOpen,
  FiBarChart,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const navigationItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FiHome,
      roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.SUPERVISOR]
    },
    {
      path: '/assessment',
      label: 'Assessment',
      icon: FiFileText,
      roles: [UserRole.STUDENT]
    },
    {
      path: '/certificates',
      label: 'Certificates',
      icon: FiAward,
      roles: [UserRole.STUDENT]
    },
    {
      path: '/admin/users',
      label: 'User Management',
      icon: FiUsers,
      roles: [UserRole.ADMIN]
    },
    {
      path: '/admin/questions',
      label: 'Questions',
      icon: FiBookOpen,
      roles: [UserRole.ADMIN]
    },
    {
      path: '/admin/reports',
      label: 'Reports',
      icon: FiBarChart,
      roles: [UserRole.ADMIN, UserRole.SUPERVISOR]
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: FiUser,
      roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.SUPERVISOR]
    }
  ];

  const filteredNavItems = navigationItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-primary-600">Test School</h1>
            <p className="text-sm text-gray-600 mt-1">Assessment Platform</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <p className="text-xs text-primary-600 font-medium mt-1">
                {user?.role.toUpperCase()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;