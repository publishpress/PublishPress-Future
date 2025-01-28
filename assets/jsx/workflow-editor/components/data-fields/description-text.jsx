import { HelpLink } from "./help-link";

export const DescriptionText = ({
    text,
    helpUrl,
    className = 'description margin-top'
}) => {
    return (
        <p className={className}>
            {text} {helpUrl && (
                <>
                    <HelpLink url={helpUrl} />
                </>
            )}
        </p>
    );
}
