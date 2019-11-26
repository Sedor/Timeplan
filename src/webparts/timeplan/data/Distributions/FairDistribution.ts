import { IDistribution } from './Distribution';
import { DistributionNames } from './DistributionNames';

export class FairDistribution implements IDistribution {

    distribute: (text: string, aNumber: number) => boolean;

    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.FAIRDISTRO,
        this.distributionDescription = "This is FairDistribution" 
    }

    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}