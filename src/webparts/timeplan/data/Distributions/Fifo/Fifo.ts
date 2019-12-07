import { IDistribution } from '../Distribution';
import { DistributionNames } from '../DistributionNames';

export class Fifo implements IDistribution {

    distribute: (text: string, aNumber: number) => boolean;

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