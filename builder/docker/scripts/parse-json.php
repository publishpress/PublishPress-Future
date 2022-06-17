<?php
$path = $argv[1];
$property = $argv[2];

/**
 * Parse a json file and returns the content as a string.
 * If the value is an array, returns it separaated by comma.
 *
 * @param string $jsonFilePath
 * @param string $property
 * @return string
 */
function parseJson(string $jsonFilePath, string $property)
{
    $jsonContent = trim(file_get_contents($jsonFilePath));
    $jsonContent = (array)json_decode($jsonContent);

    return isset($jsonContent[$property]) ? $jsonContent[$property] : '';
}

$value = parseJson($path, $property);

if (is_string($value)) {
    echo $value . "\n";
    exit(0);
} elseif (is_array($value)) {
    echo implode(',', $value) . "\n";
    exit(0);
}
