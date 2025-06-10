// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const EXAMPLE_PACKAGE_ID = "0xc0c1b892b4db559625c0bb540fa15a243a65ccaa5584e379ed0361cf3027297b";
const ENCLAVE_CONFIG_OBJECT_ID = "0xe13cbe215b1b63b7aa4a41d5cf3b5ede1ae0cb1c50bb66d42673c51971da8322";
const ENCLAVE_OBJECT_ID = "0xcaf02353da4dee02156fa77ac9f189fb5416e64b8d5433d2d61e1fb6307c790e";

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
