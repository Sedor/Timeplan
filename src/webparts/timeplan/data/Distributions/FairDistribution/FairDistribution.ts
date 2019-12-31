import { IDistribution } from '../Distribution';
import { DistributionNames } from '../DistributionNames';
import { User } from '../../User/User';
import { Appointment } from '../../Appointment/Appointment';
import { Priority } from './Priority';

export class FairDistribution implements IDistribution {
    
    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.FAIRDISTRO,
        this.distributionDescription = "This is FairDistribution" 
    }

    distribute = (userList:User[] , appointmentList:Appointment[], priorityList:Priority[]) => {
        console.log('loook here mum');
        console.log(userList);
        console.log(appointmentList);
        console.log(priorityList);
        return undefined;
    };
  
    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}