import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading } = useAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    useEffect(() => {
        // Check if user is already authenticated
        if (isAuthenticated) {
            console.log('✅ User already authenticated, redirecting to dashboard');
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        setLoading(true);
        const success = await login({
            email: formData.email,
            password: formData.password,
            remember: formData.rememberMe,
        });
        
        if (success) {
            navigate('/dashboard');
        } else {
            // Error handling is done in the useAuth hook via toast
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden font-sans px-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-60 lg:w-80 h-40 sm:h-60 lg:h-80 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-tr from-primary-400/15 to-primary-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-primary-400/10 to-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 sm:top-20 left-2 sm:left-4 lg:left-10 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-primary-500 rounded-full animate-float opacity-60"></div>
                <div className="absolute top-20 sm:top-40 right-5 sm:right-10 lg:right-20 w-3 sm:w-4 lg:w-6 h-3 sm:h-4 lg:h-6 bg-primary-500 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 sm:bottom-40 left-5 sm:left-10 lg:left-20 w-2 sm:w-3 h-2 sm:h-3 bg-primary-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-10 sm:bottom-20 right-2 sm:right-4 lg:right-10 w-2 sm:w-3 lg:w-5 h-2 sm:h-3 lg:h-5 bg-primary-500 rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 group inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary-600 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
            >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                {t('auth.login.backToHome')}
            </Link>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-elegant-lg animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow">
                            <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 font-display">
                            {t('auth.login.title')}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">{t('auth.login.subtitle')}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700">
                                {t('auth.login.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                    placeholder={t('auth.login.email')}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700">
                                {t('auth.login.password')}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                    placeholder={t('auth.login.password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-2.5 sm:pr-3 flex items-center hover:text-primary-600 transition-colors duration-300"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-3 w-3 sm:h-4 sm:w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-300"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                    {t('auth.login.rememberMe')}
                                </label>
                            </div>
                            <Link
                                to="/forgot-password"
                                className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-300"
                            >
                                {t('auth.login.forgotPassword')}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-base sm:text-lg font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg sm:rounded-xl shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105 transition-all duration-300 overflow-hidden font-display"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isLoading ? (
                                <div className="relative z-10 flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                <span className="relative z-10">{t('auth.login.signIn')}</span>
                            )}
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            {t('auth.login.noAccount')}{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300"
                            >
                                {t('auth.login.signUpHere')}
                            </Link>
                        </p>
                    </div>

                    {/* Social Login */}
                    <div className="mt-4 sm:mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 sm:px-4 bg-white text-gray-500 text-xs sm:text-sm">{t('auth.login.orContinueWith')}</span>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
                            <button className="group relative inline-flex w-full justify-center rounded-lg sm:rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 shadow-elegant hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                <span className="ml-1 sm:ml-2 hidden sm:inline">{t('auth.login.google')}</span>
                            </button>

                            <button className="group relative inline-flex w-full justify-center rounded-lg sm:rounded-xl border border-gray-300 bg-white/50 backdrop-blur-sm py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 shadow-elegant hover:bg-gray-50 transition-all duration-300 hover:scale-105">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="ml-1 sm:ml-2 hidden sm:inline">{t('auth.login.facebook')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;