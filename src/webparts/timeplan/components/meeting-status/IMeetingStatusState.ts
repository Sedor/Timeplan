export interface IMeetingStatusState{
    event: {
        name: string,
        location: string,
        organizers: string[],
        numOfAttendees: number
    }
}