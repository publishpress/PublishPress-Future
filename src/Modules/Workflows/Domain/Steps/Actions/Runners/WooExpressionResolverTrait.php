<?php

namespace PublishPress\Future\Modules\Workflows\Domain\Steps\Actions\Runners;

/**
 * Shared helper for WooCommerce action runners: reads an `expression` field from
 * the node settings and resolves any {{...}} variables through the execution
 * context. Requires the using class to expose an $executionContext property.
 */
trait WooExpressionResolverTrait
{
    private function resolveExpressionField(array $nodeSettings, string $fieldName): string
    {
        $value = $nodeSettings[$fieldName] ?? '';

        if (is_array($value)) {
            $value = $value['expression'] ?? '';
        }

        return trim($this->executionContext->resolveExpressionsInText((string)$value));
    }

    /**
     * Read a `select` field value, tolerating scalar or array-shaped storage.
     */
    private function resolveSelectField(array $nodeSettings, string $fieldName, string $default = ''): string
    {
        $value = $nodeSettings[$fieldName] ?? $default;

        if (is_array($value)) {
            $value = $value['value'] ?? $default;
        }

        return is_string($value) ? trim($value) : $default;
    }

    /**
     * Resolve a product reference (numeric ID or SKU) to a product ID.
     */
    private function resolveProductId(string $reference): int
    {
        if ($reference === '') {
            return 0;
        }

        if (ctype_digit($reference)) {
            return (int) $reference;
        }

        if (function_exists('wc_get_product_id_by_sku')) {
            return (int) wc_get_product_id_by_sku($reference);
        }

        return 0;
    }
}
