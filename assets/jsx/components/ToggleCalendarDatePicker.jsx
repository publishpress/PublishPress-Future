import { ToggleArrowButton } from "./ToggleArrowButton";
import { DateTimePicker } from "./DateTimePicker";

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
    const { Fragment } = wp.element;

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
