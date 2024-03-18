<?php

namespace PublishPress\WorkflowMotorLibrary;

use Traversable;
use IteratorAggregate;
use ArrayIterator;

class StepsIterator implements IteratorAggregate
{
    private $steps = [];

    public function getIterator(): Traversable {
        return new ArrayIterator($this->steps);
    }
}
