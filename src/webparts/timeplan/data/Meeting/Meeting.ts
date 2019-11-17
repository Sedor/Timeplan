import { DistributionNames } from '../Distributions/DistributionNames';
import { MeetingStatus } from './MeetingStatus';


export interface IMeeting{    
    id?: string;
    title?: string;
    description?: string;
    distribution?: DistributionNames;
    status?: MeetingStatus;
}

export class Meeting{

    id: string;
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

    public getId():string {
        return this.id;
    }

    public getTitle():string {
        return this.title;
    }

    public getDescription():string {
        return this.description;
    }


}