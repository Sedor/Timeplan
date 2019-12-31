import { DistributionNames } from '../Distributions/DistributionNames';
import { MeetingStatus } from './MeetingStatus';


export interface IMeeting{    
    sharepointPrimaryId?: number;
    title?: string;
    description?: string;
    distribution?: DistributionNames;
    status?: MeetingStatus;
}

export class Meeting{

    sharepointPrimaryId: number;
    title: string;
    description: string;
    distribution: DistributionNames;
    status: MeetingStatus;

    constructor(obj: IMeeting ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    public setDistribution(distribution:DistributionNames){
        this.distribution = distribution;
    }

    public setTitle(title:string){
        this.title = title;
    }

    public setDescription(description:string){
        this.description = description;
    }

    public setStatus(status:MeetingStatus){
        this.status = status;
    }

    public getSharepointPrimaryId():number {
        return this.sharepointPrimaryId;
    }

    public getTitle():string {
        return this.title;
    }

    public getDescription():string {
        return this.description;
    }

    public getStatus():MeetingStatus {
        return this.status;
    }

    public getDistribution():DistributionNames{
        return this.distribution
    }

}