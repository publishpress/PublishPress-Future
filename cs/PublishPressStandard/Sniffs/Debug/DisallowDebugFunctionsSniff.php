<?php

namespace PublishPressStandard\Sniffs\Debug;

use PHP_CodeSniffer\Sniffs\Sniff;
use \PHP_CodeSniffer\Files\File;

class DisallowDebugFunctionsSniff implements Sniff
{
    /**
     * Check Ray reference.
     *
     * @var array
     * @see https://spatie.be/docs/ray/v1/usage/reference
     */
    private $disallowedFunctions = [
        'ray' => 'FoundRayFunction',
        'rd'  => 'FoundRdFunction',
        'dd' => 'FoundDdFunction',
        'dump' => 'FoundDumpFunction',
        'var_dump' => 'FoundVarDumpFunction',
    ];

    /**
     * Registers the tokens that this sniff wants to listen for.
     *
     * An example return value for a sniff that wants to listen for whitespace
     * and any comments would be:
     *
     * <code>
     *    return array(
     *            T_WHITESPACE,
     *            T_DOC_COMMENT,
     *            T_COMMENT,
     *           );
     * </code>
     *
     * @return mixed[]
     * @see    Tokens.php
     */
    public function register()
    {
        return [
            T_STRING,
        ];
    }

    /**
     * Called when one of the token types that this sniff is listening for
     * is found.
     *
     * The stackPtr variable indicates where in the stack the token was found.
     * A sniff can acquire information about this token, along with all the other
     * tokens within the stack by first acquiring the token stack:
     *
     * <code>
     *    $tokens = $phpcsFile->getTokens();
     *    echo 'Encountered a '.$tokens[$stackPtr]['type'].' token';
     *    echo 'token information: ';
     *    print_r($tokens[$stackPtr]);
     * </code>
     *
     * If the sniff discovers an anomaly in the code, they can raise an error
     * by calling addError() on the \PHP_CodeSniffer\Files\File object, specifying an error
     * message and the position of the offending token:
     *
     * <code>
     *    $phpcsFile->addError('Encountered an error', $stackPtr);
     * </code>
     *
     * @param \PHP_CodeSniffer\Files\File $phpcsFile The PHP_CodeSniffer file where the
     *                                               token was found.
     * @param int                         $stackPtr  The position in the PHP_CodeSniffer
     *                                               file's token stack where the token
     *                                               was found.
     *
     * @return void|int Optionally returns a stack pointer. The sniff will not be
     *                  called again on the current file until the returned stack
     *                  pointer is reached. Return (count($tokens) + 1) to skip
     *                  the rest of the file.
     */
    public function process(File $phpcsFile, $stackPtr)
    {
        $tokens = $phpcsFile->getTokens();

        // Only continue if there is a next token.
        if (! isset($tokens[$stackPtr + 1])) {
            return;
        }

        $token = $tokens[$stackPtr];
        $nextToken = $tokens[$stackPtr + 1];

        if (array_key_exists($token['content'], $this->disallowedFunctions) && $nextToken['type'] === 'T_OPEN_PARENTHESIS') {
            $error = 'Debug functions are prohibited on production. Found "%s"';
            $data  = [trim($token['content'])];

            $phpcsFile->addError($error, $stackPtr, $this->disallowedFunctions[$token['content']], $data);
        }
    }
}
