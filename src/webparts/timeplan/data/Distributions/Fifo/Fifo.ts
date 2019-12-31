import { IDistribution } from '../Distribution';
import { DistributionNames } from '../DistributionNames';
import { User } from '../../User/User';
import { Appointment } from '../../Appointment/Appointment';
import { Priority } from '../FairDistribution/Priority';

export class Fifo implements IDistribution {

    distribute = (userList:User[] , appointmentList:Appointment[], priorityList:[Priority[]]) => {
        return undefined;
    };
    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.FIFO,
        this.distributionDescription = "This is Fifo" 
    }

    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}