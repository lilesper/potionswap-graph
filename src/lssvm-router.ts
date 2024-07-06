import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import {
  SwapETHForSpecificNFTsCall,
  RobustSwapETHForSpecificNFTsCall,
  SwapERC20ForSpecificNFTsCall,
  RobustSwapERC20ForSpecificNFTsCall,
  SwapERC20ForAnyNFTsCall,
  SwapETHForAnyNFTsCall,
  RobustSwapNFTsForTokenCall,
  RobustSwapERC20ForAnyNFTsCall,
  RobustSwapERC20ForSpecificNFTsAndNFTsToTokenCall,
  RobustSwapETHForAnyNFTsCall,
  RobustSwapETHForSpecificNFTsAndNFTsToTokenCall,
  SwapNFTsForAnyNFTsThroughERC20Call,
  SwapNFTsForAnyNFTsThroughETHCall,
  SwapNFTsForSpecificNFTsThroughERC20Call,
  SwapNFTsForTokenCall,
} from "../generated/LSSVMRouter/LSSVMRouter";
import { Swap, Pair } from "../generated/schema";
import {
  arrayAddition,
  arraySubtraction,
  arrayTrim,
  arrayTrimed,
  returnNonNullBigInt,
  timesBigDecimal,
} from "./utilities";

export function handleSwapETHForSpecificNFTs(
  call: SwapETHForSpecificNFTsCall
): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.nftIds = call.inputs.swapList[i].nftIds.toString();
    pair.nftIdInventory = arraySubtraction(
      pair.nftIdInventory,
      call.inputs.swapList[i].nftIds
    );
    swap.price = pair.spotPrice;
    swap.txHash = call.transaction.hash.toHexString();
    swap.tokenRecipient = call.inputs.ethRecipient.toHexString();
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    pair.save();
    swap.nft = pair.nft;
    swap.token = pair.erc20Contract;
    swap.timestamp = call.block.timestamp;
    swap.save();
  }
}
export function handleSwapERC20ForSpecificNFTs(
  call: SwapERC20ForSpecificNFTsCall
): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    pair.nftIdInventory = arraySubtraction(
      pair.nftIdInventory,
      call.inputs.swapList[i].nftIds
    );
    swap.token = pair.erc20Contract;
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    swap.nftIds = call.inputs.swapList[i].nftIds.toString();
    swap.txHash = call.transaction.hash.toHexString();
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.from.toHexString();
    swap.nft = pair.nft;
    swap.price = pair.spotPrice;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}

export function handleRobustSwapETHForSpecificNFTs(
  call: RobustSwapETHForSpecificNFTsCall
): void {
  let pair = Pair.load(call.inputs.swapList[0].swapInfo.pair.toHexString())!;
  pair.liquidity = pair.liquidity.plus(call.transaction.value);
  pair.save();
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].swapInfo.pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].swapInfo.pair.toHexString();
    swap.nftIds = call.inputs.swapList[i].swapInfo.nftIds.toString();
    swap.cost = call.inputs.swapList[i].maxCost;
    swap.txHash = call.transaction.hash.toHexString();
    let pair = Pair.load(swap.pair)!;
    pair.nftIdInventory = arraySubtraction(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.nftIds
    );
    swap.token = pair.erc20Contract;
    swap.price = pair.spotPrice;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.from.toHexString();
    pair.save();
    swap.nft = pair.nft;

    swap.timestamp = call.block.timestamp;
    swap.save();
  }
}

export function handleRobustSwapNFTsForToken(
  call: RobustSwapNFTsForTokenCall
): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].swapInfo.pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].swapInfo.pair.toHexString();
    swap.nftIds = call.inputs.swapList[i].swapInfo.nftIds.toString();
    swap.cost = call.inputs.swapList[i].minOutput;
    swap.txHash = call.transaction.hash.toHexString();
    let pair = Pair.load(swap.pair)!;
    pair.liquidity = pair.liquidity.minus(call.inputs.swapList[i].minOutput);
    pair.nftIdInventory = arrayAddition(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.nftIds
    );
    swap.token = pair.erc20Contract;
    swap.price = pair.spotPrice;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.from.toHexString();
    pair.save();
    swap.nft = pair.nft;

    swap.timestamp = call.block.timestamp;
    swap.save();
  }
}

export function handleRobustSwapERC20ForSpecificNFTs(
  call: RobustSwapERC20ForSpecificNFTsCall
): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].swapInfo.pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].swapInfo.pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.nftIds = call.inputs.swapList[i].swapInfo.nftIds.toString();
    pair.nftIdInventory = arraySubtraction(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.nftIds
    );
    pair.liquidity = pair.liquidity.plus(call.inputs.inputAmount);
    swap.cost = BigInt.fromString("0");
    swap.txHash = call.transaction.hash.toHexString();
    swap.price = pair.spotPrice;
    swap.token = pair.erc20Contract;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    swap.nft = pair.nft;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}

export function handleSwapERC20ForAnyNFTs(call: SwapERC20ForAnyNFTsCall): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    pair.liquidity = pair.liquidity.plus(call.inputs.inputAmount);
    pair.nftIdInventory = arrayTrim(
      pair.nftIdInventory,
      call.inputs.swapList[i].numItems
    );
    swap.nftIds = arrayTrimed(
      pair.nftIdInventory,
      call.inputs.swapList[i].numItems
    ).toString();
    swap.cost = BigInt.fromString("0");
    swap.txHash = call.transaction.hash.toHexString();
    swap.price = pair.spotPrice;
    swap.token = pair.erc20Contract;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    swap.nft = pair.nft;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}
export function handleSwapETHForAnyNFTs(call: SwapETHForAnyNFTsCall): void {
  let pair = Pair.load(call.inputs.swapList[0].pair.toHexString())!;
  pair.liquidity = pair.liquidity.plus(call.transaction.value);
  pair.save();

  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.nftIds = arrayTrimed(
      pair.nftIdInventory,
      call.inputs.swapList[i].numItems
    ).toString();
    pair.nftIdInventory = arrayTrim(
      pair.nftIdInventory,
      call.inputs.swapList[i].numItems
    );
    swap.cost = call.transaction.value;
    swap.txHash = call.transaction.hash.toHexString();
    swap.price = pair.spotPrice;
    swap.token = pair.erc20Contract;
    swap.nft = pair.nft;
    swap.tokenRecipient = call.inputs.ethRecipient.toHexString();
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    swap.nft = pair.nft;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}

export function handleRobustSwapERC20ForAnyNFTs(
  call: RobustSwapERC20ForAnyNFTsCall
): void {
  let pair = Pair.load(call.inputs.swapList[0].swapInfo.pair.toHexString())!;
  pair.liquidity = pair.liquidity.plus(call.inputs.inputAmount);
  pair.save();

  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].swapInfo.pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].swapInfo.pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.nftIds = arrayTrimed(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.numItems
    ).toString();
    pair.nftIdInventory = arrayTrim(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.numItems
    );
    swap.cost = call.inputs.inputAmount;
    swap.txHash = call.transaction.hash.toHexString();
    swap.price = pair.spotPrice;
    swap.token = pair.erc20Contract;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    swap.nft = pair.nft;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}

export function handleRobustSwapERC20ForSpecificNFTsAndNFTsToToken(
  call: RobustSwapERC20ForSpecificNFTsAndNFTsToTokenCall
): void {}

export function handleRobustSwapETHForAnyNFTs(
  call: RobustSwapETHForAnyNFTsCall
): void {
  let pair = Pair.load(call.inputs.swapList[0].swapInfo.pair.toHexString())!;
  pair.liquidity = pair.liquidity.plus(call.transaction.value);
  pair.save();

  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].swapInfo.pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].swapInfo.pair.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.nftIds = arrayTrimed(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.numItems
    ).toString();
    pair.nftIdInventory = arrayTrimed(
      pair.nftIdInventory,
      call.inputs.swapList[i].swapInfo.numItems
    );
    swap.cost = call.transaction.value;
    swap.txHash = call.transaction.hash.toHexString();
    swap.price = pair.spotPrice;
    swap.token = pair.erc20Contract;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.inputs.nftRecipient.toHexString();
    swap.nft = pair.nft;
    swap.timestamp = call.block.timestamp;
    swap.save();
    pair.save();
  }
}

export function handleRobustSwapETHForSpecificNFTsAndNFTsToToken(
  call: RobustSwapETHForSpecificNFTsAndNFTsToTokenCall
): void {}

export function handleSwapNFTsForAnyNFTsThroughERC20(
  call: SwapNFTsForAnyNFTsThroughERC20Call
): void {}

export function handleSwapNFTsForAnyNFTsThroughETH(
  call: SwapNFTsForAnyNFTsThroughETHCall
): void {}

export function handleSwapNFTsForSpecificNFTsThroughERC20(
  call: SwapNFTsForSpecificNFTsThroughERC20Call
): void {}

export function handleSwapNFTsForSpecificNFTsThroughETH(
  call: SwapNFTsForAnyNFTsThroughETHCall
): void {}

export function handleSwapNFTsForToken(call: SwapNFTsForTokenCall): void {
  for (let i = 0; i < call.inputs.swapList.length; i++) {
    let swap = new Swap(
      call.inputs.swapList[i].pair.toHexString() +
        "-" +
        call.transaction.hash.toHexString()
    );
    swap.pair = call.inputs.swapList[i].pair.toHexString();
    swap.nftIds = call.inputs.swapList[i].nftIds.toString();
    swap.txHash = call.transaction.hash.toHexString();
    let pair = Pair.load(swap.pair)!;
    swap.cost = pair.spotPrice.times(
      BigInt.fromString(swap.nftIds.length.toString())
    );
    swap.nftIds = call.inputs.swapList[i].nftIds.toString();
    pair.nftIdInventory = arrayAddition(
      pair.nftIdInventory,
      call.inputs.swapList[i].nftIds
    );
    swap.token = pair.erc20Contract;
    swap.price = pair.spotPrice;
    swap.nft = pair.nft;
    swap.tokenRecipient = pair.assetRecipient;
    swap.nftRecipient = call.from.toHexString();
    pair.save();
    swap.nft = pair.nft;

    swap.timestamp = call.block.timestamp;
    swap.save();
  }
}
