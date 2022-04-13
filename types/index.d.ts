/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */

export interface MarketItem {
  itemId: number
  nftContract: string
  tokenId: number
  seller: string
  owner: string
  price: number;
  sold: boolean
}

export interface NFT {
  price: string
  tokenId: any
  seller: string
  owner: string
  image: any
  name?: any
  description?: any
}