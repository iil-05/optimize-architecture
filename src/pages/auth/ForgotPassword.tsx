import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword: React.FC = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 2000);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden font-sans">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-primary-400/15 to-primary-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r from-primary-400/10 to-primary-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-4 sm:left-10 w-3 sm:w-4 h-3 sm:h-4 bg-primary-500 rounded-full animate-float opacity-60"></div>
                    <div className="absolute top-40 right-10 sm:right-20 w-4 sm:w-6 h-4 sm:h-6 bg-primary-500 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-40 left-10 sm:left-20 w-2 sm:w-3 h-2 sm:h-3 bg-primary-500 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-20 right-4 sm:right-10 w-3 sm:w-5 h-3 sm:h-5 bg-primary-500 rounded-full animate-float opacity-30" style={{ animationDelay: '3s' }}></div>
                </div>

                {/* Back to Login Button */}
                <Link
                    to="/login"
                    className="absolute top-6 left-6 z-20 group inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                    {t('auth.forgotPassword.backToLogin')}
                </Link>

                {/* Success Message */}
                <div className="relative z-10 w-full max-w-md mx-auto px-6">
                    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-3xl p-8 shadow-elegant-lg animate-fade-in-up text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-glow">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 font-display">
                            {t('auth.forgotPassword.checkEmail')}
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {t('auth.forgotPassword.emailSent')} <strong>{email}</strong>.
                            {t('auth.forgotPassword.checkInbox')}
                        </p>

                        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-primary-800">
                                <strong>{t('auth.forgotPassword.didntReceive')}</strong> {t('auth.forgotPassword.checkSpam')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    setIsSubmitted(false);
                                    setEmail('');
                                }}
                                className="w-full py-3 px-4 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors duration-300 font-display"
                            >
                                {t('auth.forgotPassword.sendAnother')}
                            </button>

                            <Link
                                to="/login"
                                className="block w-full py-3 px-4 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors duration-300 font-display"
                            >
                                {t('auth.forgotPassword.backToLogin')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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

            {/* Back to Login Button */}
            <Link
                to="/login"
                className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20 group inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-primary-600 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg sm:rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
            >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" />
                {t('auth.forgotPassword.backToLogin')}
            </Link>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md mx-auto">
                <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-elegant-lg animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow">
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2 font-display">
                            {t('auth.forgotPassword.title')}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600">
                            {t('auth.forgotPassword.subtitle')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700">
                                {t('auth.forgotPassword.email')}
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                                    placeholder={t('auth.forgotPassword.email')}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-base sm:text-lg font-bold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg sm:rounded-xl shadow-glow hover:shadow-glow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform hover:scale-105 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-display"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isLoading ? (
                                <div className="relative z-10 flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t('auth.forgotPassword.sending')}
                                </div>
                            ) : (
                                <span className="relative z-10">{t('auth.forgotPassword.sendResetLink')}</span>
                            )}
                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 sm:mt-8">
                        <div className="bg-primary-50 border border-primary-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                            <div className="flex items-start">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-semibold text-primary-800 mb-1">{t('auth.forgotPassword.securityNotice')}</h4>
                                    <p className="text-xs text-primary-700">
                                        {t('auth.forgotPassword.linkExpires')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-sm sm:text-base text-gray-600">
                            {t('auth.forgotPassword.rememberPassword')}{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-300"
                            >
                                {t('auth.login.signInHere')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;