import { Bid, Collection, User } from "@prisma/client";

export interface CollectionWithUser extends Collection {
  user: {
    name: string
  }
}
export interface CollectionResponse {
  collections: CollectionWithUser[],
  lastCursor: number,
  hasNextPage: boolean
}

export interface BidWithUser extends Bid {
  user: { name: string, email: string }
};
export interface BidsResponse {
  bids: BidWithUser[]
}

export interface UsersResponse {
  users: User[]
}