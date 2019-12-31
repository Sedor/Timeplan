import { DistributionNames } from './DistributionNames';
import { Appointment } from '../Appointment/Appointment';
import { User } from '../User/User';
import { Choice } from './Choise';
import { Priority } from './FairDistribution/Priority';

export interface IDistribution{
    distributionName: DistributionNames,
    distributionDescription?: string,
    distribute: (userList:User[] , AppointmentList:Appointment[], PriorityList:[Priority[]]) => Choice[]
}

export class Distribution{

    private distributionName: DistributionNames;
    private distributionDescription: string

    constructor(obj: IDistribution ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getDescription():string {
        return this.distributionDescription;
    }

    getDistributionName():DistributionNames {
        return this.distributionName;
    }

}
