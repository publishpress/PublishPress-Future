import { normalizeUnixTimeToMilliseconds } from "../time";
import { DateTimePicker as WPDateTimePicker } from "@wordpress/components";


export const DateTimePicker = ({currentDate, onChange, is12Hour, startOfWeek}) => {
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
