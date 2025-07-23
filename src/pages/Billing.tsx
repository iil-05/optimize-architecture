import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Crown,
  Star,
  Zap,
  Check,
  X,
  Download,
  Calendar,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Coins,
  Gift,
  History,
  Receipt,
} from 'lucide-react';
import { optimizedStorage } from '../utils/optimizedStorage';
import CommonHeader from '../components/CommonHeader';

interface PaymentHistory {
  id: string;
  date: Date;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  invoice?: string;
}

interface CoinTransaction {
  id: string;
  date: Date;
  amount: number;
  type: 'purchase' | 'usage' | 'bonus';
  description: string;
  balance: number;
}

const Billing: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'coins'>('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedCoinPackage, setSelectedCoinPackage] = useState<string>('');

  // Load user subscription data
  const userSubscription = optimizedStorage.getUserSubscription();
  const currentPlan = userSubscription?.plan || 'free';

  // Mock data - in a real app, this would come from your backend
  const [coinBalance] = useState(150);
  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      date: new Date('2024-01-15'),
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'completed',
      invoice: 'INV-001'
    },
    {
      id: '2',
      date: new Date('2023-12-15'),
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'completed',
      invoice: 'INV-002'
    },
    {
      id: '3',
      date: new Date('2023-11-15'),
      amount: 29.99,
      description: 'Pro Plan - Monthly',
      status: 'completed',
      invoice: 'INV-003'
    },
  ]);

  const [coinHistory] = useState<CoinTransaction[]>([
    {
      id: '1',
      date: new Date('2024-01-20'),
      amount: 100,
      type: 'purchase',
      description: 'Coin Package - Standard',
      balance: 150
    },
    {
      id: '2',
      date: new Date('2024-01-18'),
      amount: -25,
      type: 'usage',
      description: 'AI Assistant Usage',
      balance: 50
    },
    {
      id: '3',
      date: new Date('2024-01-15'),
      amount: 50,
      type: 'bonus',
      description: 'Welcome Bonus',
      balance: 75
    },
  ]);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Star,
      color: 'gray',
      features: [
        '3 Projects',
        '50 Sections per project',
        'Basic templates',
        'HTML export',
        'Community support'
      ],
      limitations: [
        'No custom domain',
        'Templates.uz branding',
        'Limited storage (100MB)'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      period: 'month',
      icon: Zap,
      color: 'blue',
      popular: true,
      features: [
        'Unlimited projects',
        'Unlimited sections',
        'Premium templates',
        'Custom domain',
        'Remove branding',
        'Priority support',
        'Advanced analytics',
        '1GB storage'
      ],
      limitations: []
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      period: 'month',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'White-label solution',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
        '10GB storage'
      ],
      limitations: []
    }
  ];

  const coinPackages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      coins: 50,
      price: 9.99,
      bonus: 0,
      popular: false
    },
    {
      id: 'standard',
      name: 'Standard Pack',
      coins: 100,
      price: 19.99,
      bonus: 10,
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      coins: 250,
      price: 49.99,
      bonus: 50,
      popular: false
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      coins: 500,
      price: 99.99,
      bonus: 150,
      popular: false
    }
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const handlePurchaseCoins = (packageId: string) => {
    setSelectedCoinPackage(packageId);
    setShowCoinModal(true);
  };

  const confirmUpgrade = () => {
    // In a real app, this would process the payment
    toast.info(`Upgrading to ${selectedPlan} plan...`);
    setShowUpgradeModal(false);
  };

  const confirmCoinPurchase = () => {
    // In a real app, this would process the payment
    toast.info(`Purchasing ${selectedCoinPackage} coin package...`);
    setShowCoinModal(false);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
      completed: CheckCircle,
      pending: Clock,
      failed: AlertCircle,
    };

    const IconComponent = icons[status as keyof typeof icons];

    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${colors[status as keyof typeof colors]}`}>
        <IconComponent className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const getCoinTypeIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'usage':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'bonus':
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <CommonHeader />

      {/* Page Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 font-heading">{t('billing.title')}</h1>
                <p className="text-gray-600 font-primary">{t('billing.subtitle')}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-xl border border-yellow-200">
                <Coins className="w-4 h-4" />
                <span className="font-medium font-primary">{coinBalance} coins</span>
              </div>
              <button
                onClick={() => handlePurchaseCoins('standard')}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium font-primary"
              >
                Buy Coins
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'history', label: 'Payment History', icon: History },
            { id: 'coins', label: 'Coin Transactions', icon: Coins },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === id
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-primary">{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Current Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 font-heading">Current Plan</h2>
                <div className="flex items-center gap-2">
                  {currentPlan === 'pro' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                  <span className="text-sm text-gray-600 font-primary">
                    {currentPlan === 'free' ? 'Free Plan' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentPlan === 'free' ? 'bg-gray-100' :
                        currentPlan === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                      {currentPlan === 'free' ? <Star className="w-6 h-6 text-gray-600" /> :
                        currentPlan === 'pro' ? <Zap className="w-6 h-6 text-blue-600" /> :
                          <Crown className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 font-heading">
                        {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
                      </h3>
                      <p className="text-gray-600 font-primary">
                        {currentPlan === 'free' ? 'Free forever' :
                          currentPlan === 'pro' ? '$29.99/month' : '$99.99/month'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 font-heading">
                        {optimizedStorage.getAllProjects().length}
                      </div>
                      <div className="text-sm text-gray-600 font-primary">{t('billing.overview.projectsUsed')}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 font-heading">
                        {optimizedStorage.getAllProjects().reduce((total, project) => total + project.sections.length, 0)}
                      </div>
                      <div className="text-sm text-gray-600 font-primary">{t('billing.overview.totalSections')}</div>
                    </div>
                  </div>

                  {currentPlan !== 'enterprise' && (
                    <button
                      onClick={() => handleUpgrade(currentPlan === 'free' ? 'pro' : 'enterprise')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg font-heading"
                    >
                      {currentPlan === 'free' ? t('billing.overview.upgradeToPro') : t('billing.overview.upgradeToEnterprise')}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-900 font-primary">Coin Balance</span>
                    </div>
                    <div className="text-2xl font-bold text-red-900 font-heading">{coinBalance}</div>
                    <button
                      onClick={() => setShowCoinModal(true)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium font-primary"
                    >
                      {t('billing.overview.buyMoreCoins')} →
                    </button>
                  </div>

                  {currentPlan !== 'free' && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900 font-primary">{t('billing.overview.nextBilling')}</span>
                      </div>
                      <div className="text-sm text-green-700 font-primary">{t('billing.overview.nextBillingDate')}</div>
                      <div className="text-lg font-bold text-green-900 font-heading">
                        ${currentPlan === 'pro' ? '29.99' : '99.99'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Available Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 font-heading">Available Plans</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const IconComponent = plan.icon;
                  const isCurrentPlan = currentPlan === plan.id;

                  return (
                    <div
                      key={plan.id}
                      className={`relative p-6 rounded-2xl border-2 transition-all ${isCurrentPlan
                          ? 'border-primary-500 bg-primary-50'
                          : plan.popular
                            ? 'border-primary-400 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold font-primary">
                            Most Popular
                          </div>
                        </div>
                      )}

                      {isCurrentPlan && (
                        <div className="absolute -top-3 right-4">
                          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold font-primary">
                            Current Plan
                          </div>
                        </div>
                      )}

                      <div className="text-center mb-6">
                        <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${plan.color === 'gray' ? 'bg-gray-100' :
                            plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                          <IconComponent className={`w-6 h-6 ${plan.color === 'gray' ? 'text-gray-600' :
                              plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                            }`} />
                        </div>
                        <h3 className="text-xl font-bold text-secondary-900 mb-2 font-heading">{plan.name}</h3>
                        <div className="text-3xl font-bold text-secondary-900 font-heading">
                          ${plan.price}
                          <span className="text-base font-normal text-gray-600 font-primary">
                            /{plan.period}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 font-primary">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm text-gray-500 font-primary">{limitation}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => !isCurrentPlan && handleUpgrade(plan.id)}
                        disabled={isCurrentPlan}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${isCurrentPlan
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : plan.popular
                              ? 'bg-primary-500 text-white hover:bg-primary-600'
                              : 'bg-primary-500 text-white hover:bg-primary-600'
                          } font-heading`}
                      >
                        {isCurrentPlan ? t('billing.plans.currentPlan') : t('billing.plans.upgradeTo', { plan: plan.name })}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 font-heading">{t('billing.history.title')}</h2>
                <button className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors font-medium font-primary">
                  <Download className="w-4 h-4" />
                  {t('billing.history.export')}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">{t('billing.history.date')}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">{t('billing.history.description')}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">{t('billing.history.amount')}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">{t('billing.history.status')}</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 font-primary">{t('billing.history.invoice')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-primary">
                        {payment.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-primary">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 font-primary">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        {payment.invoice && (
                          <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium font-primary">
                            <Receipt className="w-4 h-4" />
                            {payment.invoice}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paymentHistory.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{t('billing.history.noHistory')}</h3>
                <p className="text-gray-600 font-primary">{t('billing.history.noHistoryDesc')}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Coin Transactions Tab */}
        {activeTab === 'coins' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Coin Balance Card */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2 font-heading">{t('billing.coins.balance')}</h2>
                  <div className="text-4xl font-bold font-heading">{coinBalance}</div>
                  <p className="text-yellow-100 font-primary">{t('billing.coins.description')}</p>
                </div>
                <div className="text-right">
                  <Coins className="w-16 h-16 text-yellow-200 mb-4" />
                  <button
                    onClick={() => setShowCoinModal(true)}
                    className="px-6 py-3 bg-white text-yellow-600 rounded-xl hover:bg-yellow-50 transition-colors font-semibold font-heading"
                  >
                    {t('billing.coins.buyMore')}
                  </button>
                </div>
              </div>
            </div>

            {/* Coin Packages */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 font-heading">{t('billing.coins.packages')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {coinPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${pkg.popular
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                    onClick={() => handlePurchaseCoins(pkg.id)}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold font-primary">
                          Best Value
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1 font-heading">
                        {pkg.coins + pkg.bonus}
                      </div>
                      <div className="text-sm text-gray-600 mb-2 font-primary">
                        {pkg.coins} + {pkg.bonus} {t('billing.coins.bonus')}
                      </div>
                      <div className="text-lg font-semibold text-gray-900 mb-3 font-heading">
                        ${pkg.price}
                      </div>
                      <div className="text-xs text-gray-500 font-primary">
                        ${(pkg.price / (pkg.coins + pkg.bonus)).toFixed(3)} {t('billing.coins.perCoin')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 font-heading">{t('billing.coins.transactionHistory')}</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {coinHistory.map((transaction) => (
                  <div key={transaction.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        {getCoinTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 font-primary">{transaction.description}</div>
                        <div className="text-sm text-gray-600 font-primary">
                          {transaction.date.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold font-primary ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} {t('billing.coins.coins')}
                      </div>
                      <div className="text-sm text-gray-600 font-primary">
                        {t('billing.coins.balance')}: {transaction.balance}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {coinHistory.length === 0 && (
                <div className="text-center py-12">
                  <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{t('billing.coins.noTransactions')}</h3>
                  <p className="text-gray-600 font-primary">{t('billing.coins.noTransactionsDesc')}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2 font-heading">{t('billing.modals.upgradePlan')}</h3>
              <p className="text-secondary-600 font-primary">
                {t('billing.modals.upgradeDescription', { plan: selectedPlan })}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmUpgrade}
                className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium font-primary"
              >
                {t('billing.modals.upgradeNow')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Coin Purchase Modal */}
      {showCoinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">{t('billing.modals.purchaseCoins')}</h3>
              <p className="text-gray-600 font-primary">
                {t('billing.modals.purchaseCoinsDesc')}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {coinPackages.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedCoinPackage(pkg.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedCoinPackage === pkg.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900 font-primary">{pkg.name}</div>
                      <div className="text-sm text-gray-600 font-primary">
                        {pkg.coins} {t('billing.coins.coins')} + {pkg.bonus} {t('billing.coins.bonus')}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-900 font-heading">
                      ${pkg.price}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCoinModal(false)}
                className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium font-primary"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmCoinPurchase}
                disabled={!selectedCoinPackage}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 font-primary"
              >
                {t('billing.modals.purchase')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Billing;