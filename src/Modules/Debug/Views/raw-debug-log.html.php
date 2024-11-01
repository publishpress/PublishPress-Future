<?php
header('Content-Type: text/plain');

$results = $this->logger->fetchAll();
$totalLogs = $this->logger->getTotalLogs();
$logSizeInBytes = $this->logger->getLogSizeInBytes();

if (empty($results)) {
    echo 'No results found';
}

echo sprintf(
    'Total logs: %d, Log size: %s',
    $totalLogs,
    PostExpirator_Util::formatBytes($logSizeInBytes)
);
echo "\n\n";

foreach ($results as $result) {
    echo $result['timestamp'] . ': ' . $result['message'] . "\n";
}
