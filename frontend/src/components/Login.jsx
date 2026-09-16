import { useState } from 'react';
import { loginMockERP } from '../api/client';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('PARENT');
  const [userId, setUserId] = useState('student_123');
  const [tenantId, setTenantId] = useState('school_A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usersByRole = {
    PARENT: [
      { id: 'student_123', label: 'Parent of Student 123' },
      { id: 'student_456', label: 'Parent of Student 456' },
    ],
    TEACHER: [
      { id: 'Mrs. Davis (Math)', label: 'Mrs. Davis (Math)' },
      { id: 'Mr. Smith (Science)', label: 'Mr. Smith (Science)' },
    ],
    ADMIN: [
      { id: 'admin_1', label: 'School Admin' },
    ]
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    setUserId(usersByRole[newRole][0].id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await loginMockERP(role, userId, tenantId);
      onLoginSuccess(role);
    } catch (err) {
      console.error(err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome to <span className="text-indigo-600">EduPTM</span>
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to access your parent-teacher meeting portal.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                I am a...
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="PARENT">Parent</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
                Select Profile
              </label>
              <div className="mt-1">
                <select
                  id="userId"
                  name="userId"
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                >
                  {usersByRole[role].map(user => (
                    <option key={user.id} value={user.id}>{user.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
