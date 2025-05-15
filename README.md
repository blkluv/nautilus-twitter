# Nautilus Twitter: An application built with Nautilus

This example application is based on the [Nautilus reproducible build template](https://github.com/MystenLabs/nautilus), with several modifications to support a specific use case. Key modifications are:

1. `allowed_endpoints.yaml` - Updated before running `configure_enclave.sh` to allow access to `api.twitter.com`, which is required for the enclave to fetch Twitter data.
2. Enclave Logic (`/src/nautilus-server/app.rs`) - The `process_data` endpoint is modified to call the Twitter API and fetch either a Twitter profile or a tweet containing a Sui address followed by `#SUI`. If valid, it generates a signature over the address and Twitter handle.
3. Observability - `metrics.rs` is included for optional metrics collection. 
4. Move Smart Contract (`/move/app`) - Verifies the payload containing the Twitter handle and transaction sender against the signature, and mints an NFT if valid.
5. Frontend (`/frontend`) - Contains the UI logic that interacts with both the enclave and the Move smart contract.

> [!Note]
 > To run this example, you’ll need a [Twitter Developer account](https://developer.x.com) and a Bearer token. When prompted during the execution of `configure_enclave.sh`, store the token using [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html).

## Test server locally

```shell
cd src/nautilus-server
API_KEY=<YOUR_TWITTER_BEARER_TOKEN> cargo run
```

```
curl -X POST http://localhost:3000/process_data -H "Content-Type: application/json" -d '{"payload": {"user_url": "https://x.com/mystenintern/status/1852386957789114394" }}

{"response":{"intent":0,"timestamp_ms":1744306936287,"data":{"twitter_name":[109,121,115,116,101,110,105,110,116,101,114,110],"sui_address":[16,28,232,134,85,88,224,132,8,184,63,96,238,158,120,132,61,3,213,71,200,80,203,225,44,181,153,225,120,51,221,62]}},"signature":"1af8cd02248e68312ca43f58bf3cf377b8ce27dbf1b58c8f9ab45a05b16724a47aa9dea5cc3334978d7354d832afe5db579ee45d4247098faaefb21563e10503"}%
```

## Run the enclave

Follow the [Nautilus guide](UsingNautilus.md#run-the-example-enclave). 

The PCRs for this repo can be reproducibly built to the following. Note that this includes traffic forwarding changes made to `run.sh`. 

```
PCR0=38358b5fa2419c399140b1afbeb6adb03e607c5ba6c6dec51a895c3e32d4a5510af55bc7a5a032d811041b47108703d8
PCR1=38358b5fa2419c399140b1afbeb6adb03e607c5ba6c6dec51a895c3e32d4a5510af55bc7a5a032d811041b47108703d8
PCR2=21b9efbc184807662e966d34f390821309eeac6802309798826296bf3e8bec7c10edb30948c90ba67310f7b964fc500a
```

## Register the enclave onchain

Follow the [Nautilus guide](UsingNautilus.md#register-the-enclave-onchain). 

```
MODULE_NAME=twitter
OTW_NAME=TWITTER

# replace with your registered enclave
ENCLAVE_PACKAGE_ID=0x62afa41b677c59037ba4e893367e86e56cb9bdbfa987fe0e835cdce474b54ece
CAP_OBJECT_ID=0xb163c3e7135e9995baef56998b726f7d64593fa76a98481e6eb3c0cc3d7226ab
ENCLAVE_CONFIG_OBJECT_ID=0x4d933a25438f2bf9b59cd2c16e81e30b41a7ee0f2a3172396952ce1d7676bfc2
EXAMPLES_PACKAGE_ID=0xffe4466f1b98b2834327eb0757823323abed4756d0fe4ddd240dfc91abe3b39d
ENCLAVE_OBJECT_ID=0xe23314ccdb8b0cb4f2bbdf77a167f8c77e58475cda524af549c614f4b3716dc8

# replace with your own enclave IP
ENCLAVE_URL=http://<PUBLIC_IP>:3000
```

You can view an example of an enclave config object containing PCRs [here](https://testnet.suivision.xyz/object/0x4d933a25438f2bf9b59cd2c16e81e30b41a7ee0f2a3172396952ce1d7676bfc2). Also you can view an example of an enclave object containing the enclave public key [here](https://testnet.suivision.xyz/object/0xe23314ccdb8b0cb4f2bbdf77a167f8c77e58475cda524af549c614f4b3716dc8).

Then update the following in `frontend/src/networkConfig.ts` for frontend. 

```typescript
const EXAMPLE_PACKAGE_ID = "0xffe4466f1b98b2834327eb0757823323abed4756d0fe4ddd240dfc91abe3b39d";
const ENCLAVE_CONFIG_OBJECT_ID = "0x4d933a25438f2bf9b59cd2c16e81e30b41a7ee0f2a3172396952ce1d7676bfc2";
const ENCLAVE_OBJECT_ID = "0xe23314ccdb8b0cb4f2bbdf77a167f8c77e58475cda524af549c614f4b3716dc8";
```

## Frontend

To try it in Testnet, go to https://nautilus-twitter.vercel.app/

To run locally:
```
cd frontend/
pnpm i && pnpm dev
```

An example Twitter identity on Testnet can be viewed [here](https://testnet.suivision.xyz/object/0xe8192c667130a937c855d831c27624f276b226068b2f65a9c0a8d24f41837ffe).

# Nautilus: Verifiable offchain computation on Sui

Nautilus is a framework for **secure and verifiable off-chain computation on Sui**. It allows developers to delegate sensitive or resource-intensive tasks to a self-managed [Trusted Execution Environment (TEE)](https://en.wikipedia.org/wiki/Trusted_execution_environment) while preserving trust on-chain through smart contract-based verification.

Nautilus is designed for hybrid decentralized applications (Dapps) that require private data handling, complex computation, or integration with external (Web2) systems. It ensures that off-chain computations are tamper-resistant, isolated, and cryptographically verifiable. 

The initial release supports **self-managed** [AWS Nitro Enclave TEEs](https://aws.amazon.com/ec2/nitro/nitro-enclaves/). Developers can verify AWS-signed enclave attestations on-chain using Sui smart contracts written in Move.

> [!IMPORTANT]
> Nautilus is available in beta with Sui Testnet. The Mainnet release is yet to be scheduled.

## Features

A Nautilus application consists of two components:

- Offchain server: Runs inside a TEE, like AWS Nitro Enclaves, and performs the actual computation, such as processing user input or executing a scheduled task.
- Onchain smart contract: Written in Move, this contract receives the output and verifies the TEE's attestation before trusting or acting on the data.

> Note: We chose to initially support AWS Nitro Enclaves because of its maturity and reproducibility. We will consider adding more TEE providers in the future.

**How it works**

- Deploy the offchain server to a self-managed TEE, such as AWS Nitro Enclaves. You may or may not use the reproducible build template available in this repo.
- The TEE generates a cryptographic attestation that proves the integrity of the execution environment.
- Sui smart contracts verify the attestation onchain before accepting the TEE output.
- The integrity of the TEE is auditable and anchored by the provider’s root of trust.

> [!IMPORTANT]
> The provided reproducible build template is intended as a starting point for building your own enclave. It is not feature-complete, has not undergone a security audit, and is offered as a modification-friendly reference licensed under the Apache 2.0 license. THE TEMPLATE AND ITS RELATED DOCUMENTATION ARE PROVIDED `AS IS` WITHOUT WARRANTY OF ANY KIND FOR EVALUATION PURPOSES ONLY.
> We encourage you to adapt and extend it to fit your specific use case.

## Use cases

Several Web3 use cases can use Nautilus for trustworthy and verifiable offchain computation. Examples include:

- **Trusted Oracles**: Nautilus could ensure that oracles fetch and process offchain data in a tamper-resistant manner before providing results to a smart contract. The source of external data could be a Web2 service (like weather, sports, betting, asset prices, etc.) or a decentralized storage platform like [Walrus](https://walrus.xyz).
- **AI agents**: Nautilus would be ideal to securely run AI models for inference or execute agentic workflows to produce actionable outcomes, while providing data & model provenance onchain.
- **DePIN solutions**: DePIN (Decentralized Physical Infrastructure) could leverage Nautilus for private data computation in IoT and supply chain networks.
- **Fraud prevention in multi-party systems**: Decentralized exchanges (DEXs) could use Nautilus for order matching and settlement, or layer-2 solutions could prevent collision & fraud by securely running computations between untrusted parties.
- **Identity management**: Solutions in the identity management space that require onchain verifiability for decentralized governance and proof of tamper-resistance, could utilize Nautilus.
- and more…

When used together, Nautilus and [Seal](https://github.com/MystenLabs/seal) enable powerful privacy-preserving use cases by combining secure & verifiable computation with secure key access. A common challenge with TEEs is persisting secret keys across restarts and different machines. Seal can address this by securely storing long-term keys and granting access only to properly attested TEEs. In this model, Nautilus handles computation over the encrypted data, while Seal controls key access. Applications that require a shared encrypted state can use both tools to privately process user requests and update encrypted data on public networks.

## Future plans and non-goals

We plan to expand Nautilus support to additional TEE providers in the future, such as [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) and [AMD SEV](https://www.amd.com/en/developer/sev.html). We welcome feedback from the builder community on which platforms to prioritize, or suggestions for others to consider.

Currently, Nautilus does not aim to provide a readily usable TEE network. Developers are encouraged to deploy and manage their own TEEs for running off-chain Nautilus servers.

## Contact Us
For questions about Nautilus, use case discussions, or integration support, contact the Nautilus team on [Sui Discord](https://discord.com/channels/916379725201563759/1361500579603546223).

## More information 
- [Nautilus Design](Design.md)
- [Using Nautilus](UsingNautilus.md)
- [LICENSE](LICENSE)
