import { useState } from "@wordpress/element";
import {
    settings,
    text
} from "&config.pro-settings";

export const ScheduledStepsCleanupSettings = () => {
    const [cleanupStatus, setCleanupStatus] = useState(settings.scheduledStepsCleanupStatus);
    const [cleanupRetention, setCleanupRetention] = useState(settings.scheduledStepsCleanupRetention);

    return (
        <>
            <th scope="row">{text.scheduledStepsCleanup}</th>
            <td>
                <div class="pp-settings-field-row">
                    <input type="radio"
                        checked={cleanupStatus}
                        name="future-step-schedule-cleanup"
                        id="future-step-schedule-cleanup-enabled"
                        onChange={() => setCleanupStatus(true)}
                        value="1"
                        />
                    <label for="future-step-schedule-cleanup-enabled">{text.scheduledStepsCleanupEnable}</label>
                    <p className="description offset">{text.scheduledStepsCleanupEnableDesc}</p>
                    {cleanupStatus && (
                        <>
                            <div class="pp-settings-field-row" style={{ marginLeft: '24px', marginTop: '12px', marginBottom: '12px' }}>
                                <label for="future-step-schedule-cleanup-retention"
                                    style={{ marginRight: '4px' }}
                                >
                                    {text.scheduledStepsCleanupRetention}</label>
                                <input type="number"
                                    id="future-step-schedule-cleanup-retention"
                                    value={cleanupRetention}
                                    name="future-step-schedule-cleanup-retention"
                                    style={{ width: '60px' }}
                                    onChange={(e) => setCleanupRetention(e.target.value)}
                                />
                                <span style={{ marginLeft: '4px' }}>{text.days}</span>
                                <p className="description">
                                    {text.scheduledStepsCleanupRetentionDesc}
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div class="pp-settings-field-row">
                    <input type="radio"
                        checked={!cleanupStatus}
                        name="future-step-schedule-cleanup"
                        id="future-step-schedule-cleanup-disabled"
                        onChange={() => setCleanupStatus(false)}
                        value="0"
                        />
                    <label for="future-step-schedule-cleanup-disabled">{text.scheduledStepsCleanupDisable}</label>
                    <p className="description offset">{text.scheduledStepsCleanupDisableDesc}</p>
                </div>
            </td>
        </>
    )
}
