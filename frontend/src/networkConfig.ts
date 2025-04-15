// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const EXAMPLE_PACKAGE_ID = "0x17e5a471c93c034e6a4f7778675f8fd76e672c429e02ce48b5e1cc46d5c66324";
const ENCLAVE_CONFIG_OBJECT_ID = "0x396c98837eefe3f4f0ec33869f879afa4be45f8a0a1ae8c85340b13b52bfaf74";
const ENCLAVE_OBJECT_ID = "0xda3a527fd4db8ba1b1e7f1b2da2273bc227ec9027dcbcb88ecd2162a75d36ade";

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
