// Helpers that look things up across the lists (like joins in the backend).

export function indexBy(list, key = 'id') {
  return new Map(list.map((item) => [item[key], item]));
}

/** bookId -> the loan that currently has it out */
export function activeLoanByBook(loans) {
  return new Map(loans.filter((l) => !l.returnDate).map((l) => [l.bookId, l]));
}

/** memberId -> number of books currently out */
export function activeCountByMember(loans) {
  const counts = new Map();
  loans
    .filter((l) => !l.returnDate)
    .forEach((l) => counts.set(l.memberId, (counts.get(l.memberId) || 0) + 1));
  return counts;
}
