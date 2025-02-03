import { useSelect, useDispatch } from "@wordpress/data";
import { store as editorStore } from "../editor-store";
import { store as workflowStore } from "../workflow-store";
import {
    FEATURE_DEVELOPER_MODE,
} from "../../constants";
import { __ } from "@wordpress/i18n";
import {
    Button,
    Popover,
    TextareaControl,
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
} from "@wordpress/components";
import { useState, useEffect } from "@wordpress/element";

const StepDescription = ({ node }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [description, setDescription] = useState(node.data?.label);

    const {
        updateNode
    } = useDispatch(workflowStore);

    useEffect(() => {
        setIsPopoverOpen(false);
        setDescription(node.data?.label);
    }, [node]);

    const closePopover = () => {
        setIsPopoverOpen(false);

        const newNode = {
            id: node.id,
            data: {
                label: description,
            },
        };

        updateNode(newNode);
    };


    return (
        <>
            {! node.data?.label && (
                <Button
                    variant="link"
                    onClick={() => {
                        setIsPopoverOpen(true);
                    }}
                >
                    {__("Add a description to this step...", "post-expirator")}
                </Button>
            )}

            {node.data?.label && (
                <>
                    <VStack>
                        <div className="workflow-editor-inspector-card__description">
                            {node.data.label}
                        </div>

                        <Button
                            variant="link"
                            onClick={() => {
                                setIsPopoverOpen(true);
                            }}
                        >
                            {__("Edit description", "post-expirator")}
                        </Button>
                    </VStack>
                </>
            )}

            {isPopoverOpen && (
                <Popover
                    onClose={closePopover}
                    placement="left-start"
                    offset={80}
                    className="workflow-editor-inspector-card__description-popover"
                >
                    <VStack>
                        <HStack>
                            <h2 className="components-truncate components-text components-heading block-editor-inspector-popover-header__heading">
                                {__("Edit description", "post-expirator")}
                            </h2>
                            <Button
                                icon={'no-alt'}
                                isSmall={true}
                                className="block-editor-inspector-popover-header__action"
                                onClick={closePopover}
                            />
                        </HStack>
                    </VStack>

                    <VStack>
                        <TextareaControl
                            value={description}
                            onChange={(value) => {
                                setDescription(value);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Escape') {
                                    closePopover();
                                }
                            }}
                        />
                    </VStack>
                </Popover>
            )}
        </>
    );
}

export const InspectorCard = ({ title, description, icon, id, slug, isProFeature, node }) => {
    const {
        isDeveloperModeEnabled,
        isPro
    } = useSelect((select) => {
        return {
            isDeveloperModeEnabled: select(editorStore).isFeatureActive(FEATURE_DEVELOPER_MODE),
            isPro: select(editorStore).isPro(),
        };
    });

    const nodeAttributes = [];
    if (isDeveloperModeEnabled) {
        nodeAttributes.push({
            id: "id",
            label: "ID",
            value: id,
        });

        nodeAttributes.push({
            id: "slug",
            label: "Slug",
            value: slug,
        });
    }

    return (
        <div className="workflow-editor-inspector-card">
            <div className="workflow-editor-inspector-card__content">
                <VStack>
                    <HStack className="workflow-editor-inspector-card__header">
                        <span className="workflow-editor-inspector-icon has-colors">
                            {icon}
                        </span>
                        <h2 className="workflow-editor-inspector-card__title">
                            {title}
                            {isProFeature && !isPro && (
                                <span className="workflow-editor-inspector-card__pro-badge">
                                    {__("Pro", "post-expirator")}
                                </span>
                            )}
                        </h2>
                    </HStack>
                </VStack>
                <VStack>
                    <div className="workflow-editor-inspector-card__description">
                        {description}
                    </div>
                </VStack>

                {isProFeature && !isPro && (
                    <VStack>
                        <div className="workflow-editor-inspector-card__pro-instructions">
                            <a href="https://publishpress.com/links/future-workflow-inspector" target="_blank">
                            {__("Currently this step is being skipped. Upgrade to Pro to unlock this feature.", "post-expirator")}
                            </a>
                        </div>
                    </VStack>
                )}

                {nodeAttributes.length > 0 && (
                    <VStack>
                        <table>
                            <tbody>
                                {nodeAttributes.map((attribute) => {
                                    return (
                                        <tr key={"attribute_" + attribute.id}>
                                            <th>{attribute.label}</th>
                                            <td>{attribute.value}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </VStack>
                )}

                <VStack>
                    <StepDescription node={node} />
                </VStack>
            </div>
        </div>
    );
};

export default InspectorCard;
