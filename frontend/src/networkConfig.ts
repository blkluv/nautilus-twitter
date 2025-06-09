// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const EXAMPLE_PACKAGE_ID = "0xc0c1b892b4db559625c0bb540fa15a243a65ccaa5584e379ed0361cf3027297b";
const ENCLAVE_CONFIG_OBJECT_ID = "0xe13cbe215b1b63b7aa4a41d5cf3b5ede1ae0cb1c50bb66d42673c51971da8322";
const ENCLAVE_OBJECT_ID = "0xb2d9fbb9159f1e30f2b590346ca16b0d3401899476ecd3f4723531e1fc078b17";

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
