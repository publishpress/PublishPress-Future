<?php


namespace Tests\Unit\MotorLibrary;

use Tests\Support\UnitTester;
use PublishPress\WorkflowMotorLibrary\SignatureManager;

class SignatureManagerCest
{
    const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDocaiWN/8D8QY8
w+ClPq7WAS9ahrp0ayVzdpVBMD5/jrQhRI+4LHNsUG0/7jhgvGm1cVA0La0bckDH
0PyaLTXEejuMOgrlh5yoifUlRof7ZNjBEPaQrOh1sRBPGjRRFPuKbfTkhvq1KfAG
qF5UAZJLGO3KYLmsbho7zIm89ljBGTeAgYlsTSeHaYhycKd4Yb1ZtlQBYSNVVY8K
nhqMUl27IiFLzv6daFitZoTdboWHe51H0yBAxX+SeM3uiZH0x/i+fWfE8XqusNsC
SEdSkNwrMpmQ2Gbxvg1PReyKJUxiwrOaFXHk2zfqSKUwktg7nesceB0LRuJyIKCR
60zJ0UwZAgMBAAECggEAMDdnc6Ww8gXct90f69cpWD4NrxcUdVLGhYF7K3cQ98/H
wMDimR8rYDP8vY6yRiq/OMKFExXIe1GDa4+H3olzRkresFNX8E3lqrZXUkCjs3uz
VLUqmE8tt0Af9HComosiNJBjhMYVGmBVKGRjkMR0rrxAk0LmMQTzzyS6C6cEOSWX
QAU+GhvqeYAOu0H5gYumris62AsnqnjNZjjCtkAm/OBq0Nlwxz5Ga3owu3T28uPS
LTvSvKrXBrIQ7DOx8FlZlo32nJVFIgdq2C4zI2nVMiCKLiQvITtn13nw4GtsJ8hR
AlZjy14c5rXQ9VhR+wvomnfRJHgnoXsro0FKkCI5KQKBgQD1KtWbWjO/7gllJY1S
pH4hjl8b1938Poo+0a9u680ygfTxSptsJ8hgsdqyLe09SKXEjxiNNnHLNaMzs69S
wKLzV1Lesfe+Xao8LTsl1JPfgMVxLlSCSS144D9rPVKOxz3NuLlX9Kma3fVzjdWU
2UkRIxPJztQi/O0nPMkQgnAE9QKBgQDytugG+klzZf6A4pxOAqwP1dAAigpw7G8j
KLTNthDJskDOUpDlmHO7M0jHuRrtY05iK0m/hQnm0ey5kby59o1KU6f3cU2O8leH
5ODHCNvq3JQmuWoBMtnBmjf/ACfubGKjfPt1GFC3q1cqAYyDPjcke2AYcJ1ER95r
vOUJpK7UFQKBgAzuqn/cXTh1lPdJ6M+AL8sTWH7+fw4sOlyf8PIX7CYK5uHHfrVQ
z+gR2ahmdcoyx9O7fJ8OTShb9vTmOIxT7wSJCa0HlDrtc+pitGkFcptqjn+u4vRQ
ad6jbZT5kh5H8kGkydoS5NNve+ARjj+gypLl18hgaZ5C2zujoDOHveL1AoGBAJuI
5GVcTGdby9yx2vIOuk4nePRvgUNd79Y7Bqnwaw+lX+wXcuz+ZeNneNMr5nqLMbat
AMRvL6oviiBcqPEOcvpXY4Koo8ffuoHGBNjm726wzWuHU8vS10I+XnXVlsEtyYP0
2nruCwO4E9JCTdXor5N8UFc5Cz6vQ3QNB0THuJUFAoGAbQry5RjOjKX4g/TnParO
mq1SRIMwE+brjpX9YBBjVOuNamW4Xpl9Q1CjUbSWeD1K0lged5uE6vstcGesbZhm
/g7jv/dldfFDSBi/cLJcMMnxjaPuaEiSvPPSWvLGvJ4ArCJdZJnDWni1Zpy4uH9k
JXsf8dGRPKM7oH82MkbnkKU=
-----END PRIVATE KEY-----";

    const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6HGoljf/A/EGPMPgpT6u
1gEvWoa6dGslc3aVQTA+f460IUSPuCxzbFBtP+44YLxptXFQNC2tG3JAx9D8mi01
xHo7jDoK5YecqIn1JUaH+2TYwRD2kKzodbEQTxo0URT7im305Ib6tSnwBqheVAGS
SxjtymC5rG4aO8yJvPZYwRk3gIGJbE0nh2mIcnCneGG9WbZUAWEjVVWPCp4ajFJd
uyIhS87+nWhYrWaE3W6Fh3udR9MgQMV/knjN7omR9Mf4vn1nxPF6rrDbAkhHUpDc
KzKZkNhm8b4NT0XsiiVMYsKzmhVx5Ns36kilMJLYO53rHHgdC0biciCgketMydFM
GQIDAQAB
-----END PUBLIC KEY-----";

    public function generateKeyPair_arrayPublicPrivatekeys(UnitTester $I)
    {
        $I->wantTo('Generate a new key pair and check the return value is an array with two keys: public and private.');

        $manager = new SignatureManager();

        $keyPair = $manager->generateKeyPair();

        $I->assertIsArray($keyPair);
        $I->assertArrayHasKey('public', $keyPair);
        $I->assertArrayHasKey('private', $keyPair);
        $I->assertNotEmpty($keyPair['public']);
        $I->assertNotEmpty($keyPair['private']);
    }

    // Test the method sign
    public function sign_stringDataAndStringPrivateKey_stringSignature(UnitTester $I)
    {
        $I->wantTo('Sign the given data using the given private key and check the return value is the signature.');

        $manager = new SignatureManager();

        $data = 'This is a test';

        $signature = $manager->sign($data, self::PRIVATE_KEY);

        $I->assertIsString($signature);
        $I->assertNotEmpty($signature);

        $I->assertEquals('zZF5cVWHWSKnvXlPZYVzQDko3T8Oo0zTkw176sGOmUzjO3tCc8uE3LF4lSR/5LuWvtUlmr1oDlZI7bmjOGKCouxNBCyIcC/cg5Vh3Oxrmj5pUaXU8NIJunhcZJBOPP6BSbC2Q29xScisPkUQKkuNXjgGN/rNytprh4V5VA9RaNT3/vfb4tQDnYrCvDk06bWkG/vM/Ygq9BgWl7AfDck+XCyMBw6hLTv/UiUt9oo049dng0+W26WkJET7nme1IdbAsPC4gE2g7QPazZl7Udu5U5zJFZ52Dh+6A7Ikl+7C4OfTPyysH/hS5McTaRSI2SaFpj/7OHU/2UqYSEDDg+dGSA==', $signature);
    }

    public function verify_stringDataStringSignatureAndStringPublicKey_bool(UnitTester $I)
    {
        $I->wantTo('Verify the given signature for the given data using the given public key and check the return value is a boolean.');

        $manager = new SignatureManager();

        $data = 'This is a test';
        $signature = 'zZF5cVWHWSKnvXlPZYVzQDko3T8Oo0zTkw176sGOmUzjO3tCc8uE3LF4lSR/5LuWvtUlmr1oDlZI7bmjOGKCouxNBCyIcC/cg5Vh3Oxrmj5pUaXU8NIJunhcZJBOPP6BSbC2Q29xScisPkUQKkuNXjgGN/rNytprh4V5VA9RaNT3/vfb4tQDnYrCvDk06bWkG/vM/Ygq9BgWl7AfDck+XCyMBw6hLTv/UiUt9oo049dng0+W26WkJET7nme1IdbAsPC4gE2g7QPazZl7Udu5U5zJFZ52Dh+6A7Ikl+7C4OfTPyysH/hS5McTaRSI2SaFpj/7OHU/2UqYSEDDg+dGSA==';

        $result = $manager->verify($data, $signature, self::PUBLIC_KEY);

        $I->assertIsBool($result);
        $I->assertTrue($result, 'The signature is not valid.');
    }

    public function sign_verify(UnitTester $I)
    {
        $I->wantTo('Sign and verify the given data using a new private and public keys and check the return value is true.');

        $manager = new SignatureManager();
        $keyPair = $manager->generateKeyPair();
        $data = 'This is a new test using a different data';

        $signature = $manager->sign($data, $keyPair['private']);
        $result = $manager->verify($data, $signature, $keyPair['public']);

        $I->assertIsBool($result);
        $I->assertTrue($result, 'The signature is not valid.');
    }
}
