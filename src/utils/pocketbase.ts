import PocketBase from 'pocketbase'

/* const pocketBaseUrl = process.env.NEXT_POCKETBASE_URL
console.log(pocketBaseUrl)
if (!pocketBaseUrl) {
  throw new Error('Pocketbase URL is mandatory')
} */

export const pb = new PocketBase('https://pocketbase.memelli.dev/')
