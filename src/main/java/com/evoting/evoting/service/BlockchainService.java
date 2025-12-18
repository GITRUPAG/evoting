package com.evoting.evoting.service;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

import com.evoting.evoting.contract.Voting;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlockchainService {

    @Value("${web3j.client-address}")
    private String blockchainUrl;

    @Value("${blockchain.private-key}")
    private String privateKey;

    @Value("${blockchain.contract-address}")
    private String contractAddress;

    private Web3j web3j;
    private Credentials credentials;
    private Voting contract;

    @PostConstruct
    public void init() {
        try {
            log.info("🔗 Connecting to Ethereum blockchain…");

            web3j = Web3j.build(new HttpService(blockchainUrl));
            credentials = Credentials.create(privateKey);

            log.info("✅ Connected as: {}", credentials.getAddress());

            contract = Voting.load(
                contractAddress,
                web3j,
                credentials,
                new DefaultGasProvider()
            );

            log.info("✅ Smart Contract Loaded: {}", contractAddress);

        } catch (Exception e) {
            log.error("❌ Blockchain init failed", e);
        }
    }

    // -------------------------------------------------------------
    // 1️⃣ CAST VOTE (Correct Signature)
    // -------------------------------------------------------------
    public String castVote(Long electionId, Long candidateId) {
        try {
            TransactionReceipt receipt = contract.castVote(
                    BigInteger.valueOf(electionId),
                    BigInteger.valueOf(candidateId)
            ).send();

            return receipt.getTransactionHash();

        } catch (Exception e) {
            log.error("❌ Blockchain error while casting vote", e);
            return null;
        }
    }

    // -------------------------------------------------------------
    // 2️⃣ GET VOTE COUNT (Correct Signature)
    // -------------------------------------------------------------
    public BigInteger getVotes(Long electionId, Long candidateId) {
        try {
            return contract.getVotes(
                    BigInteger.valueOf(electionId),
                    BigInteger.valueOf(candidateId)
            ).send();

        } catch (Exception e) {
            log.error("❌ Failed to fetch vote count", e);
            return BigInteger.ZERO;
        }
    }

    // -------------------------------------------------------------
    // 3️⃣ CHECK IF VOTER ALREADY VOTED IN THAT ELECTION
    // -------------------------------------------------------------
    public boolean hasAlreadyVoted(Long electionId, String voterEthAddress) {
        try {
            return contract.hasVoted(
                    BigInteger.valueOf(electionId),
                    voterEthAddress
            ).send();

        } catch (Exception e) {
            log.error("❌ Failed to check blockchain vote status", e);
            return false;
        }
    }
}
