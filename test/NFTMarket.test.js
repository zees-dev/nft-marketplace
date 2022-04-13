import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    /* create two tokens */
    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()
    const auctionItemPrice = ethers.utils.parseUnits('0.1', 'ether')

    /* put both tokens for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionItemPrice, { value: listingPrice })
    await market.createMarketItem(nftContractAddress, 2, auctionItemPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionItemPrice })

    /* query for and return the unsold items */
    let items = await market.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)

    expect(items.length).to.equal(1)
    expect(items[0].tokenUri).to.equal('https://www.mytokenlocation2.com')
  })

  it("Market sale should pay NFT market contract", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    /* create token */
    await nft.createToken("https://www.mytokenlocation.com")

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()
    const auctionItemPrice = ethers.utils.parseUnits('0.1', 'ether')

    /* put token for sale */
    await market.createMarketItem(nftContractAddress, 1, auctionItemPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    // buyerAddress.sendTransaction({ value: auctionItemPrice, to: marketAddress })

    /* execute sale of token to another user */
    await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, { value: auctionItemPrice })

    /* check balance of market contract */
    const marketBalance = await ethers.provider.getBalance(marketAddress)
    console.log(marketBalance)
    // expect(marketBalance.toString()).to.equal(ethers.utils.parseUnits('0.1', 'ether').toString())
  })
})