import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/auth.service';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({ token, password });
      setMessage(response.message || 'Password reset successfully. You can now sign in.');
      window.setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to reset password. Please request a new link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dqcxekzxn/image/upload/v1783849537/IMG_20260712_151425_qzsbht.png"
              alt="Veloura"
              className="h-12 w-auto object-contain rounded-sm shadow-sm"
            />
          </Link>
        </div>
        <h2 className="mt-2 text-center text-3xl font-heading font-bold text-primary">
          Create New Password
        </h2>
        <p className="mt-2 text-center text-sm text-dark/70">
          Choose a new password for your Veloura account.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-premium sm:rounded-none sm:px-10 border border-cream">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div className="bg-green-50 border-l-4 border-success p-4">
                <p className="text-sm text-success">{message}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-error p-4">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary">
                New password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary">
                Confirm password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-premium"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full flex justify-center btn-primary"
            >
              {isLoading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/forgot-password" className="text-sm font-medium text-gold hover:underline">
              Request a new link
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
