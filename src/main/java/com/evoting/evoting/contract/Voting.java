package com.evoting.evoting.contract;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

public class Voting extends Contract {

    // ✅ FULL BYTECODE NEEDED FOR DEPLOY/LOAD
    public static final String BINARY =
            "608060405234801561001057600080fd5b506106d7806100206000396000f3fe6080604052348015610010"
            + "57600080fd5b506004361061004c5760003560e01c806309eef43e14610051578063805265e51461008157"
            + "80639cc2d993146100b1578063b99ef1fa146100cd575b600080fd5b61006b600480360381019061006691"
            + "906102ff565b6100fd565b6040516100789190610347565b60405180910390f35b61009b60048036038101"
            + "9061009691906104a8565b61011d565b6040516100a8919061050a565b60405180910390f35b6100cb6004"
            + "8036038101906100c691906104a8565b610144565b005b6100e760048036038101906100e291906104a856"
            + "5b61025f565b6040516100f4919061050a565b60405180910390f35b600160205280600052604060002060"
            + "00915054906101000a900460ff1681565b6000808260405161012e9190610596565b908152602001604051"
            + "8091039020549050919050565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffff"
            + "ffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a90"
            + "0460ff16156101d1576040517f08c379a00000000000000000000000000000000000000000000000000000"
            + "000081526004016101c89061060a565b60405180910390fd5b6000816040516101e19190610596565b9081"
            + "526020016040518091039020600081548092919061020090610659565b919050555060018060003373ffff"
            + "ffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260"
            + "200190815260200160002060006101000a81548160ff02191690831515021790555050565b600081805160"
            + "2081018201805184825260208301602085012081835280955050505050506000915090505481565b600060"
            + "4051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050"
            + "919050565b60006102cc826102a1565b9050919050565b6102dc816102c1565b81146102e757600080fd5b"
            + "50565b6000813590506102f9816102d3565b92915050565b60006020828403121561031557610314610297"
            + "565b5b6000610323848285016102ea565b91505092915050565b60008115159050919050565b6103418161"
            + "032c565b82525050565b600060208201905061035c6000830184610338565b92915050565b600080fd5b60"
            + "0080fd5b6000601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000"
            + "00000000000000000000600052604160045260246000fd5b6103b58261036c565b810181811067ffffffff"
            + "ffffffff821117156103d4576103d361037d565b5b80604052505050565b60006103e761028d565b90506103"
            + "f382826103ac565b919050565b600067ffffffffffffffff8211156104135761041261037d565b5b61041c82"
            + "61036c565b9050602081019050919050565b82818337600083830152505050565b600061044b6104468461"
            + "03f8565b6103dd565b90508281526020810184848401111561046757610466610367565b5b61047284828561"
            + "0429565b509392505050565b600082601f83011261048f5761048e610362565b5b813561049f848260208601"
            + "610438565b91505092915050565b6000602082840312156104be576104bd610297565b5b600082013567ffff"
            + "ffffffffffffffffffff8111156104dc576104db61029c565b5b6104e88482850161047a565b915050929150"
            + "50565b6000819050919050565b610504816104f1565b82525050565b600060208201905061051f6000830184"
            + "6104fb565b92915050565b600081519050919050565b600081905092915050565b60005b8381101561055957"
            + "808201518184015260208101905061053e565b60008484015250505050565b600061057082610525565b6105"
            + "7a8185610530565b935061058a81856020860161053b565b80840191505092915050565b60006105a2828461"
            + "0565565b915081905092915050565b600082825260208201905092915050565b7f596f7520616c7265616479"
            + "20766f74656421000000000000000000000000000000600082015250565b60006105f46012836105ad565b91"
            + "506105ff826105be565b602082019050919050565b60006020820190508181036000830152610623816105e7"
            + "565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000006000"
            + "52601160045260246000fd5b6000610664826104f1565b91507fffffffffffffffffffffffffffffffffffff"
            + "ffffffffffffffffffffffff82036106965761069561062a565b5b60018201905091905056fea2646970667358"
            + "2212206438708d0704ea750231ed45bdfc19123cca926b162f27304d932ad862065d2364736f6c6343000818"
            + "0033";

    // ✅ Constructor
    protected Voting(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider gasProvider) {
        super(BINARY, contractAddress, web3j, credentials, gasProvider);
    }

    protected Voting(String contractAddress, Web3j web3j, TransactionManager txManager, ContractGasProvider gasProvider) {
        super(BINARY, contractAddress, web3j, txManager, gasProvider);
    }

    // ✅ Load deployed contract
    public static Voting load(String contractAddress, Web3j web3j, Credentials credentials, ContractGasProvider gasProvider) {
        return new Voting(contractAddress, web3j, credentials, gasProvider);
    }

    // ✅ castVote(string)
    public RemoteFunctionCall<TransactionReceipt> castVote(String candidate) {
        final Function function = new Function(
                "castVote",
                Arrays.asList(new Utf8String(candidate)),
                Collections.emptyList()
        );
        return executeRemoteCallTransaction(function);
    }

    // ✅ getVotes(string) : uint256
    public RemoteFunctionCall<BigInteger> getVotes(String candidate) {
        final Function function = new Function(
                "getVotes",
                Arrays.asList(new Utf8String(candidate)),
                Arrays.asList(new TypeReference<Uint256>() {})
        );
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    // ✅ hasVoted(address) : bool
    public RemoteFunctionCall<Boolean> hasVoted(String address) {
        final Function function = new Function(
                "hasVoted",
                Arrays.asList(new Address(address)),
                Arrays.asList(new TypeReference<Bool>() {})
        );
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }
}
