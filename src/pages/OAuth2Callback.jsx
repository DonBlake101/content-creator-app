import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            navigate('/youtube/success');
          } else {
            alert('Login failed');
          }
        });
    }
  }, [navigate]);

  return <div className="flex items-center justify-center min-h-screen text-xl">Logging in...</div>;
};

export default OAuth2Callback; 