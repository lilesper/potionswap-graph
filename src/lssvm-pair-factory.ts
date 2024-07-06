import { BigDecimal, BigInt } from "@graphprotocol/graph-ts"
// import { decodeEthFunctionInputs } from "./helpers"
import {
  LSSVMPairFactory,
  BondingCurveStatusUpdate as BondingCurveStatusUpdateEvent,
  CallTargetStatusUpdate,
  NFTDeposit as NFTDepositEvent,
  NewPair as NewPairEvent,
  OwnershipTransferred,
  ProtocolFeeMultiplierUpdate,
  ProtocolFeeRecipientUpdate,
  RouterStatusUpdate,
  TokenDeposit as TokenDepositEvent,
  CreatePairETHCall,
  CreatePairERC20Call,
  DepositNFTsCall
} from "../generated/LSSVMPairFactory/LSSVMPairFactory"
import {  Pair,ProtocolFeeMultiplier, NFTDeposit, TokenDeposit } from "../generated/schema"
import { LSSVMPairEnumerableETH } from "../generated/templates"
import { arrayAddition, plusBigInt } from "./utilities"

export function handleDepositNFTs(call:DepositNFTsCall):void{
  let pair=Pair.load(call.to.toHexString())!  
  
  pair.nftIdInventory=  pair.nftIdInventory = arrayAddition(pair.nftIdInventory,call.inputs.ids)
  pair.save()
}

export function handleCreatePairETH(
  event: CreatePairETHCall
): void {
  let newPair = new Pair(event.transaction.hash.toHexString())
  newPair.nft = event.inputs._nft.toHexString()
  newPair.bondingCurveAddress = event.inputs._bondingCurve.toHexString()
  newPair.assetRecipient = event.inputs._assetRecipient.toHexString()
  newPair.poolType = BigInt.fromI32(event.inputs._poolType)
  newPair.delta = event.inputs._delta
  newPair.feeMultiplier = event.inputs._fee.toBigDecimal().div(BigDecimal.fromString((Math.pow(10, 18)).toString()))
  newPair.spotPrice = event.inputs._spotPrice
  newPair.nftIdInventory = event.inputs._initialNFTIDs
  newPair.liquidity = event.transaction.value
  newPair.owner = event.from.toHexString()
  newPair.erc20Contract = "fantom"
  newPair.id = event.outputs.pair.toHexString()
  newPair.createdTx = event.transaction.hash.toHexString()
  newPair.save()
}


export function handleCreatePairERC20(
  event: CreatePairERC20Call
): void {
  // todo: initial and current pair attributes/counts
  let newPair = new Pair(event.transaction.hash.toHexString())
  newPair.nft = event.inputs.params.nft.toHexString()
  newPair.bondingCurveAddress = event.inputs.params.bondingCurve.toHexString()
  newPair.assetRecipient = event.inputs.params.assetRecipient.toHexString()
  newPair.poolType = BigInt.fromI32(event.inputs.params.poolType)
  newPair.delta = event.inputs.params.delta
  newPair.feeMultiplier = event.inputs.params.fee.toBigDecimal().div(BigDecimal.fromString((Math.pow(10, 18)).toString()))
  newPair.spotPrice = event.inputs.params.spotPrice
  newPair.nftIdInventory = event.inputs.params.initialNFTIDs
  newPair.liquidity = event.inputs.params.initialTokenBalance
  newPair.erc20Contract = event.inputs.params.token.toHexString()
  newPair.owner = event.from.toHexString()
  newPair.id = event.outputs.pair.toHexString()
  newPair.createdTx = event.transaction.hash.toHexString()
  newPair.save()
}

export function handleBondingCurveStatusUpdate(
  event: BondingCurveStatusUpdateEvent
): void { }


