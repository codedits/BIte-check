'use client';'use client';



import { useState } from 'react';import { useState } from 'react';

import { motion } from 'framer-motion';import { motion } from 'framer-motion';

import { FaEye, FaEyeSlash } from 'react-icons/fa';import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useAuth } from '@/contexts/AuthContext';import { useAuth } from '@/contexts/AuthContext';

import { signIn } from 'next-auth/react';import { signIn } from 'next-auth/react';

import { useRouter } from 'next/navigation';import { useRouter } from 'next/navigation';

import Link from 'next/link';import Link from 'next/link';



export default function SignUpPage() {export default function SignUpPage() {

  const [email, setEmail] = useState('');  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setLoading] = useState(false);  const [loading, setLoading] = useState(false);

    

  const { signup } = useAuth();  const { signup } = useAuth();

  const router = useRouter();  const router = useRouter();



  const handleSubmit = async (e) => {  const handleSubmit = async (e) => {

    e.preventDefault();    e.preventDefault();

    setErrorMessage('');    setErrorMessage('');



    if (password !== confirmPassword) {    if (password !== confirmPassword) {

      setErrorMessage('Passwords do not match');      setErrorMessage('Passwords do not match');

      return;      return;

    }    }



    if (password.length < 6) {    if (password.length < 6) {

      setErrorMessage('Password must be at least 6 characters long');      setErrorMessage('Password must be at least 6 characters long');

      return;      return;

    }    }



    setLoading(true);    setLoading(true);



    try {    try {

      const result = await signup(email, password);      const result = await signup(email, password);

            

      if (result.success) {      if (result.success) {

        router.push('/');        router.push('/');

      } else {      } else {

        setErrorMessage(result.error);        setErrorMessage(result.error);

      }      }

    } catch {    } catch {

      setErrorMessage('An unexpected error occurred');      setErrorMessage('An unexpected error occurred');

    } finally {    } finally {

      setLoading(false);      setLoading(false);

    }    }

  };  };



  const handleGoogleSignIn = async () => {  const handleGoogleSignIn = async () => {

    try {    try {

      setLoading(true);      setLoading(true);

      await signIn('google', { callbackUrl: '/' });      await signIn('google', { callbackUrl: '/' });

    } catch {    } catch {

      setErrorMessage('Google sign-in failed');      setErrorMessage('Google sign-in failed');

      setLoading(false);      setLoading(false);

    }    }

  };  };



  return (  return (

    <div className="min-h-screen bg-white flex items-center justify-center p-4">    <div className="min-h-screen bg-white flex items-center justify-center p-4">

      <div className="w-full max-w-md">      <div className="w-full max-w-md">

        <motion.div        <motion.div

          initial={{ opacity: 0, y: 20 }}          initial={{ opacity: 0, y: 20 }}

          animate={{ opacity: 1, y: 0 }}          animate={{ opacity: 1, y: 0 }}

          transition={{ duration: 0.5 }}          transition={{ duration: 0.5 }}

          className="space-y-8"          className="space-y-8"

        >        >

          <div className="text-center">          {/* Brand */}

            <Link href="/">          <div className="text-center">

              <h1 className="text-3xl font-bold text-gray-900 mb-2">BiteCheck</h1>            <Link href="/">

            </Link>              <h1 className="text-3xl font-bold text-gray-900 mb-2">

            <p className="text-sm text-gray-600">Create your account</p>                BiteCheck

          </div>              </h1>

            </Link>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">            <p className="text-sm text-gray-600">Create your account</p>

            <form onSubmit={handleSubmit} className="space-y-4">          </div>

              <button

                type="button"          {/* Form Card */}

                onClick={handleGoogleSignIn}          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">

                disabled={loading}            <form onSubmit={handleSubmit} className="space-y-4">

                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"              {/* Google Sign Up Button */}

              >              <button

                <svg className="h-5 w-5" viewBox="0 0 24 24">                type="button"

                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">                onClick={handleGoogleSignIn}

                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>                disabled={loading}

                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>              >

                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>                <svg className="h-5 w-5" viewBox="0 0 24 24">

                  </g>                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">

                </svg>                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>

                <span className="text-sm font-medium text-gray-700">Continue with Google</span>                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>

              </button>                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>

                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>

              <div className="relative my-6">                  </g>

                <div className="absolute inset-0 flex items-center">                </svg>

                  <div className="w-full border-t border-gray-200"></div>                <span className="text-sm font-medium text-gray-700">Continue with Google</span>

                </div>              </button>

                <div className="relative flex justify-center text-xs">

                  <span className="bg-white px-2 text-gray-500">or</span>              {/* Divider */}

                </div>              <div className="relative my-6">

              </div>                <div className="absolute inset-0 flex items-center">

                  <div className="w-full border-t border-gray-200"></div>

              <div>                </div>

                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">                <div className="relative flex justify-center text-xs">

                  Email                  <span className="bg-white px-2 text-gray-500">or</span>

                </label>                </div>

                <input              </div>

                  id="email"

                  type="email"              {/* Email */}

                  value={email}              <div>

                  onChange={(e) => setEmail(e.target.value)}                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">

                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"                  Email

                  placeholder="you@example.com"                </label>

                  autoComplete="email"                <input

                  required                  id="email"

                />                  type="email"

              </div>                  value={email}

                  onChange={(e) => setEmail(e.target.value)}

              <div>                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"

                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">                  placeholder="you@example.com"

                  Password                  autoComplete="email"

                </label>                  required

                <div className="relative">                />

                  <input              </div>

                    id="password"

                    type={showPassword ? 'text' : 'password'}              {/* Password */}

                    value={password}              <div>

                    onChange={(e) => setPassword(e.target.value)}                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">

                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"                  Password

                    placeholder="••••••••"                </label>

                    autoComplete="new-password"                <div className="relative">

                    required                  <input

                  />                    id="password"

                  <button                    type={showPassword ? 'text' : 'password'}

                    type="button"                    value={password}

                    onClick={() => setShowPassword(!showPassword)}                    onChange={(e) => setPassword(e.target.value)}

                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"

                  >                    placeholder="••••••••"

                    {showPassword ? <FaEyeSlash /> : <FaEye />}                    autoComplete="new-password"

                  </button>                    required

                </div>                  />

              </div>                  <button

                    type="button"

              <div>                    onClick={() => setShowPassword(!showPassword)}

                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"

                  Confirm password                  >

                </label>                    {showPassword ? <FaEyeSlash /> : <FaEye />}

                <div className="relative">                  </button>

                  <input                </div>

                    id="confirmPassword"              </div>

                    type={showConfirmPassword ? 'text' : 'password'}

                    value={confirmPassword}              {/* Confirm Password */}

                    onChange={(e) => setConfirmPassword(e.target.value)}              <div>

                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">

                    placeholder="••••••••"                  Confirm password

                    autoComplete="new-password"                </label>

                    required                <div className="relative">

                  />                  <input

                  <button                    id="confirmPassword"

                    type="button"                    type={showConfirmPassword ? 'text' : 'password'}

                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}                    value={confirmPassword}

                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"                    onChange={(e) => setConfirmPassword(e.target.value)}

                  >                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow"

                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}                    placeholder="••••••••"

                  </button>                    autoComplete="new-password"

                </div>                    required

              </div>                  />

                  <button

              {errorMessage && (                    type="button"

                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}

                  {errorMessage}                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"

                </div>                  >

              )}                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}

                  </button>

              <button                </div>

                type="submit"              </div>

                disabled={loading}

                className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"              {errorMessage && (

              >                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">

                {loading ? (                  {errorMessage}

                  <span className="flex items-center justify-center gap-2">                </div>

                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>              )}

                    Creating account...

                  </span>              <button

                ) : (                type="submit"

                  'Create account'                disabled={loading}

                )}                className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"

              </button>              >

                {loading ? (

              <p className="text-center text-sm text-gray-600">                  <span className="flex items-center justify-center gap-2">

                Already have an account?{' '}                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>

                <Link href="/auth/signin" className="text-orange-500 hover:text-orange-600 font-medium">                    Creating account...

                  Sign in                  </span>

                </Link>                ) : (

              </p>                  'Create account'

            </form>                )}

          </div>              </button>

        </motion.div>

      </div>              <p className="text-center text-sm text-gray-600">

    </div>                Already have an account?{' '}

  );                <Link href="/auth/signin" className="text-orange-500 hover:text-orange-600 font-medium">

}                  Sign in

                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
