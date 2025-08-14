// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

// see artifacts registered in 
const APP_PACKAGE_ID = "0x652875162b566bb04187c76f93215e56c28aa05487393056279e331598ba4978";
const ENCLAVE_CONFIG_OBJECT_ID = "0xe33641a2dae5eb4acad3859e603ec4e25641af05f837c85058645c7d8d9d831a";
const ENCLAVE_OBJECT_ID = "0x53db077721140910697668f9b2ee80fbecd104ac076d60fc1fb49ae57cd96c0d";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        appPackageId: APP_PACKAGE_ID,
        enclaveObjId: ENCLAVE_OBJECT_ID,
        enclaveConfigObjId: ENCLAVE_CONFIG_OBJECT_ID,
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
