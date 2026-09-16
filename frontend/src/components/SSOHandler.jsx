import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function SSOHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Missing authentication token. Please launch this app from your school portal.');
      return;
    }

    try {
      // Decode the JWT token to extract the role (no signature verification needed here as it's just for routing)
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      
      // Save token
      localStorage.setItem('ptm_token', token);
      
      // Redirect based on role
      if (decodedPayload.role === 'ADMIN') {
        navigate('/admin');
      } else if (decodedPayload.role === 'TEACHER') {
        navigate('/teacher');
      } else if (decodedPayload.role === 'PARENT') {
        navigate('/parent');
      } else {
        setError('Invalid role in token.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process SSO token.');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {error ? (
            <div className="text-red-600 font-medium">{error}</div>
          ) : (
            <div className="text-slate-600">
              <svg className="animate-spin h-8 w-8 mx-auto text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Authenticating via SSO...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
