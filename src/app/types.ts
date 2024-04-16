import { Bid, Collection } from "@prisma/client";

export interface CollectionResponse {
  collections: Collection[],
  lastCursor: number,
  hasNextPage: boolean
}

export interface BidsResponse {
  bids: (Bid & { user: { name: string, email: string }})[]
}