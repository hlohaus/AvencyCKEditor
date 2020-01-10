<?php declare(strict_types=1);

namespace Avency\CKEditor\Components;

use Shopware\Core\System\SystemConfig\SystemConfigService;
use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;

class TemplateDataExtension extends AbstractExtension implements GlobalsInterface
{
    /**
     * @var SystemConfigService
     */
    private $systemConfigService;

    public function __construct(SystemConfigService $systemConfigService)
    {
        $this->systemConfigService = $systemConfigService;
    }

    public function getGlobals(): array
    {
        return [
            'AvencyCKEditor' => [
                'config' => $this->systemConfigService->get('AvencyCKEditor.config'),
            ],
        ];
    }
}
