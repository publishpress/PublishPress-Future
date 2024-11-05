<?php

namespace Publishpress\PpToolkit\Cmd\Pot;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Output\OutputInterface;

class CompareCommand extends Command
{
    /**
     * @var OutputInterface
     */
    protected $output;

    protected function configure(): void
    {
        $this->setName('po:compare')
            ->setHelp('This command allows you to compare two PO/POT files.')
            ->setHidden(false)
            ->addArgument('old', InputArgument::REQUIRED, 'The old PO/POT file')
            ->addArgument('new', InputArgument::REQUIRED, 'The new PO/POT file');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        if ($input->getOption('verbose')) {
            $output->writeln("\n<fg=green>Comparing PO/POT files...</>\n");
        }

        $this->output = $output;
        $this->comparePoFiles($input->getArgument('old'), $input->getArgument('new'));

        return Command::SUCCESS;
    }

    private function comparePoFiles(string $oldPo, string $newPo): bool
    {
        $oldMessages = $this->extractMessages($oldPo);
        $newMessages = $this->extractMessages($newPo);

        if (empty($oldMessages) || empty($newMessages)) {
            $this->output->writeln('<bg=red>No messages found in the PO/POT files</>');
            return false;
        }

        $newTerms = $this->getNewTerms($oldMessages, $newMessages);
        $removedTerms = $this->getRemovedTerms($oldMessages, $newMessages);

        if (empty($newTerms) && empty($removedTerms)) {
            $this->output->writeln('<bg=green>No new or removed terms found in the PO/POT files</>');
            return false;
        }

        if (!empty($newTerms)) {
            $this->outputTerms('New Terms', $newTerms);
        }

        if (!empty($removedTerms)) {
            $this->outputTerms('Removed Terms', $removedTerms);
        }

        $this->outputStatistics($oldMessages, $newMessages, $newTerms, $removedTerms);

        return true;
    }

    private function extractMessages(string $poFile): array
    {
        $isRemoteFile = filter_var($poFile, FILTER_VALIDATE_URL);

        if ($isRemoteFile) {
            // Handle remote file using cURL
            $ch = curl_init($poFile);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => false,
            ]);

            $content = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            if ($content === false || $httpCode !== 200) {
                $error = curl_error($ch);
                curl_close($ch);
                throw new \Exception("Failed to download remote file '{$poFile}'. Error: {$error}");
            }

            curl_close($ch);
        } else {
            if (!file_exists($poFile)) {
                throw new \Exception("Local file '{$poFile}' not found");
            }
            $content = file_get_contents($poFile);
        }

        preg_match_all('/^msgid "(.+)"$/m', $content, $matches);

        $filteredMessages = array_filter($matches[1], function ($msg) {
            return !empty($msg);
        });

        sort($filteredMessages);

        return $filteredMessages;
    }

    private function getNewTerms(array $oldMessages, array $newMessages): array
    {
        return array_diff($newMessages, $oldMessages);
    }

    private function getRemovedTerms(array $oldMessages, array $newMessages): array
    {
        return array_diff($oldMessages, $newMessages);
    }

    private function outputTerms(string $type, array $terms): void
    {
        $this->output->writeln("\n<fg=green>{$type}</>\n");

        foreach ($terms as $term) {
            $this->output->writeln($term);
        }
    }

    private function outputStatistics(array $oldMessages, array $newMessages, array $newTerms, array $removedTerms): void
    {
        $this->output->writeln("\n<fg=green>Statistics</>\n");
        $rows = [
            ['Old terms total', count($oldMessages)],
            ['New terms total', count($newMessages)],
            ['New terms added', count($newTerms)],
            ['Terms removed', count($removedTerms)]
        ];
        $table = new \Symfony\Component\Console\Helper\Table($this->output);
        $table->setHeaders(['Metric', 'Count'])
              ->setRows($rows)
              ->render();
    }
}
