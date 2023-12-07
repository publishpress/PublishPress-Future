import { normalizeUnixTimeToMilliseconds } from "../time";
import { ToggleArrowButton } from "./ToggleArrowButton"

export const ToggleCalendarDatePicker = (
    {
        isExpanded,
        strings,
        onToggleCalendar,
        currentDate,
        onChangeDate,
        is12Hour,
        startOfWeek
    }
) => {
    const { DateTimePicker } = wp.components;
    const { Fragment } = wp.element;

    if (typeof currentDate === 'number') {
        currentDate = normalizeUnixTimeToMilliseconds(currentDate);
    }

    return (
        <Fragment>
            <ToggleArrowButton
                className="future-action-calendar-toggle"
                isExpanded={isExpanded}
                iconExpanded="arrow-up-alt2"
                iconCollapsed="calendar"
                titleExpanded={strings.hideCalendar}
                titleCollapsed={strings.showCalendar}
                onClick={onToggleCalendar} />

            <DateTimePicker
                currentDate={currentDate}
                onChange={onChangeDate}
                __nextRemoveHelpButton={true}
                is12Hour={is12Hour}
                startOfWeek={startOfWeek}
            />
        </Fragment>
    )
}
