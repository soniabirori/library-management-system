// Sample data for the frontend. The frontend is not connected to the backend,
// so every page starts from these lists. The shapes follow the backend models:
// UUID ids, Book's id is `isbn`, Member has a role (STUDENT or STAFF).
import { addDays, today, toISO } from '../utils';

/** ISO date `offset` days from today, so the sample loans always look current. */
const day = (offset) => toISO(addDays(today(), offset));

export const ROLES = ['STUDENT', 'STAFF'];
export const LOAN_DAYS = 14;
export const MAX_BOOKS_OUT = 3;

export const categories = [
  { id: '29dbf803-aa27-4515-a0a1-65c0cfc9787b', name: 'Computer Science' },
  { id: '6dc029af-52ed-4fb2-ad41-049f2798a361', name: 'Mathematics' },
  { id: '4f23c2ae-e601-4266-b1e1-12d37c14a179', name: 'Literature' },
  { id: '150ec4f0-dda8-45f8-bf8f-7d26ceb060d3', name: 'Physics' },
  { id: '89fc5989-cb6f-4cc8-adab-6914776b487e', name: 'History' },
  { id: '728c26e0-d670-4945-a590-e6b6922b3282', name: 'Business' },
  { id: '2493d0df-ec87-455a-affa-d6aba7adb824', name: 'Philosophy' },
  { id: '01a3b1c4-5fe4-41e5-816d-ce6624961997', name: 'Biology' },
];

const [CS, MATH, LIT, PHY, HIST, BUS, PHIL, BIO] = categories.map((c) => c.id);

export const books = [
  { isbn: '3b39fbf7-3a82-4f52-bb0a-0b2c9a5042ad', title: 'Clean Code', author: 'Robert C. Martin', categoryId: CS },
  { isbn: 'd9067a57-790f-487c-b64e-34199c740a53', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', categoryId: CS },
  { isbn: '10b849ee-e88c-45c3-8411-4640c2746916', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', categoryId: CS },
  { isbn: '380584c2-4d61-4d13-8c9f-be29b32724b0', title: 'Design Patterns', author: 'Erich Gamma', categoryId: CS },
  { isbn: 'c47ee2f4-cbeb-4f37-b11d-a5d9d8eb5336', title: 'Refactoring', author: 'Martin Fowler', categoryId: CS },
  { isbn: '4854f8f9-dab5-4683-b6fb-38849d9dd588', title: 'Calculus: Early Transcendentals', author: 'James Stewart', categoryId: MATH },
  { isbn: '62112462-a135-48f3-b95e-a20bc674cf3a', title: 'Linear Algebra Done Right', author: 'Sheldon Axler', categoryId: MATH },
  { isbn: 'c560d8f6-9f8f-4f21-bf24-03d80088c470', title: 'How to Solve It', author: 'George Pólya', categoryId: MATH },
  { isbn: 'c313fce1-3977-4c0e-b6a6-8c799f8d1950', title: 'Things Fall Apart', author: 'Chinua Achebe', categoryId: LIT },
  { isbn: 'e349a34a-1839-4bab-8148-3ad558eabfbc', title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', categoryId: LIT },
  { isbn: '789853c9-f111-4535-864b-1cf3d86a74d2', title: 'Weep Not, Child', author: "Ngũgĩ wa Thiong'o", categoryId: LIT },
  { isbn: '4eb23c9d-fb7a-4c04-88ff-48be758fc25e', title: 'Pride and Prejudice', author: 'Jane Austen', categoryId: LIT },
  { isbn: 'ce48c298-ca13-4cd6-b53d-1ade04bd4597', title: 'A Brief History of Time', author: 'Stephen Hawking', categoryId: PHY },
  { isbn: 'a482a98e-7d05-416b-b279-05a3091a9fe4', title: 'The Feynman Lectures on Physics', author: 'Richard P. Feynman', categoryId: PHY },
  { isbn: 'c1a7b7bc-6e3a-4c0a-8adc-20f5b03920be', title: 'Cosmos', author: 'Carl Sagan', categoryId: PHY },
  { isbn: '7f70442e-bb76-43ce-b737-d56d7f69c269', title: 'Sapiens', author: 'Yuval Noah Harari', categoryId: HIST },
  { isbn: '7c08d890-3e9e-4c3f-ab59-1b2047aa582f', title: 'Guns, Germs, and Steel', author: 'Jared Diamond', categoryId: HIST },
  { isbn: '7c71e4bb-6cf5-4951-b66f-a0ed0380387f', title: 'The Lean Startup', author: 'Eric Ries', categoryId: BUS },
  { isbn: '0d84a2d8-900e-41e6-96cf-727a5f0251e9', title: 'Zero to One', author: 'Peter Thiel', categoryId: BUS },
  { isbn: '5dbbfe92-0212-47e5-acfa-3a319b9b9ad6', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', categoryId: BUS },
  { isbn: '6a60098b-4eda-4e20-95c3-ba98d4f1ebc8', title: 'Meditations', author: 'Marcus Aurelius', categoryId: PHIL },
  { isbn: '20937015-fad6-4aed-9fb5-6951ee3f9d05', title: 'The Republic', author: 'Plato', categoryId: PHIL },
  { isbn: '45fd23db-f9ba-49bf-9126-4e3e94eb4daa', title: 'The Selfish Gene', author: 'Richard Dawkins', categoryId: BIO },
  { isbn: '20bde46b-91bf-4b09-ad0f-0fe0ec59bd6b', title: 'The Gene: An Intimate History', author: 'Siddhartha Mukherjee', categoryId: BIO },
];

export const members = [
  { id: 'ba2a8cb5-e8fb-4338-bfeb-b04e58e7ea19', fullName: 'Aline Uwase', email: 'aline.uwase@auca.ac.rw', role: 'STUDENT' },
  { id: 'd428acea-dddf-40b5-8391-b51d38357144', fullName: 'Jean Paul Habimana', email: 'jp.habimana@auca.ac.rw', role: 'STUDENT' },
  { id: '151cbe90-ffa0-4c8a-9f6b-2aba8e81672a', fullName: 'Grace Mukamana', email: 'grace.mukamana@auca.ac.rw', role: 'STUDENT' },
  { id: '5e033560-7142-41f0-99f6-ebfec559aba3', fullName: 'Eric Niyonzima', email: 'eric.niyonzima@auca.ac.rw', role: 'STUDENT' },
  { id: '806f1819-4ae6-4543-9261-fd08f4787fe0', fullName: 'Diane Ingabire', email: 'd.ingabire@auca.ac.rw', role: 'STAFF' },
  { id: 'e48fea06-b1ce-4f10-9116-f3c333c6ef2c', fullName: 'Patrick Mugisha', email: 'patrick.mugisha@auca.ac.rw', role: 'STUDENT' },
  { id: '81e7cf96-5926-492b-8b95-0a6316abc1d0', fullName: 'Claudine Umutoni', email: 'claudine.umutoni@auca.ac.rw', role: 'STUDENT' },
  { id: 'bbf00e06-a2f6-4dd1-b148-2900f0687804', fullName: 'Kevin Iradukunda', email: 'kevin.iradukunda@auca.ac.rw', role: 'STUDENT' },
  { id: '106290b4-7ec0-4e61-beac-9ae4ad117ec5', fullName: 'Sandrine Keza', email: 'sandrine.keza@auca.ac.rw', role: 'STUDENT' },
  { id: '7c76293b-97b2-468b-ae58-ecf8d413d707', fullName: 'Olivier Nshuti', email: 'o.nshuti@auca.ac.rw', role: 'STAFF' },
  { id: '4edfe5e7-16bd-4912-bf44-d066489cd6ab', fullName: 'Ange Isimbi', email: 'ange.isimbi@auca.ac.rw', role: 'STUDENT' },
  { id: '4986b166-9700-4c88-8bfc-00ebdf746e78', fullName: 'Moses Kayitare', email: 'm.kayitare@auca.ac.rw', role: 'STAFF' },
];

const [ALINE, JP, GRACE, ERIC, DIANE, PATRICK, CLAUDINE, KEVIN, SANDRINE, OLIVIER, ANGE, MOSES] =
  members.map((m) => m.id);
const isbn = (title) => books.find((b) => b.title === title).isbn;

/** Builds a loan the same way the backend does: due date = borrow date + 14 days. */
function loan(id, memberId, bookTitle, borrowOffset, returnOffset = null) {
  return {
    id,
    memberId,
    bookId: isbn(bookTitle),
    borrowDate: day(borrowOffset),
    dueDate: day(borrowOffset + LOAN_DAYS),
    returnDate: returnOffset === null ? null : day(returnOffset),
  };
}

export const loans = [
  loan('528a7f24-16a1-4e70-ad22-bb9951f7add0', ALINE, 'Clean Code', -3),
  loan('dae4a6d6-56cc-4f01-9c67-0ad4b27d25ab', ALINE, 'Calculus: Early Transcendentals', -10),
  loan('f2056a05-1d03-425c-afb0-c75356fe33fd', ALINE, 'A Brief History of Time', -20),
  loan('efd7b46a-2597-485b-aa7c-c67a87482307', JP, 'Introduction to Algorithms', -16),
  loan('19ac5367-9d1c-456f-a3b6-e353e9bf48ff', GRACE, 'Things Fall Apart', -2),
  loan('77481090-8f10-477a-8996-b5c3f2d0ccea', GRACE, 'Sapiens', -30, -18),
  loan('f48d9208-e303-4e51-9604-64b7cd164dfc', ERIC, 'The Lean Startup', -12),
  loan('0f4222b0-d97b-42d1-b81e-afa8182ba1e7', DIANE, 'Meditations', -5),
  loan('9307bb16-b9f8-4f87-8561-1384e62bc9f2', PATRICK, 'Half of a Yellow Sun', -25, -14),
  loan('24a53f47-bc64-4363-9d1f-79b869c3a21d', CLAUDINE, 'The Selfish Gene', -1),
  loan('082c6ab2-f6ea-4add-bf04-732ed45b8bf3', KEVIN, 'The Pragmatic Programmer', -40, -27),
  loan('7360a8b4-2454-4999-a198-2e5eebda1bab', SANDRINE, 'The Feynman Lectures on Physics', -19),
  loan('9f7f231a-dbab-4b3d-a10c-96f553372314', OLIVIER, 'Refactoring', -8),
  loan('1fba5151-fc79-4273-831d-87641528ac19', JP, 'Pride and Prejudice', -45, -33),
  loan('b7e1c00f-d87e-4c1c-b850-6186ee7da9d4', ANGE, 'Zero to One', -6),
  loan('142f0023-442b-4248-bbc9-751a12479724', MOSES, 'The Republic', -22, -9),
];
