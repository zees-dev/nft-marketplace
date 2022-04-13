# QAO NFT marketplace

## Run project

Running the project locally requires that you run a local EVM blockchain (hardhat node) and the Marketplace dApp (fullstack NextJS app) which utulises the local blockchain node.
The node will have no data/transactions; hence before running the dApp you must deploy the smart contracts to the local node.

### Run local hardhat node

```sh
npx hardhat node
```

### Deploy contracts to local node

```sh
npm run hardhat:deploy:local
```

### Run fullstack NextJS dApp

```sh
npm run dev
```

### Local dev issues

When re-running dApp with metamask connected to local hardhat node, you may encounter invalid nonce error.  
To resolve this error, you must reset your hardhat account; this can be done via:

`Metamask -> Settings -> Advanced -> Reset Account (red button)`

### Setup metamask to communicate with local hardhat node and dApp

1. Add network with following RPC details:
    - **Network Name:** `Hardhat`
    - **RPC URL:** `http://127.0.0.1:8545`
    - **Chain ID:** `1337`
    - **Currency Symbol:** `ETH`
2. Import local hardhat account private key into metamask
    - This account should have 10000 ETH
      - note: 20 accounts (and their respective private keys) should be displayed when running local hardhat node

## Testing contracts

```sh
npx hardhat test
```

## TODO

- [ ] Setup command for local IPFS node (non-persistent) to prevent polluting IPFS network when testing/dev'ing
  - Ideally this should be containerised local IPFS node
- [ ] Connect to network button
  - Based on provided config
  - has option for localhost - only when running in development
  - has option for Polygon - for all envs
  - has option for Polygon Mumbai testnet - for all envs
- [ ] Containerize application to run everything - with single `docker compose up` command
  - modular architecture
  - container for hardhat node
  - container for NextJS app
  - container to deploy smart contracts to node
- [ ] Integrate with TheGraph to index transactions/events and ease retrieval of data
  - probably after Polygon deployment
