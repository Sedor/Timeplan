import { IDistribution } from '../Distribution';
import { DistributionNames } from '../DistributionNames';
import { User } from '../../User/User';
import { Appointment } from '../../Appointment/Appointment';
import { Priority } from '../FairDistribution/Priority';

export class ManuelDistribution implements IDistribution {

    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.MANUEL,
        this.distributionDescription = "This is Manuel Distribution" 
    }
    
    distribute = (userList:User[] , appointmentList:Appointment[], priorityList:[Priority[]]) => {
        return undefined;
    };
 

    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}