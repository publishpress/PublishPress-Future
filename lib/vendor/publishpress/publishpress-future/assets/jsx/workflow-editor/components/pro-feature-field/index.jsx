import ProFeatureButton from "../pro-feature-button";

export default function ProFeatureField({ children, link }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            {children}
            <ProFeatureButton link={link} />
        </div>
    );
}
