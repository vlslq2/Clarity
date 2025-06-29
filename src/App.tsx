import React, { useState } from 'react';
import AuthWrapper from './components/AuthWrapper';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import Calendar from './pages/Calendar';
import RecurringPayments from './pages/RecurringPayments';
import Reports from './pages/Reports';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'categories':
        return <Categories />;
      case 'calendar':
        return <Calendar />;
      case 'recurring':
        return <RecurringPayments />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthWrapper>
      <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </Layout>
    </AuthWrapper>
  );
}

export default App;