import {
  AssetRecipientChange as AssetRecipientChangeEvent,
  DeltaUpdate as DeltaUpdateEvent,
  FeeUpdate as FeeUpdateEvent,
  NFTWithdrawal as NFTWithdrawalEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SpotPriceUpdate as SpotPriceUpdateEvent,
  TokenDeposit as TokenDepositEvent,
  TokenWithdrawal as TokenWithdrawalEvent,
  WithdrawERC20Call,
  WithdrawERC721Call
} from "../generated/templates/LSSVMPairEnumerableERC20/LSSVMPairEnumerableERC20"
import {
  OwnershipTransferred,
  Pair,
} from "../generated/schema"
import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";
import { arraySubtraction } from "./utilities";

export function handleAssetRecipientChange(
  event: AssetRecipientChangeEvent
): void {
  let pair = (Pair.load(event.address.toHexString())!)
  if (pair) {
    pair.assetRecipient = event.params.a.toHexString()
  }
  pair.save()
}

export function handleDeltaUpdate(event: DeltaUpdateEvent): void {
  let pair = Pair.load(event.address.toHexString())!
  if (pair) {
    pair.delta = event.params.newDelta
  }
  pair.save()
}

export function handleFeeUpdate(event: FeeUpdateEvent): void {
  let pair = (Pair.load(event.address.toHexString())!)
  if (pair) {
    pair.feeMultiplier = event.params.newFee.toBigDecimal().div(BigDecimal.fromString((Math.pow(10, 18)).toString()))
    pair.save()
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let pair = (Pair.load(event.address.toHexString())!)
  if (pair) {
    pair.owner = event.params.newOwner.toHexString()
    pair.save()
  }
}

export function handleSpotPriceUpdate(event: SpotPriceUpdateEvent): void {
  let pair = (Pair.load(event.address.toHexString())!)
  if (pair) {
    pair.spotPrice = event.params.newSpotPrice
    pair.save()
  }
}



export function handleWithdrawERC721(call:WithdrawERC721Call):void{
  let pair = Pair.load(call.inputs.a.toString())!
  pair.nftIdInventory = arraySubtraction(pair.nftIdInventory,call.inputs.nftIds)
  pair.save();
}
export function handleWithdrawERC20(call:WithdrawERC20Call):void{
  let pair = Pair.load(call.inputs.a.toString())!
  pair.liquidity=pair.liquidity.minus(call.inputs.amount)
  pair.save();
}

export function handleTokenDeposit(
  event: TokenDepositEvent
): void {
  let pair = (Pair.load(event.address.toHexString())!)
  pair.liquidity = pair.liquidity.plus(event.params.amount)
  pair.save()
}

export function handleTokenWithdrawal(event: TokenWithdrawalEvent): void {
  let pair = (Pair.load(event.address.toHexString())!)
  pair.liquidity = pair.liquidity.minus(event.params.amount)
  pair.save()
}
