// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const EXAMPLE_PACKAGE_ID = "0x71accb3502a116e6138fb563ae0391a2c4939fe45d0405a82d688729bfb8c1e1";
const ENCLAVE_CONFIG_OBJECT_ID = "0xa3e7c6fcc577b8e2ed4b1211487a48e5c2ee6567d220f26f49ff5beb59a6a025";
const ENCLAVE_OBJECT_ID = "0x2448b7084dc1e43f90bd6a2f829954f9e44c235e15f2d2e5a01c3f0ba975e3b0";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        examplePackageId: EXAMPLE_PACKAGE_ID,
        enclaveObjId: ENCLAVE_OBJECT_ID,
        enclaveConfigObjId: ENCLAVE_CONFIG_OBJECT_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
