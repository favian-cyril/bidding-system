'use server'

import { revalidateTag } from "next/cache";
import { BidsResponse, CollectionResponse, UsersResponse } from "./types";
import { z } from 'zod'

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const editCollectionSchema = z.object({
  id: z.number(),
  name: z.string({
    required_error: 'Name Required',
  }).min(1),
  description: z.string({
    required_error: 'Description Required',
  }).min(1),
  price: z.number({
    required_error: 'Price Required',
  }).min(1),
  stocks: z.number({
    required_error: 'Stock Required',
  }).min(1),
})

const createCollectionSchema = z.object({
  user_id: z.number(),
  name: z.string({
    required_error: 'Name Required',
  }).min(1),
  description: z.string({
    required_error: 'Description Required',
  }).min(1),
  price: z.number({
    required_error: 'Price Required',
  }).min(1),
  stocks: z.number({
    required_error: 'Stock Required',
  }).min(1),
})

const createBidSchema = z.object({
  price: z.number({
    required_error: 'Price Required',
  }).min(1),
  user_id: z.number(),
  collection_id: z.number()
})

const updateBidSchema = z.object({
  price: z.number({
    required_error: 'Price Required',
  }).min(1),
  id: z.number(),
})

// Collections Actions
export async function getCollections(cursor?: number, limit: number = 10): Promise<CollectionResponse> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  })
  if (cursor) {
    params.append('cursor', cursor.toString())
  }
  const res = await fetch(BASE_URL + '/api/collections?' + params.toString(), {
    method: 'GET',
    next: {
      tags: ['collections']
    }
  });
  return await res.json();
}
export async function deleteCollection(collection_id: number) {
  const res = await fetch(BASE_URL + `/api/collections`, {
    method: 'DELETE',
    body: JSON.stringify({
      id: collection_id
    }),
  })
  revalidateTag(`bids-${collection_id}`)
  return await res.json();
}

export async function editCollection(formData: FormData) {
  const validatedFields = editCollectionSchema.safeParse({
    id: parseInt(formData.get('id') as string),
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseInt(formData.get('price') as string),
    stocks: parseInt(formData.get('stock') as string)
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const res = await fetch(BASE_URL + `/api/collections`, {
    method: 'PATCH',
    body: JSON.stringify(validatedFields.data),
  });
  revalidateTag('collections');
  return await res.json();
}

export async function createCollection(formData: FormData) {
  const validatedFields = createCollectionSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseInt(formData.get('price') as string),
    stocks: parseInt(formData.get('stock') as string),
    user_id: parseInt(formData.get('user_id') as string)
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const res = await fetch(BASE_URL + `/api/collections`, {
    method: 'POST',
    body: JSON.stringify(validatedFields.data),
  });
  revalidateTag('collections');
  return await res.json();
}
// Bid Actions
export async function getBids(collection_id: number): Promise<BidsResponse> {
  const res = await fetch(BASE_URL + `/api/collections/${collection_id}/bids`, {
    method: 'GET',
    next: {
      tags: [`bids-${collection_id}`]
    }
  })
  return await res.json();
}

export async function updateBid(formData: FormData, collection_id: number) {
  const validatedFields = updateBidSchema.safeParse({
    price: parseInt(formData.get('price') as string),
    id: parseInt(formData.get('id') as string),
  })
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const res = await fetch(BASE_URL + `/api/bid`, {
    method: 'PATCH',
    body: JSON.stringify(validatedFields.data),
  })
  revalidateTag(`bids-${collection_id}`)
  return await res.json();
}

export async function acceptBid(collection_id: number, bid_id: number) {
  const res = await fetch(BASE_URL + `/api/collections/${collection_id}/accept-bid`, {
    method: 'POST',
    body: JSON.stringify({
      bid_id: bid_id
    })
  })
  revalidateTag(`bids-${collection_id}`)
  return await res.json();
}

export async function deleteBid(bid_id: number, collection_id: number) {
  const res = await fetch(BASE_URL + `/api/bid`, {
    method: 'DELETE',
    body: JSON.stringify({
      id: bid_id
    }),
  })
  revalidateTag(`bids-${collection_id}`)
  return await res.json();
}

export async function createBid(formData: FormData, collection_id: number, user_id: number) {
  const validatedFields = createBidSchema.safeParse({
    price: parseInt(formData.get('price') as string),
    user_id,
    collection_id,
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  const res = await fetch(BASE_URL + `/api/collections/${collection_id}/bids`, {
    method: 'POST',
    body: JSON.stringify(validatedFields.data),
  })
  revalidateTag(`bids-${collection_id}`)
  return await res.json();
}
// Users actions
export async function getUsers(): Promise<UsersResponse> {
  const res = await fetch(BASE_URL + '/api/users', {
    method: 'GET'
  })
  return await res.json()
}