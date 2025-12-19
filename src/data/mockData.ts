import type { Member } from '../types'

export function getMockMembers(): Member[] {
  return [
    {
      id: 1,
      name: 'Ahmed Hassan',
      category: 'game',
      email: 'ahmed.hassan@example.com',
      phone: '01001234567',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 2,
      name: 'Fatima Mohammed',
      category: 'graphics',
      email: 'fatima.mohammed@example.com',
      phone: '01112345678',
      createdAt: new Date('2024-01-16').toISOString(),
    },
    {
      id: 3,
      name: 'Omar Ali',
      category: 'game',
      email: 'omar.ali@example.com',
      phone: '01223456789',
      createdAt: new Date('2024-01-17').toISOString(),
    },
    {
      id: 4,
      name: 'Noor Samir',
      category: 'graphics',
      email: 'noor.samir@example.com',
      phone: '01334567890',
      createdAt: new Date('2024-01-18').toISOString(),
    },
    {
      id: 5,
      name: 'Mohamed Ibrahim',
      category: 'game',
      email: 'mohamed.ibrahim@example.com',
      phone: '01445678901',
      createdAt: new Date('2024-01-19').toISOString(),
    },
    {
      id: 6,
      name: 'Layla Karim',
      category: 'graphics',
      email: 'layla.karim@example.com',
      phone: '01556789012',
      createdAt: new Date('2024-01-20').toISOString(),
    },
    {
      id: 7,
      name: 'Hassan El-Sayed',
      category: 'game',
      email: 'hassan.elsayed@example.com',
      phone: '01667890123',
      createdAt: new Date('2024-01-21').toISOString(),
    },
    {
      id: 8,
      name: 'Mona Youssef',
      category: 'graphics',
      email: 'mona.youssef@example.com',
      phone: '01778901234',
      createdAt: new Date('2024-01-22').toISOString(),
    },
  ]
}
