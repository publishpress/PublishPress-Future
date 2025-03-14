<?php

namespace Tests\Modules\Workflows\Domain\Engine\RuntimeVariablesHelpers;

use PublishPress\Future\Framework\System\DateTimeHandlerInterface;
use PublishPress\Future\Modules\Workflows\Domain\Engine\RuntimeVariablesHelpers\DateHelper;
use lucatume\WPBrowser\TestCase\WPTestCase;

class DateHelperTest extends WPTestCase
{
    /**
     * @var \IntegrationTester
     */
    protected $tester;

    /**
     * @var DateTimeHandlerInterface
     */
    private $dateTimeHandler;

    public function setUp(): void
    {
        parent::setUp();

        $this->dateTimeHandler = $this->createMock(DateTimeHandlerInterface::class);
        $this->dateTimeHandler->method('getDateTimeFormat')->willReturn('F j, Y');
        $this->dateTimeHandler->method('getTimeFormat')->willReturn('g:i a');
        $this->dateTimeHandler->method('getCalculatedTimeWithOffset')
            ->willReturnCallback(function ($timestamp, $offset) {
                if ($offset === '+1 day') {
                    return $timestamp + 86400;
                }

                if ($offset === '-1 hour') {
                    return $timestamp - 3600;
                }

                return $timestamp;
        });
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

    private function createHelper(): DateHelper
    {
        return new DateHelper($this->dateTimeHandler);
    }

    public function testGetType(): void
    {
        $helper = $this->createHelper();
        $this->assertEquals('date', $helper->getType());
    }

    public function testExecuteWithDefaultFormats(): void
    {
        $helper = $this->createHelper();

        // Test with a valid date using default formats
        $result = $helper->execute('2023-05-15 14:30:00', []);

        // The expected format is the combination of getDateTimeFormat and getTimeFormat
        $this->assertEquals('May 15, 2023 2:30 pm', $result);
    }

    public function testExecuteWithCustomInputFormat(): void
    {
        $helper = $this->createHelper();

        // Test with a valid date using custom input format
        $result = $helper->execute('15/05/2023 14:30', [
            'input' => 'd/m/Y H:i'
        ]);

        $this->assertEquals('May 15, 2023 2:30 pm', $result);
    }

    public function testExecuteWithCustomOutputFormat(): void
    {
        $helper = $this->createHelper();

        // Test with a valid date using custom output format
        $result = $helper->execute('2023-05-15 14:30:00', [
            'output' => 'Y-m-d H:i'
        ]);

        $this->assertEquals('2023-05-15 14:30', $result);
    }

    public function testExecuteWithBothCustomFormats(): void
    {
        $helper = $this->createHelper();

        // Test with a valid date using both custom input and output formats
        $result = $helper->execute('15/05/2023 14:30', [
            'input' => 'd/m/Y H:i',
            'output' => 'Y-m-d H:i'
        ]);

        $this->assertEquals('2023-05-15 14:30', $result);
    }

    public function testExecuteWithInvalidDate(): void
    {
        $helper = $this->createHelper();

        // Test with an invalid date
        $invalidDate = 'not-a-date';
        $result = $helper->execute($invalidDate, []);

        // Should return the original value when date is invalid
        $this->assertEquals($invalidDate, $result);
    }

    public function testExecuteWithPositiveOffset(): void
    {
        $helper = $this->createHelper();

        // Test with a positive offset (adding time)
        $result = $helper->execute('2023-05-15 14:30:00', [
            'input' => 'Y-m-d H:i:s',
            'output' => 'Y-m-d H:i:s',
            'offset' => '+1 day'
        ]);

        // Should be one day later
        $this->assertEquals('2023-05-16 14:30:00', $result);
    }

    public function testExecuteWithNegativeOffset(): void
    {
        $helper = $this->createHelper();

        // Test with a negative offset (subtracting time)
        $result = $helper->execute('2023-05-15 14:30:00', [
            'offset' => '-1 hour',
            'output' => 'Y-m-d H:i:s'
        ]);

        // Should be one hour earlier
        $this->assertEquals('2023-05-15 13:30:00', $result);
    }
}
