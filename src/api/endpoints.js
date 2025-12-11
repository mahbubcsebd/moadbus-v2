import { generatedRoi, globals } from '@/globals/appGlobals';
import { post, postFile } from './api';

// -------------------------------------------------------
// API Endpoints
// -------------------------------------------------------
export const welcomeApi = async (payload = {}) => post('/welcome', payload);

export async function getLangPack(payload) {
  const defaultParams = {
    fg: '0',
    code: '1',
    roi: undefined,
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/getLangPack', finalPayload);
}

// Authenticate/Login
export async function authenticateUser(payload) {
  const defaultParams = {
    fg: '0',
    code: '1',
    roi: undefined,
    respType: 'json',
    sendUserID: '0',
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/authenticate', finalPayload);
}

// Generate OTP
export async function generateOTP(payload) {
  const defaultParams = {
    roi: generatedRoi,
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/gerateOTP', finalPayload);
}

// Verify OTP
export async function verifyOTP(payload) {
  const defaultParams = {
    roi: generatedRoi,
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/verifyOTP', finalPayload);
}

export const forgotPassword = async (payload) => post('/fetchOnlineId', payload);
export const forgotUserID = async (payload) => post('/findLoginId', payload);

// Device Activation
export async function validateUser(payload) {
  const defaultParams = {
    fp: '0',
    respType: 'json',
    accType: '1',
    action: '1',
    otp: '000000',
    roi: undefined,
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/validateCustomer', finalPayload);
}

// Activate User
export async function activateUser(payload) {
  const defaultParams = {
    respType: 'json',
    roi: undefined,
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/activateUser', finalPayload);
}

// Enroll/Register Personal User
export async function enrollPersonalUser(payload) {
  const defaultParams = {
    fp: '0',
    respType: 'json',
    accType: '1',
    custType: '1',
    otp: 'NO_OTP',
    roi: undefined,
    zipCode: '80001',
    theme: '0',
  };
  const finalPayload = { ...defaultParams, ...payload };

  return post('/enrollUser', finalPayload);
}

export const getAuthAccounts = async () => post('/getAuthAccounts', {});

// Log out
export async function logout(payload = {}) {
  const defaultParams = {
    roi: generatedRoi,
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/logout', finalPayload);
}

// Recent Transactions
export async function getRecentTransactions(payload) {
  const defaultParams = {
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/getTransactionActivity', finalPayload);
}

// Recent Transactions
export async function getAccountStatements(payload) {
  const defaultParams = {
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/getAccStatement', finalPayload);
}

// Transfers
export async function getCalculatedFees(payload) {
  const defaultParams = {
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/calculatefee', finalPayload);
}

export async function transferToOwnAccount(payload) {
  const defaultParams = {
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/fundTransfer', finalPayload);
}

export async function transferToOwnBank(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
    uniqueID: `798552294_${Date.now()}`,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/payeeAction', finalPayload);
}

export async function addPayee(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    fg: '',
    roi: generatedRoi,
    otp: '000000',
    uniqueID: `798552294_${Date.now()}`,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/payeeAction', finalPayload);
}

export async function deletePayee(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
    action: '3',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/payeeAction', finalPayload);
}

export async function getTransactionHistory(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/getTransactionActivity', finalPayload);
}

export async function getListOfPayees(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/listOfPayees', finalPayload);
}

export async function getListOfPayments(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/listOfPayments', finalPayload);
}
// scheduled transfer History
export const scheduledTransferHistory = async (formData) => {
  const payload = {
    otp: '000000',
    fp: '0',
    respType: 'json',
    roi: `084_${Date.now()}`,
  };
  return post('/getScheduledTranserHistory', { ...formData, ...payload });
};

export async function deleteSchedulePayment(payload) {
  const defaultParams = {
    respType: 'json',
    fp: '0',
    roi: generatedRoi,
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/deletePayment', finalPayload);
}

// manageFingerPrint
export async function manageFingerPrint(payload) {
  const defaultParams = {
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/manageFingerPrint', finalPayload);
}

// login by FingerPrint
export async function loginFingerPrint(payload) {
  const defaultParams = {
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/authenticateByFingerPrint', finalPayload);
}

// List Documents
export const getDocuments = async () => post('/getListDocuments', {});

// Secure Messages
// get Inbox Messages
export const getInboxMessages = async (payload) => {
  const defaultParams = {
    respType: 'json',
  };

  const finalPayload = { ...defaultParams, ...payload };
  return post('/getInbox', finalPayload);
};

// get Outbox Messages
export const getOutboxMessages = async (payload) => {
  const defaultParams = {
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/getSentMails', finalPayload);
};

// Send Secure Message
export const sendSecureMessage = async (payload) => {
  const defaultParams = {
    roi: generatedRoi,
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/sendSecureMessage', finalPayload);
};

// Get Message Subjects
export const getMessageSubjects = async (payload) => {
  const defaultParams = {
    memo: 'SM',
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/getSubjects', finalPayload);
};

// Delete Message
export const deleteMessage = async (payload) => {
  const defaultParams = {
    roi: generatedRoi,
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/deleteMessages', finalPayload);
};

// Read Inbox Message
export const readInboxMessage = async (payload) => {
  const defaultParams = {
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/readMail', finalPayload);
};

// Read Sent Message
export const readSentMessage = async (payload) => {
  const defaultParams = {
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/readSentMails', finalPayload);
};

// Get File Upload Purposes
export const getFileUploadPurposes = async (payload) => {
  const defaultParams = {
    memo: 'FS',
    respType: 'json',
  };
  const finalPayload = { ...defaultParams, ...payload };
  return post('/getSubjects', finalPayload);
};

// Secure File Upload
export const uploadSecureFile = async (formData) => {
  const payload = {
    roi: generatedRoi,
    respType: 'json',
    purpose: formData.purpose,
    desc: formData.description,
    loginId: formData.loginId || 'tester1',
    files: formData.files,
  };

  return postFile('/secureFileUpload', payload);
};

// get bill payment templates
export const getBillTempllates = async (formData) => {
  const payload = {
    respType: 'json',
  };

  return post('/getUserBillerList', payload);
};

// get accredited Billers
export const getAccreditedBiller = async (formData) => {
  const payload = {
    respType: 'json',
  };

  return post('/getAccreditedBillerList', payload);
};

// get list of Bills
export const getlistOfBills = async (formData) => {
  const payload = {
    respType: 'json',
    sortType: 1,
  };

  return post('/listOfBills', payload);
};

// get Bill Payment History
export const getBillHistory = async (formData) => {
  const payload = {
    respType: 'json',
  };
  return post('/getBillHistory', { ...formData, ...payload });
};

//  Pay Bill
export const payBill = async (formData) => {
  const payload = {
    output: 10,
    uniqueID: `798552294_${Date.now()}`,
    roi: `084_${Date.now()}`,
    respType: 'json',
    fp: '0',
    otp: '000000',
  };
  return post('/payBills', { ...formData, ...payload });
};

// get saved bill templates
export const getUserBillerList = async (formData) => {
  return post('/getUserBillerList', formData);
};

// update bill templates
export const updateBillerTemplates = async (formData) => {
  const payload = {
    type: 1,
    roi: `084_${Date.now()}`,
    respType: 'json',
    fp: '0',
    action: '1',
    otp: '000000',
    uniqueID: globals.secretKey,
  };
  return post('/editPayee', { ...formData, ...payload });
};

// update bill templates
export const deleteBillerTemplates = async (formData) => {
  const payload = {
    type: 1,
    roi: `084_${Date.now()}`,
    respType: 'json',
    fp: '0',
    action: '1',
    otp: '000000',
    uniqueID: globals.secretKey,
  };
  return post('/deletePayee', { ...formData, ...payload });
};

// get scheduled bill Payments
export const scheduledBillPayments = async (formData) => {
  const payload = {
    output: 10,
    fromFlag: 1,
  };
  return post('/listOfPayments', { ...formData, ...payload });
};

//cancel scheduled bill payment
export const cancelScheduledBillPayments = async (formData) => {
  const payload = {
    otp: '000000',
    fp: '0',
    respType: 'json',
    uniqueID: globals.secretKey,
    roi: `084_${Date.now()}`,
    bankId: 220,
  };
  return post('/deletePayment', { ...formData, ...payload });
};

// scheduled bill payment History
export const scheduledBillPaymentHistory = async (formData) => {
  const payload = {
    otp: '000000',
    fp: '0',
    respType: 'json',
    roi: `084_${Date.now()}`,
  };
  return post('/getScheduledTranserHistory', { ...formData, ...payload });
};

// Locate Bank API (Branches & ATMs)
export const locateBankApi = async (params) => {
  const payload = {
    method: 'locateBank',
    fg: 1,
    addr: params.query || '',
    phone: '',
    type: 1,
    dist: 10,
    otp: 'NO_OTP',
    srcPos: params.lat && params.lng ? `${params.lat},${params.lng}` : '23.540256,90.7537571',
    countryText: '',
    roi: `084_${Date.now()}`,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    // bankId: 220,
  };

  return post('/locateBank', payload);
};

export const getBranchServicesApi = async (branchId) => {
  const payload = {
    method: 'branchInfo2',
    branchId: branchId,
    otp: '000000',
    sortType: 1,
    fg: 0,
    respType: 'json',
    roi: '084_1763961391591',
    lan: 'en',
    bankId: 220,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/branchInfo2', payload);
};

export const getBranchTimesApi = async (branchId, dateStr) => {
  const payload = {
    method: 'getAvlTimeBranch',
    branchId: branchId,
    date: dateStr,
    otp: 'NO_OTP',
    roi: '084_1763961391591',
    lan: 'en',
    bankId: 220,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/getAvlTimeBranch', payload);
};

export const makeAppointmentApi = async (data) => {
  const payload = {
    method: 'makeAppointment',
    firstName: data.firstName,
    lastName: data.lastName,
    addr1: data.address1,
    addr2: data.address2 || '',
    email: data.email,
    zipCode: data.zipCode,
    city: data.city,
    state: data.state,
    reason: data.reason,
    phone: data.phoneNo,
    date: data.date,
    time: data.time,
    branchId: data.branchId,
    serviceType: data.serviceId,
    lan: 'en',
    uniqueID: `798552294_${Date.now()}`,
    roi: '084_1763961391591',
    bankId: 220,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/makeAppointment', payload);
};

// --- Mobile Recharge ---
// Get Top Up Number List
export async function getTopUpList(payload = {}) {
  const defaultParams = {
    respType: 'json',
  };
  return post('/listOfTopups', { ...defaultParams, ...payload });
}

// Calculate Fee
export async function calculateTopUpFee(payload) {
  const defaultParams = {
    code: 'MB_TOPUP',
    payNow: 'Y',
    respType: 'json',
  };
  return post('/calculatefee', { ...defaultParams, ...payload });
}

// Submit Top Up
export async function submitTopUp(payload) {
  const defaultParams = {
    code: 'MB_TOPUP',
    roi: generatedRoi,
    respType: 'json',
  };
  return post('/topup', { ...defaultParams, ...payload });
}

// Refresh Data Endpoints
// export const getUpdatedAccounts = async (payload = {}) => post('/updatedAccounts', payload);

export const loadCreditCardDetails = async (payload = {}) =>
  post('/loadCreditCardDetails', payload);

// Add Topup Number
export async function addTopUpNumber(payload) {
  const defaultParams = {
    method: 'addTopup',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/addTopup', { ...defaultParams, ...payload });
}

// Delete Topup Number
export async function deleteTopUpNumber(payload) {
  const defaultParams = {
    method: 'deleteTopup',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/deleteTopup', { ...defaultParams, ...payload });
}

// Update Topup Number
export async function updateTopUpNumber(payload) {
  const defaultParams = {
    method: 'updateTopup',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('editTopup', { ...defaultParams, ...payload });
}

// Get Current User Profile
export const getCurrentUser = async (payload = {}) => {
  const defaultParams = {
    method: 'getCurrentUser',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/getCurrentUser', { ...defaultParams, ...payload });
};

// Update Profile
export const updateUserProfile = async (payload) => {
  const defaultParams = {
    method: 'updateProfile',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/updateProfile', { ...defaultParams, ...payload });
};

// Validate Recipient
export const validateP2PRecipient = async (payload) => {
  const defaultParams = {
    method: 'p2pValidation',
    respType: 'json',
    roi: generatedRoi,
    appType: 'android',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/p2pValidation', { ...defaultParams, ...payload });
};

// Calculate P2P Fee
export const calculateP2PFee = async (payload) => {
  const defaultParams = {
    method: 'calculatefee',
    code: 'ACC_SND_MNY',
    payNow: 'N',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/calculatefee', { ...defaultParams, ...payload });
};

// Submit P2P Payment
export const submitP2PPayment = async (payload) => {
  const defaultParams = {
    method: 'p2pPayment',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/p2pPayment', { ...defaultParams, ...payload });
};

// Get P2P Account List
export const getP2PAccountList = async () => {
  const defaultParams = {
    method: 'p2pAccountList',
    otp: '000000',
    sortType: '1',
    fg: '0',
    respType: 'json',
    roi: generatedRoi,
    lan: 'en',
    bankId: '220',
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/p2pAccountList', defaultParams);
};

// Validate Contact
export const validateP2PContact = async (payload) => {
  const defaultParams = {
    method: 'p2pValidation',
    OTP: '000000',
    fp: '0',
    respType: 'json',
    appType: 'android',
    roi: generatedRoi,
    lan: 'en',
    bankId: '220',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/p2pValidation', { ...defaultParams, ...payload });
};

// Register P2P Account
export const registerP2PAccount = async (payload) => {
  const defaultParams = {
    method: 'manageP2PAccount',
    fp: '0',
    respType: 'json',
    roi: generatedRoi,
    lan: 'en',
    bankId: '220',
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/manageP2PAccount', { ...defaultParams, ...payload });
};

//  Delete P2P Account
export const deleteP2PAccount = async (payload) => {
  const defaultParams = {
    method: 'manageP2PAccount',
    action: '2',
    OTP: '000000',
    fp: '0',
    respType: 'json',
    appType: 'android',
    roi: generatedRoi,
    lan: 'en',
    bankId: '220',
    deviceId: 'IB',
    encrypted: 'true',
  };
  return post('/manageP2PAccount', { ...defaultParams, ...payload });
};

// Get User Activity
export const getUserActivity = async () => {
  const defaultParams = {
    method: 'getUserActivity',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/getUserActivity', defaultParams);
};

// Change Password
export const changeUserPassword = async (payload) => {
  const defaultParams = {
    method: 'changePassword',
    respType: 'json',
    roi: generatedRoi,
    appType: 'WEB',
    deviceId: 'IB',
    encrypted: 'true',
    bankId: '220',
    lan: 'en',
  };
  return post('/changePassword', { ...defaultParams, ...payload });
};

// get fraud subject
export const getFraudSubjects = async () => {
  const defaultParams = {
    method: 'getSubjects',
    memo: 'FS',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/getSubjects', defaultParams);
};

// Submit Fraud Report
export const submitFraudReport = async (payload) => {
  const defaultParams = {
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/reportFraud', { ...defaultParams, ...payload });
};

// Update Challenge Questions
export const updateUserChallenge = async (payload) => {
  const defaultParams = {
    method: 'updateUserChallenge',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/updateUserChallenge', { ...defaultParams, ...payload });
};

//Order Print Statement
export const orderPrintStatement = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/orderPrintStatement', { ...defaultParams, ...payload });
};

//Order an affidavit
export const orderAnAffidavit = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/createAffidavitOrderDetails', { ...defaultParams, ...payload });
};

//reorder Checkbook
export const reporderCheckbook = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/reorderChecks', { ...defaultParams, ...payload });
};

//stop Check Payment
export const stopCheckPayment = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/stopPayment', { ...defaultParams, ...payload });
};

// calculate transfer fee
export const calculateSelfTransferFee = async (payload) => {
  const defaultParams = {
    method: 'calculatefee',
    code: 'ACC_OWN_XFR',
    payNow: 'Y',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/calculatefee', { ...defaultParams, ...payload });
};

// Submit Fund Transfer
export const submitFundTransfer = async (payload) => {
  const defaultParams = {
    method: 'fundTransfer',
    code: 'ACC_OWN_XFR',
    payNow: 'Y',
    currencyCode: 'USD',
  };
  return post('/fundTransfer', { ...defaultParams, ...payload });
};

// Get Transaction Activity for specific account
export const getAccountActivity = async (payload) => {
  const data = typeof payload === 'string' ? { accNo: payload } : payload;

  const defaultParams = {
    method: 'getAccountActivity',
    respType: 'json',
    txnp: '0',
    pnum: '1',
    roi: generatedRoi,
  };

  // Merge defaultParams with the data object
  return post('/getAccountActivity', { ...defaultParams, ...data });
};

export const getAccountSummary = async (payload) => {
  const data = typeof payload === 'string' ? { accNo: payload } : payload;

  const defaultParams = {
    method: 'getAccountActivity',
    respType: 'json',
    roi: generatedRoi,
  };

  return post('/getAccountActivity', { ...defaultParams, ...data });
};

//order Cashier Check
export const orderCashierCheck = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/createCashierCheckOrderDetails', { ...defaultParams, ...payload });
};

//Positive Pay
export const positivePay = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/createPayPositiveDetails', { ...defaultParams, ...payload });
};

//Inquire Check status
export const inquireCheckStatus = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/getAccountCheckStatus', { ...defaultParams, ...payload });
};

// Change Account Nickname
export const changeAccountNickname = async (payload) => {
  const defaultParams = {
    method: 'changeAccountName',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/changeAccountName', { ...defaultParams, ...payload });
};

// Restore Account Nickname
export const restoreAccountNickname = async (payload) => {
  const defaultParams = {
    method: 'restoreAccountName',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/restoreAccountName', { ...defaultParams, ...payload });
};

//Make Payment
export const makePayment = async (payload) => {
  const defaultParams = {
    otp: '123456',
    sortType: 1,
    fg: 0,
    uniqueID: `798552294_${Date.now()}`,
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/makeCreditCardPayment', { ...defaultParams, ...payload });
};

export const refreshGlobalSession = async () => {
  return post('/sessionCounter', {});
};

export const updateServerTimeout = async () => {
  const payload = {
    fg: 0,
    respType: 'json',
  };
  return post('/sessionHandle', payload);
};

// Change Account Order
export const changeAccountOrder = async (payload) => {
  const defaultParams = {
    method: 'changeAccountOrder',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/changeAccountOrder', { ...defaultParams, ...payload });
};

// Get Updated Accounts (After Reorder)
export const getUpdatedAccounts = async () => {
  const defaultParams = {
    method: 'updatedAccounts',
    respType: 'json',
    roi: generatedRoi,
  };
  return post('/updatedAccounts', defaultParams);
};
