# KLG Escrow Smart Contract

The KLG Escrow Smart Contract is a Solidity-based smart contract that facilitates the creation and management of escrow agreements between partners (patners) and clients. It allows for the secure and transparent handling of funds during a specified period, ensuring that both parties fulfill their obligations before the release of funds.

## Features

### Escrow Creation

- The contract allows patners to create new escrow agreements by specifying the matter number, asset name, currency, patner address, client address, total amount, number of releases, and duration.
- Each escrow agreement is uniquely identified by a matter number and can only be created once. Attempting to create an escrow with a matter number that has already been used will result in an error.
- The escrow creation process ensures that the currency used is allowed and that the patner has sufficient balance and allowance for the specified total amount.

### Client Agreement

- Once an escrow agreement is created, the client can review the terms and agree to them.
- The client's agreement is recorded, and the escrow's start date is set to the current block timestamp.
- The client's agreement can only be given once, preventing multiple agreements for the same escrow.

### Release of Escrowed Amounts

- The escrowed amount can be released to the client in multiple releases.
- Each release corresponds to a specified duration after the escrow's start date.
- The client can initiate the release of the escrowed amount, subject to the availability of remaining amounts and the number of releases.
- If the release conditions are not met (e.g., insufficient time has passed since the previous release), an error will occur.
- Upon a successful release, the specified amount is transferred to the client's address.

### Escrow Details

- The contract provides functions to retrieve the details of a specific escrow agreement, including the matter number, asset name, currency, patner address, client address, agreement status, total amount, and number of releases.

### Currency Management

- The contract supports the addition and removal of allowed currencies for use in escrow agreements.
- Only addresses with the `DEFAULT_ADMIN_ROLE` can add or remove currencies.

## Usage

To use the KLG Escrow Smart Contract, follow these steps:

1. Deploy the smart contract.
2. Assign the `DEFAULT_ADMIN_ROLE` to the contract deployer or another trusted address.
3. Assign the `PATNER_ROLE` to patner addresses that will create escrow agreements.
4. Assign the `CLIENT_ROLE` to client addresses that will agree to escrow terms and receive funds.
5. Add the allowed currencies using the `addCurrency` function, specifying the currency symbol (bytes32) and the contract address for that currency.
6. Patners can create new escrow agreements using the `createEscrow` function, providing the necessary details such as matter number, asset name, currency, client address, total amount, number of releases, and duration.
7. Clients can agree to escrow terms using the `agreedEscrow` function, passing the matter number of the escrow agreement they wish to agree to.
8. Clients can release the escrowed amounts using the `releaseEscrowAmount` function, providing the matter number of the escrow agreement they want to release funds from.
9. Retrieve escrow details and other information using the various getter functions provided by the contract.

## License

The KLG Escrow Smart Contract is licensed under the MIT License.
