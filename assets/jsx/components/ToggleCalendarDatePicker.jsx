import { ToggleArrowButton } from "./ToggleArrowButton";
import { DateTimePicker } from "./DateTimePicker";
import { Fragment, useEffect } from "&wp.element";

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
    useEffect(() => {
        // Move the element of the toggle button to between the time and date elements.
        const toggleButtonElement = document.querySelector('.future-action-calendar-toggle');

        if (! toggleButtonElement) {
            return;
        }

        const dateTimeElement = toggleButtonElement.nextElementSibling;

        if (! dateTimeElement) {
            return;
        }

        const timeElement = dateTimeElement.querySelector('.components-datetime__time');

        if (! timeElement) {
            return;
        }

        const dateElement = timeElement.nextSibling;

        if (! dateElement) {
            return;
        }

        dateTimeElement.insertBefore(toggleButtonElement, dateElement)
    });

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
