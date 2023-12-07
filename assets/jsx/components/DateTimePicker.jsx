import { normalizeUnixTimeToMilliseconds } from "../time";

export const DateTimePicker = ({currentDate, onChange, is12Hour, startOfWeek}) => {
    const WPDateTimePicker = wp.components.DateTimePicker;

    if (typeof currentDate === 'number') {
        currentDate = normalizeUnixTimeToMilliseconds(currentDate);
    }

    return (
        <WPDateTimePicker
            currentDate={currentDate}
            onChange={onChange}
            __nextRemoveHelpButton={true}
            is12Hour={is12Hour}
            startOfWeek={startOfWeek}
        />
    )
}
