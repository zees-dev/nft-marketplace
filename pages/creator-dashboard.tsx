import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  NFT_MARKET_ADDRESS, NFT_ADDRESS
} from '../config'

import NFTMarket_ABI from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT_ABI from '../artifacts/contracts/NFT.sol/NFT.json'

import type { MarketItem, NFT } from '../types'

interface SellableNFT extends NFT {
  sold: boolean
}

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState<SellableNFT[]>([])
  const [sold, setSold] = useState<SellableNFT[]>([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(NFT_MARKET_ADDRESS, NFTMarket_ABI.abi, signer)
    const tokenContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI.abi, provider)
    const data: MarketItem[] = await marketContract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item: SellableNFT = {
        price,
        tokenId: (i.tokenId as any).toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded')
  }

  if (loadingState === 'loaded' && !nfts.length)
    return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Items Created</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="px-4">
        {
          Boolean(sold.length) && (
            <div>
              <h2 className="text-2xl py-2">Items sold</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {
                  sold.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}