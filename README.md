ZEX
===

### Decentralized Exchange on Zilliqa

Using the FungibleToken contract, ZEX attempts to create a decentralized exchange, like 0x on Zilliqa. Currently, it only supports $TOKEN/$ZIL pairings, where it can only support the buying and selling of tokens with Zilliqa. Token to token trades are not possible at this moment.

### initContract

(thisContractAddress: ByStr20)

Stores the contract's address initially. All contract transitions will be rejected if it's not initialized. This is because the contract has no way of knowing its own address.

### makeOrder

(tokenAddress: ByStr20,  orderType: Uint32, amount: Uint128, price: Uint128)

`tokenAddress` refers to the token contract held at the address.
`orderType` can only be `0` representing sell orders and `1` representing buy orders.
`amount` the amount of tokens to exchange.
`price` the price at which the tokens are exchanged for.

In buy orders, users are required to send in the total amount (i.e. price * amount) of ZIL in the transaction call. This indicates the user will buy the amount of tokens at that price.

In sell orders, users are required to first call the `Approve` transition in the FungibleToken contract with the total amount. This is so that the ZEX contract is able to spend the user's tokens. The amount approved for the ZEX contract to spend has to be price * amount. The user is able to redeem their tokens for ZIL from the contract.
