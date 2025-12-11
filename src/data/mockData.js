export const userData = {
  name: 'Benjamin Jones',
  profileImage: '/profile.jpg',
};

export const accounts = [
  {
    id: 1,
    type: 'CURRENT',
    accountNumber: '11000102445',
    accountName: 'John David Smith',
    accountTitle: 'Primary Current Account',
    balance: 2935.5,
    availableBalance: 2935.5,
    currency: 'USD',
    color: 'orange',
    gradient: 'from-orange-400 to-primary/50',
    status: 'Active',
    openedDate: '2022-03-15',
    branch: 'Downtown Branch',
    interestRate: '0.5%',
    monthlyIncome: 3200.0,
    monthlyExpenses: 1850.75,
    transactions: [
      {
        id: 1,
        type: 'credit',
        description: 'Freelance Payment',
        amount: 1500.0,
        date: '2024-11-01',
        time: '10:30 AM',
        balance: 2935.5,
        status: 'completed',
        category: 'Income',
      },
      {
        id: 2,
        type: 'debit',
        description: 'Grocery Shopping',
        amount: 125.5,
        date: '2024-10-30',
        time: '03:45 PM',
        balance: 1435.5,
        status: 'completed',
        category: 'Shopping',
      },
      {
        id: 3,
        type: 'debit',
        description: 'Electric Bill',
        amount: 89.25,
        date: '2024-10-28',
        time: '09:15 AM',
        balance: 1561.0,
        status: 'completed',
        category: 'Utilities',
      },
      {
        id: 4,
        type: 'credit',
        description: 'Salary Deposit',
        amount: 2800.0,
        date: '2024-10-25',
        time: '08:00 AM',
        balance: 1650.25,
        status: 'completed',
        category: 'Salary',
      },
      {
        id: 5,
        type: 'debit',
        description: 'Online Shopping',
        amount: 245.0,
        date: '2024-10-22',
        time: '02:30 PM',
        balance: -1149.75,
        status: 'pending',
        category: 'Shopping',
      },
    ],
    statements: [
      { month: 'October 2024', transactions: 45, balance: 2935.5 },
      { month: 'September 2024', transactions: 38, balance: 2450.25 },
      { month: 'August 2024', transactions: 42, balance: 2100.0 },
    ],
  },
  {
    id: 2,
    type: 'SAVINGS',
    accountNumber: '21000160070',
    accountName: 'Sarah Michelle Johnson',
    accountTitle: 'Emergency Savings',
    balance: 3924.74,
    availableBalance: 3924.74,
    currency: 'USD',
    color: 'purple',
    gradient: 'from-purple-400 to-purple-500',
    status: 'Active',
    openedDate: '2021-06-20',
    branch: 'Main Branch',
    interestRate: '3.5%',
    monthlyIncome: 800.0,
    monthlyExpenses: 150.0,
    transactions: [
      {
        id: 1,
        type: 'credit',
        description: 'Monthly Savings',
        amount: 800.0,
        date: '2024-11-01',
        time: '12:00 PM',
        balance: 3924.74,
        status: 'completed',
        category: 'Savings',
      },
      {
        id: 2,
        type: 'credit',
        description: 'Interest Credit',
        amount: 11.5,
        date: '2024-10-31',
        time: '11:59 PM',
        balance: 3124.74,
        status: 'completed',
        category: 'Interest',
      },
      {
        id: 3,
        type: 'debit',
        description: 'Emergency Withdrawal',
        amount: 500.0,
        date: '2024-10-20',
        time: '04:20 PM',
        balance: 3113.24,
        status: 'completed',
        category: 'Withdrawal',
      },
      {
        id: 4,
        type: 'credit',
        description: 'Monthly Savings',
        amount: 800.0,
        date: '2024-10-01',
        time: '12:00 PM',
        balance: 3613.24,
        status: 'completed',
        category: 'Savings',
      },
    ],
    statements: [
      { month: 'October 2024', transactions: 15, balance: 3924.74 },
      { month: 'September 2024', transactions: 12, balance: 3113.24 },
      { month: 'August 2024', transactions: 14, balance: 2350.0 },
    ],
  },
  {
    id: 3,
    type: 'INVESTMENT',
    accountNumber: '21000160071',
    accountName: 'Robert William Chen',
    accountTitle: 'Growth Investment Portfolio',
    balance: 4374.28,
    availableBalance: 4374.28,
    currency: 'USD',
    color: 'teal',
    gradient: 'from-teal-400 to-teal-500',
    status: 'Active',
    openedDate: '2020-09-10',
    branch: 'Investment Center',
    interestRate: '7.2%',
    monthlyIncome: 350.0,
    monthlyExpenses: 50.0,
    transactions: [
      {
        id: 1,
        type: 'credit',
        description: 'Dividend Payment',
        amount: 125.5,
        date: '2024-11-01',
        time: '09:00 AM',
        balance: 4374.28,
        status: 'completed',
        category: 'Dividend',
      },
      {
        id: 2,
        type: 'credit',
        description: 'Capital Gains',
        amount: 450.0,
        date: '2024-10-28',
        time: '10:30 AM',
        balance: 4248.78,
        status: 'completed',
        category: 'Investment',
      },
      {
        id: 3,
        type: 'debit',
        description: 'Management Fee',
        amount: 25.0,
        date: '2024-10-25',
        time: '11:00 AM',
        balance: 3798.78,
        status: 'completed',
        category: 'Fee',
      },
      {
        id: 4,
        type: 'credit',
        description: 'Investment Contribution',
        amount: 500.0,
        date: '2024-10-15',
        time: '02:00 PM',
        balance: 3823.78,
        status: 'completed',
        category: 'Investment',
      },
    ],
    statements: [
      { month: 'October 2024', transactions: 22, balance: 4374.28 },
      { month: 'September 2024', transactions: 19, balance: 3798.78 },
      { month: 'August 2024', transactions: 25, balance: 3500.0 },
    ],
  },
  {
    id: 4,
    type: 'SAVINGS',
    accountNumber: '21000160072',
    accountName: 'Emily Patricia Rodriguez',
    accountTitle: 'Vacation Fund',
    balance: 2742.46,
    availableBalance: 2742.46,
    currency: 'USD',
    color: 'blue',
    gradient: 'from-blue-400 to-blue-500',
    status: 'Active',
    openedDate: '2023-01-05',
    branch: 'City Branch',
    interestRate: '2.8%',
    monthlyIncome: 400.0,
    monthlyExpenses: 100.0,
    transactions: [
      {
        id: 1,
        type: 'credit',
        description: 'Monthly Transfer',
        amount: 400.0,
        date: '2024-11-01',
        time: '08:30 AM',
        balance: 2742.46,
        status: 'completed',
        category: 'Transfer',
      },
      {
        id: 2,
        type: 'debit',
        description: 'Flight Booking',
        amount: 650.0,
        date: '2024-10-28',
        time: '01:15 PM',
        balance: 2342.46,
        status: 'completed',
        category: 'Travel',
      },
      {
        id: 3,
        type: 'credit',
        description: 'Interest Credit',
        amount: 6.5,
        date: '2024-10-31',
        time: '11:59 PM',
        balance: 2992.46,
        status: 'completed',
        category: 'Interest',
      },
      {
        id: 4,
        type: 'credit',
        description: 'Monthly Transfer',
        amount: 400.0,
        date: '2024-10-01',
        time: '08:30 AM',
        balance: 2985.96,
        status: 'completed',
        category: 'Transfer',
      },
    ],
    statements: [
      { month: 'October 2024', transactions: 18, balance: 2742.46 },
      { month: 'September 2024', transactions: 16, balance: 2985.96 },
      { month: 'August 2024', transactions: 15, balance: 2600.0 },
    ],
  },
];

// Helper function to get account by account number
export const getAccountByNumber = (accountNumber) => {
  return accounts.find((account) => account.accountNumber === accountNumber);
};

// Helper function to get all transactions for an account
export const getAccountTransactions = (accountNumber) => {
  const account = getAccountByNumber(accountNumber);
  return account ? account.transactions : [];
};

// Helper function to get statements for an account
export const getAccountStatements = (accountNumber) => {
  const account = getAccountByNumber(accountNumber);
  return account ? account.statements : [];
};

export const quickActions = [
  {
    id: 1,
    title: 'Transfer',
    description: 'Move money between accounts',
    icon: 'transfer',
    color: 'orange',
  },
  {
    id: 2,
    title: 'Pay Bill',
    description: 'Pay your bills online',
    icon: 'send',
    color: 'orange',
  },
  {
    id: 3,
    title: 'Pending',
    description: 'Current Pending Transactions',
    icon: 'pending',
    color: 'orange',
  },
  {
    id: 4,
    title: 'Quick Deposit',
    description: 'Deposit funds instantly',
    icon: 'add',
    color: 'orange',
  },
];

export const transactions = [
  {
    id: 1,
    description: 'Transfer between savings and current',
    category: 'Between my Accounts at Banco di Caribe',
    accountNumber: '**********112',
    date: '2024-09-10 11:45:32',
    amount: 500.0,
    type: 'credit',
  },
  {
    id: 2,
    description: 'Transfer to Banco main account',
    category: 'To Other Banco di Caribe Account',
    accountNumber: '**********667',
    date: '2024-09-11 14:32:19',
    amount: -300.0,
    type: 'debit',
  },
  {
    id: 3,
    description: 'Payment to local bank for invoice #4451',
    category: 'To Other Local Bank',
    accountNumber: '**********228',
    date: '2024-09-12 08:19:04',
    amount: -1500.0,
    type: 'debit',
  },
  {
    id: 4,
    description: 'Loan repayment - personal loan',
    category: 'Loan Payment',
    accountNumber: '**********904',
    date: '2024-09-13 16:22:44',
    amount: -2500.0,
    type: 'debit',
  },
  {
    id: 5,
    description: 'Send money to friend',
    category: 'Send Money',
    accountNumber: '**********339',
    date: '2024-09-14 10:11:10',
    amount: -750.0,
    type: 'debit',
  },
  {
    id: 6,
    description: 'Mobile Topup for number 017XXXXXXXX',
    category: 'Mobile Topup',
    accountNumber: '**********566',
    date: '2024-09-15 09:42:05',
    amount: -100.0,
    type: 'debit',
  },
  {
    id: 7,
    description: 'Interest received on savings account',
    category: 'Between my Accounts at Banco di Caribe',
    accountNumber: '**********776',
    date: '2024-09-15 20:25:14',
    amount: 120.0,
    type: 'credit',
  },
  {
    id: 8,
    description: 'Payment to local supplier',
    category: 'To Other Local Bank',
    accountNumber: '**********889',
    date: '2024-09-16 13:55:02',
    amount: -800.0,
    type: 'debit',
  },
  {
    id: 9,
    description: 'Salary received from employer',
    category: 'To Other Banco di Caribe Account',
    accountNumber: '**********122',
    date: '2024-09-17 18:03:58',
    amount: 25000.0,
    type: 'credit',
  },
  {
    id: 10,
    description: 'Loan interest refund',
    category: 'Loan Payment',
    accountNumber: '**********551',
    date: '2024-09-18 10:37:29',
    amount: 230.0,
    type: 'credit',
  },
  {
    id: 11,
    description: 'Online shopping refund',
    category: 'Send Money',
    accountNumber: '**********345',
    date: '2024-09-19 12:25:43',
    amount: 600.0,
    type: 'credit',
  },
  {
    id: 12,
    description: 'ATM withdrawal',
    category: 'Between my Accounts at Banco di Caribe',
    accountNumber: '**********458',
    date: '2024-09-19 14:40:02',
    amount: -3000.0,
    type: 'debit',
  },
  {
    id: 13,
    description: 'Mobile recharge bonus',
    category: 'Mobile Topup',
    accountNumber: '**********302',
    date: '2024-09-20 09:05:31',
    amount: 50.0,
    type: 'credit',
  },
  {
    id: 14,
    description: 'Fund transfer to vendor',
    category: 'To Other Local Bank',
    accountNumber: '**********234',
    date: '2024-09-21 17:11:42',
    amount: -1200.0,
    type: 'debit',
  },
  {
    id: 15,
    description: 'Received from customer',
    category: 'To Other Banco di Caribe Account',
    accountNumber: '**********911',
    date: '2024-09-21 19:55:12',
    amount: 820.0,
    type: 'credit',
  },
];

export const sidebarMenuItems = [
  {
    section: 'ACCOUNTS & OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'pieChart', active: true },
      { id: 'accounts', label: 'Accounts', icon: 'building' },
      { id: 'statements', label: 'Statements', icon: 'document' },
      { id: 'documents', label: 'Documents & Forms', icon: 'documentText' },
    ],
  },
  {
    section: 'PAYMENTS & TRANSFERS',
    items: [
      {
        id: 'transfers',
        label: 'Transfers',
        icon: 'transfer',
        submenu: [
          {
            id: 'transfers/transfer-between-own-acccounts',
            label: 'Between my Accounts At Moadbus Bank',
          },
          {
            id: 'transfers/transfer-between-own-bank',
            label: 'Transfer to Other Moadbus Bank Account',
          },
          { id: 'transfers/transfer-between-local-bank', label: 'Transfer to Other Local Bank' },
          { id: 'transfers/transfers-history', label: 'Transfer History' },
          { id: 'transfers/schedule-transfers', label: 'Scheduled Transfers' },
          { id: 'transfers/manage-payees', label: 'Manage Payees' },
        ],
      },
      {
        id: 'bill-payments',
        label: 'Bill Payments',
        icon: 'send',
        submenu: [
          { id: 'bill-payments-pay', label: 'Pay Bills' },
          {
            id: 'bill-payments-scheduled',
            label: 'Manage Scheduled Bill Payments',
          },
          { id: 'bill-payments-billers', label: 'Manage Billers' },
          { id: 'bill-payments-history', label: 'Payment History' },
        ],
      },
      {
        id: 'p2p-payments',
        label: 'P2P Payments',
        icon: 'users',
        submenu: [
          { id: 'p2p-send', label: 'Send Money' },
          { id: 'p2p-receive', label: 'Receive Money' },
        ],
      },
      {
        id: 'mobile-topup',
        label: 'Mobile Top-Up',
        icon: 'mobile',
        submenu: [
          { id: 'mobile-recharge', label: 'Recharge Mobile' },
          { id: 'mobile-manage', label: 'Manage Numbers' },
        ],
      },
      // { id: 'support', label: 'Support', icon: 'support' },
      { id: 'secure-messages', label: 'Secure Messages', icon: 'message' },
      { id: 'find-branch', label: 'Find Branch/ATM', icon: 'location' },
      { id: 'appointments', label: 'Appointments', icon: 'calendar' },
      { id: 'secure-upload', label: 'Secure Upload', icon: 'upload' },
      { id: 'contact-us', label: 'Contact Us', icon: 'mail' },
    ],
  },
  {
    section: 'SETTINGS',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        submenu: [{ id: 'profile', label: 'Personal Information' }],
      },
      {
        id: 'security',
        label: 'Security',
        icon: 'lock',
        submenu: [
          { id: 'security-password', label: 'Change Password' },
          { id: 'security-questions', label: 'Security Questions' },
          { id: 'security-history', label: 'Session History' },
          { id: 'security-fraud', label: 'Report Fraud' },
        ],
      },
      { id: 'theme', label: 'Themes', icon: 'palette' },
    ],
  },
  {
    section: 'Message and Notification',
    items: [{ id: 'notification', label: 'Notification', icon: 'notification' }],
  },
  // {
  //   section: 'Demo Modal',
  //   items: [{ id: 'modal', label: 'Modal', icon: 'user' }],
  // },
];

// Account Statements Data
export const accountStatements = {
  11000102445: [
    // Current Account
    // 2024
    {
      month: 'October 2024',
      year: '2024',
      date: '2024-10-31',
      pdfUrl: '/statements/11000102445-oct-2024.pdf',
    },
    {
      month: 'September 2024',
      year: '2024',
      date: '2024-09-30',
      pdfUrl: '/statements/11000102445-sep-2024.pdf',
    },
    {
      month: 'August 2024',
      year: '2024',
      date: '2024-08-31',
      pdfUrl: '/statements/11000102445-aug-2024.pdf',
    },
    // 2023
    {
      month: 'December 2023',
      year: '2023',
      date: '2023-12-31',
      pdfUrl: '/statements/11000102445-dec-2023.pdf',
    },
    {
      month: 'November 2023',
      year: '2023',
      date: '2023-11-30',
      pdfUrl: '/statements/11000102445-nov-2023.pdf',
    },
    // 2022
    {
      month: 'June 2022',
      year: '2022',
      date: '2022-06-30',
      pdfUrl: '/statements/11000102445-jun-2022.pdf',
    },
  ],

  21000160070: [
    // Savings Account 1
    // 2024
    {
      month: 'October 2024',
      year: '2024',
      date: '2024-10-31',
      pdfUrl: '/statements/21000160070-oct-2024.pdf',
    },
    {
      month: 'September 2024',
      year: '2024',
      date: '2024-09-30',
      pdfUrl: '/statements/21000160070-sep-2024.pdf',
    },
    // 2023
    {
      month: 'December 2023',
      year: '2023',
      date: '2023-12-31',
      pdfUrl: '/statements/21000160070-dec-2023.pdf',
    },
    {
      month: 'November 2023',
      year: '2023',
      date: '2023-11-30',
      pdfUrl: '/statements/21000160070-nov-2023.pdf',
    },
    // 2022
    {
      month: 'May 2022',
      year: '2022',
      date: '2022-05-31',
      pdfUrl: '/statements/21000160070-may-2022.pdf',
    },
  ],

  21000160071: [
    // Investment Account
    // 2024
    {
      month: 'October 2024',
      year: '2024',
      date: '2024-10-31',
      pdfUrl: '/statements/21000160071-oct-2024.pdf',
    },
    {
      month: 'September 2024',
      year: '2024',
      date: '2024-09-30',
      pdfUrl: '/statements/21000160071-sep-2024.pdf',
    },
    {
      month: 'July 2024',
      year: '2024',
      date: '2024-07-31',
      pdfUrl: '/statements/21000160071-jul-2024.pdf',
    },
    // 2023
    {
      month: 'March 2023',
      year: '2023',
      date: '2023-03-31',
      pdfUrl: '/statements/21000160071-mar-2023.pdf',
    },
    {
      month: 'January 2023',
      year: '2023',
      date: '2023-01-31',
      pdfUrl: '/statements/21000160071-jan-2023.pdf',
    },
    // 2022
    {
      month: 'June 2022',
      year: '2022',
      date: '2022-06-30',
      pdfUrl: '/statements/21000160071-jun-2022.pdf',
    },
  ],

  21000160072: [
    // Savings Account 2
    // 2024
    {
      month: 'October 2024',
      year: '2024',
      date: '2024-10-31',
      pdfUrl: '/statements/21000160072-oct-2024.pdf',
    },
    {
      month: 'September 2024',
      year: '2024',
      date: '2024-09-30',
      pdfUrl: '/statements/21000160072-sep-2024.pdf',
    },
    // 2023
    {
      month: 'December 2023',
      year: '2023',
      date: '2023-12-31',
      pdfUrl: '/statements/21000160072-dec-2023.pdf',
    },
    {
      month: 'October 2023',
      year: '2023',
      date: '2023-10-31',
      pdfUrl: '/statements/21000160072-oct-2023.pdf',
    },
    // 2022
    {
      month: 'April 2022',
      year: '2022',
      date: '2022-04-30',
      pdfUrl: '/statements/21000160072-apr-2022.pdf',
    },
  ],
};

// Helper function to get statements by account and year
export const getStatementsByAccount = (accountNumber, year = null) => {
  const statements = accountStatements[accountNumber] || [];
  if (year) {
    return statements.filter((statement) => statement.year === year);
  }
  return statements;
};
