export const parseP2PAccountList = (response) => {
  const rs = response?.rs || response;
  if (!rs || !rs.ppcl) return [];

  return rs.ppcl
    .split('|')
    .filter((item) => item && item.trim().length > 0)
    .map((item) => {
      const parts = item.split('#');

      const email = parts[1] || '';
      const phone = parts[2] || '';
      const displayContact = email ? email : phone;

      return {
        id: parts[0],
        email: email,
        phone: phone,
        nickname: parts[3] || '',
        firstName: parts[4] || '',
        lastName: parts[5] || '',
        receiveAccount: parts[6] || '',
        emailPhone: displayContact,
      };
    });
};
