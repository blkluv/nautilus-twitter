# Nautilus Twitter: An application built with Nautilus

This example application is based on the [Nautilus reproducible build template](https://github.com/MystenLabs/nautilus), with several modifications to support a specific use case. Key modifications are:

1. `allowed_endpoints.yaml` - Updated before running `configure_enclave.sh` to allow access to `api.twitter.com`, which is required for the enclave to fetch Twitter data.
2. Enclave Logic (`/src/nautilus-server/app.rs`) - The `process_data` endpoint is modified to call the Twitter API and fetch either a Twitter profile or a tweet containing a Sui address followed by `#SUI`. If valid, it generates a signature over the address and Twitter handle.
3. Observability - `metrics.rs` is included for optional metrics collection. 
4. Move Smart Contract (`/move/app`) - Verifies the payload containing the Twitter handle and transaction sender against the signature, and mints an NFT if valid.
5. Frontend (`/frontend`) - Contains the UI logic that interacts with both the enclave and the Move smart contract.

> [!Note]
> To run this example, you’ll need a [Twitter Developer account](https://developer.x.com) and a Bearer token. When prompted during the execution of `configure_enclave.sh`, store the token using [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html).

> [!Note]
> For full product details, see the [Nautilus documentation](https://docs.sui.io/concepts/cryptography/nautilus).

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
PCR0=2e972da95ea76ea9d8685a842c3ae9815c1d12361f8f1b83f593723db84003bfd17cb7a8f7c024529005fb2d051fe162
PCR1=2e972da95ea76ea9d8685a842c3ae9815c1d12361f8f1b83f593723db84003bfd17cb7a8f7c024529005fb2d051fe162
PCR2=21b9efbc184807662e966d34f390821309eeac6802309798826296bf3e8bec7c10edb30948c90ba67310f7b964fc500a
```

## Register the enclave onchain

Follow the [Nautilus guide](UsingNautilus.md#register-the-enclave-onchain). 

```
MODULE_NAME=twitter
OTW_NAME=TWITTER

# replace with your registered enclave
EXAMPLES_PACKAGE_ID=0xc0c1b892b4db559625c0bb540fa15a243a65ccaa5584e379ed0361cf3027297b
ENCLAVE_PACKAGE_ID=0xddd58ea9795270f3cb4fe75b55c3f69e182c270f2dff783ef8c489a8282c35ac
CAP_OBJECT_ID=0xcae6faa354249fc450a3b4c84471cddd37280fd01a17b387a4fda3c2b3b80041
ENCLAVE_CONFIG_OBJECT_ID=0xe13cbe215b1b63b7aa4a41d5cf3b5ede1ae0cb1c50bb66d42673c51971da8322
ENCLAVE_OBJECT_ID=0xb2d9fbb9159f1e30f2b590346ca16b0d3401899476ecd3f4723531e1fc078b17

# replace with your own enclave IP
ENCLAVE_URL=http://<PUBLIC_IP>:3000
```

You can view an example of an enclave config object containing PCRs [here](https://testnet.suivision.xyz/object/0xe13cbe215b1b63b7aa4a41d5cf3b5ede1ae0cb1c50bb66d42673c51971da8322). Also you can view an example of an enclave object containing the enclave public key [here](https://testnet.suivision.xyz/object/0xb2d9fbb9159f1e30f2b590346ca16b0d3401899476ecd3f4723531e1fc078b17).

Then update the following in `frontend/src/networkConfig.ts` for frontend. 

```typescript
const EXAMPLE_PACKAGE_ID = "0xc0c1b892b4db559625c0bb540fa15a243a65ccaa5584e379ed0361cf3027297b";
const ENCLAVE_CONFIG_OBJECT_ID = "0xe13cbe215b1b63b7aa4a41d5cf3b5ede1ae0cb1c50bb66d42673c51971da8322";
const ENCLAVE_OBJECT_ID = "0xb2d9fbb9159f1e30f2b590346ca16b0d3401899476ecd3f4723531e1fc078b17";
```

## Frontend

To try it in Testnet, go to https://nautilus-twitter.vercel.app/

To run locally:
```
cd frontend/
pnpm i && pnpm dev
```

An example Twitter identity on Testnet can be viewed [here](https://testnet.suivision.xyz/object/0xe8192c667130a937c855d831c27624f276b226068b2f65a9c0a8d24f41837ffe).
