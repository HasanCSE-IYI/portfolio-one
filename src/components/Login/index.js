import { signInWithGoogle } from '../../firebase';

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        alert('Authentication failed: ' + error.message);
      }
    }
  };

  return (
    <div className="dashboard">
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
