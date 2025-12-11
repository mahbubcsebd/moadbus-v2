export function detectAccountType(acc) {
  const text = acc.d?.toLowerCase() || '';

  if (text.startsWith('time')) return 'Time Deposit';
  if (text.startsWith('loan')) return 'Loan';
  if (text.startsWith('savings')) return 'Savings Account';
  if (text.startsWith('current')) return 'Current Account';

  return 'Account';
}

export function detectAccountColor(acc) {
  const type = detectAccountType(acc);

  switch (type) {
    case 'Savings Account':
      return 'blue';
    case 'Current Account':
      return 'teal';
    case 'Loan':
      return 'purple';
    case 'Time Deposit':
      return 'orange';
    default:
      return 'orange';
  }
}

export function getAvaiableFunctions(acc){
  let functions = [];
  let acc_arr=acc.at.split('|');
  acc_arr.map((item)=>{
    let current = item.split(';')
    functions[current[0]] = current[1];
  })
  functions[100] = 1;
  return functions

}
