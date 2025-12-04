package com.evoting.evoting.contract;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

public class Voting extends Contract {

    public static final String BINARY = "YOUR_FULL_BYTECODE_HERE";  // keep as-is

    // ----------------------------------------------------------
    // Constructor
    // ----------------------------------------------------------

    protected Voting(
        String contractAddress,
        Web3j web3j,
        Credentials credentials,
        ContractGasProvider gasProvider
    ) {
        super(BINARY, contractAddress, web3j, credentials, gasProvider);
    }

    protected Voting(
        String contractAddress,
        Web3j web3j,
        TransactionManager txManager,
        ContractGasProvider gasProvider
    ) {
        super(BINARY, contractAddress, web3j, txManager, gasProvider);
    }

    public static Voting load(
        String contractAddress,
        Web3j web3j,
        Credentials credentials,
        ContractGasProvider gasProvider
    ) {
        return new Voting(contractAddress, web3j, credentials, gasProvider);
    }

    // ----------------------------------------------------------
    // Smart Contract Methods
    // ----------------------------------------------------------

    /** castVote(uint256 electionId, uint256 candidateId) */
    public RemoteFunctionCall<TransactionReceipt> castVote(
            BigInteger electionId,
            BigInteger candidateId
    ) {
        final Function function = new Function(
                "castVote",
                Arrays.asList(
                        new Uint256(electionId),
                        new Uint256(candidateId)
                ),
                Collections.emptyList()
        );

        return executeRemoteCallTransaction(function);
    }

    /** getVotes(uint256 electionId, uint256 candidateId) → uint256 */
    public RemoteFunctionCall<BigInteger> getVotes(
            BigInteger electionId,
            BigInteger candidateId
    ) {
        final Function function = new Function(
                "getVotes",
                Arrays.asList(
                        new Uint256(electionId),
                        new Uint256(candidateId)
                ),
                Arrays.asList(new TypeReference<Uint256>() {})
        );

        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    /** hasVoted(uint256 electionId, address voter) → bool */
    public RemoteFunctionCall<Boolean> hasVoted(
            BigInteger electionId,
            String voterEthAddress
    ) {
        final Function function = new Function(
                "hasVoted",
                Arrays.asList(
                        new Uint256(electionId),
                        new Address(voterEthAddress)
                ),
                Arrays.asList(new TypeReference<Bool>() {})
        );

        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }
}
