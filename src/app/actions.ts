'use server'

import { revalidateTag } from "next/cache";
import { BidsResponse, CollectionResponse } from "./types";
import { z } from 'zod'

const BASE_URL = process.env.BASE_URL;

const collectionSchema = z.object({
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
  stock: z.number({
    required_error: 'Stock Required',
  }).min(1),
})

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

export async function getBids(collection_id: number): Promise<BidsResponse> {
  const res = await fetch(BASE_URL + `/api/collections/${collection_id}/bids`, {
    method: 'GET',
    next: {
      tags: [`bids-${collection_id}`]
    }
  })
  return await res.json();
}

export async function updateBid(bid_id: number, data: { price: number }, collection_id: number) {
  const res = await fetch(BASE_URL + `/api/bid`, {
    method: 'PATCH',
    body: JSON.stringify({
      id: bid_id,
      price: data.price
    }),
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

export async function editCollection(prevState: any, formData: FormData) {
  const validatedFields = collectionSchema.safeParse({
    id: parseInt(formData.get('id') as string),
    name: formData.get('name'),
    description: formData.get('description'),
    price: parseInt(formData.get('price') as string),
    stock: parseInt(formData.get('stock') as string)
  })
  console.log(validatedFields);
  
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