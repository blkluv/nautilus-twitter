// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const EXAMPLE_PACKAGE_ID = "0xffe4466f1b98b2834327eb0757823323abed4756d0fe4ddd240dfc91abe3b39d";
const ENCLAVE_CONFIG_OBJECT_ID = "0x4d933a25438f2bf9b59cd2c16e81e30b41a7ee0f2a3172396952ce1d7676bfc2";
const ENCLAVE_OBJECT_ID = "0xe23314ccdb8b0cb4f2bbdf77a167f8c77e58475cda524af549c614f4b3716dc8";

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
