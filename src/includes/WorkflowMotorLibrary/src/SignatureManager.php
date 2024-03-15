<?php

namespace PublishPress\WorkflowMotorLibrary;

class SignatureManager implements SignatureManagerInterface
{
    const PRIVATE_KEY_TYPE = OPENSSL_KEYTYPE_RSA;

    const SIGNATURE_ALGORITHM = OPENSSL_ALGO_SHA256;

    public function generateKeyPair(): array
    {
        $res = openssl_pkey_new([
            'private_key_bits' => 2048,
            'private_key_type' => self::PRIVATE_KEY_TYPE,
        ]);

        openssl_pkey_export($res, $privateKey);

        $publicKey = openssl_pkey_get_details($res);

        return [
            'public' => $publicKey['key'],
            'private' => $privateKey
        ];
    }

    public function sign(string $data, string $privateKey): string
    {
        openssl_sign($data, $signature, $privateKey, self::SIGNATURE_ALGORITHM);

        return base64_encode($signature);
    }

    public function verify(string $data, string $signature, string $publicKey): bool
    {
        return openssl_verify($data, base64_decode($signature), $publicKey, self::SIGNATURE_ALGORITHM);
    }
}
