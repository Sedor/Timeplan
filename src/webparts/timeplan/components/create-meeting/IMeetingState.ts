export interface IMeetingState{
    event: {
        name: string,
        location: string,
        organizers: string[],
        numOfAttendees: number
    }
}