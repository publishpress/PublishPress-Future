<?php

namespace PublishPress\WorkflowMotorLibrary;

interface SignatureManagerInterface
{
    /**
     * Generate a new key pair. The return value is an array with two keys: 'public' and 'private'.
     *
     * @return array
     */
    public function generateKeyPair(): array;

    /**
     * Sign the given data using the given private key. It returns the signature encoded as base64.
     *
     * @param string $data
     * @param string $privateKey
     * @return string
     */
    public function sign(string $data, string $privateKey): string;

    /**
     * Verify the given signature (base64 encoded) for the given data using the given public key. It returns true if the signature is
     * valid, false otherwise.
     *
     * @param string $data
     * @param string $signature
     * @param string $publicKey
     * @return bool
     */
    public function verify(string $data, string $signature, string $publicKey): bool;
}
