import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import HomePage from './HomePage';
import { CollectionWithUser } from '@/app/types';
import { User } from '@prisma/client';

const collections: CollectionWithUser[] = [
  {
    id: 1,
    name: 'Test Product',
    description: 'test product desc 1',
    price: 100,
    stocks: 1,
    user_id: 1,
    isComplete: false,
    user: {
      name: 'Foo Bar'
    },
  }
];
const lastCursor = 1

const moreCollections = [
  {
    id: 2,
    name: 'Test Product 2',
    description: 'test product desc 2',
    price: 100,
    stocks: 1,
    user_id: 1,
    isComplete: false,
    user: {
      name: 'Foo Bar'
    },
  }
];

// jest.mock("../actions", () => ({
//   getCollections: jest.fn().mockReturnValue({
//     collections: moreCollections,
//     lastCursor: 2,
//     hasNextPage: false
//   })
// }));

describe('HomePage', () => {

  const users: User[] = [
    { id: 1, name: 'Foo Bar', email: 'user1@gmail.com' },
    { id: 2, name: 'Bar Foo', email: 'user2@gmail.com' },
  ];

  it('should render without crashing', () => {
    render(<HomePage collections={collections} lastCursor={lastCursor} users={users} />);
  });

  it('should be able to change user', async () => {
    render(<HomePage collections={collections} lastCursor={lastCursor} users={users} />);
    await userEvent.click(screen.getByText('FB'));
    const newUser = await screen.findByText('Foo Bar');
    await userEvent.click(newUser);

    waitFor(() => {
      expect(screen.getByText('BF')).toBeInTheDocument()
    })
  });
  it('should render more collections when scrolling', () => {
    
  });
  it('should be able to click on a collection to see its details and bids', () => {
    
  });
  it('should be able to add collection', () => {
    
  });
  
  it('should be able to bid if not the collection owner', () => {
    
  });
  it('should be able to cancel bid', () => {
    
  });
  it('should be able to edit bid', () => {
    
  });
  it('should be able to accept bid if collection owner', () => {
    
  });
  it('should be able to delete collection if collection owner', () => {
    
  });
  it('should be able to edit collection if collection owner', () => {
    
  });
});
