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
PCR0=ed6b72cc4bb7e617ee9c9bf29037b1d261bb61319589dc26d53371c124b025088964e6cd4a09bca1516780bed9e454bb
PCR1=ed6b72cc4bb7e617ee9c9bf29037b1d261bb61319589dc26d53371c124b025088964e6cd4a09bca1516780bed9e454bb
PCR2=21b9efbc184807662e966d34f390821309eeac6802309798826296bf3e8bec7c10edb30948c90ba67310f7b964fc500a
```

## Register the enclave onchain

Follow the [Nautilus guide](UsingNautilus.md#register-the-enclave-onchain). 

```
MODULE_NAME=twitter
OTW_NAME=TWITTER

# replace with your registered enclave
ENCLAVE_PACKAGE_ID=0x23070079c75f181733857719423ef4dec563547882ba75dfae923d9c40c6fa73
CAP_OBJECT_ID=0x3d478a0ad04bc2d562a68f4a669c592d06c30cee245e6d0b446bc78e42dbefa6
ENCLAVE_CONFIG_OBJECT_ID=0xa3e7c6fcc577b8e2ed4b1211487a48e5c2ee6567d220f26f49ff5beb59a6a025
EXAMPLES_PACKAGE_ID=0x71accb3502a116e6138fb563ae0391a2c4939fe45d0405a82d688729bfb8c1e1
ENCLAVE_OBJECT_ID=0x2448b7084dc1e43f90bd6a2f829954f9e44c235e15f2d2e5a01c3f0ba975e3b0

# replace with your own enclave IP
ENCLAVE_URL=http://<PUBLIC_IP>:3000
```

You can view an example of an enclave config object containing PCRs [here](https://testnet.suivision.xyz/object/0xa3e7c6fcc577b8e2ed4b1211487a48e5c2ee6567d220f26f49ff5beb59a6a025). Also you can view an example of an enclave object containing the enclave public key [here](https://testnet.suivision.xyz/object/0x2448b7084dc1e43f90bd6a2f829954f9e44c235e15f2d2e5a01c3f0ba975e3b0).

Then update the following in `frontend/src/networkConfig.ts` for frontend. 

```typescript
const EXAMPLE_PACKAGE_ID = "0x71accb3502a116e6138fb563ae0391a2c4939fe45d0405a82d688729bfb8c1e1";
const ENCLAVE_CONFIG_OBJECT_ID = "0xa3e7c6fcc577b8e2ed4b1211487a48e5c2ee6567d220f26f49ff5beb59a6a025";
const ENCLAVE_OBJECT_ID = "0x2448b7084dc1e43f90bd6a2f829954f9e44c235e15f2d2e5a01c3f0ba975e3b0";
```

## Frontend

To try it in Testnet, go to https://nautilus-twitter.vercel.app/

To run locally:
```
cd frontend/
pnpm i && pnpm dev
```

An example Twitter identity on Testnet can be viewed [here](https://testnet.suivision.xyz/object/0xe8192c667130a937c855d831c27624f276b226068b2f65a9c0a8d24f41837ffe).
