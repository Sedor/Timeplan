import { IDistribution } from './Distribution';
import { DistributionNames } from './DistributionNames';

export class ManualDistribution implements IDistribution {

    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.MANUEL,
        this.distributionDescription = "This is Manuel Distribution" 
    }

    distribute = (text: string, aNumber: number) => {
        console.log('ManualDistribution.distribute');
        console.log(text);
        console.log(aNumber);
        return true
    };
 

    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}