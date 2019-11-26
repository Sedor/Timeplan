import { DistributionNames } from '../data/Distributions/DistributionNames';
import { Fifo } from '../data/Distributions/Fifo';
import { FairDistribution } from '../data/Distributions/FairDistribution';
import { ManualDistribution } from '../data/Distributions/ManualDistribution';

export class DistributionService {

    public static getDistributionDescription(distributionName:DistributionNames):string {
        switch(distributionName) { 
            case DistributionNames.FIFO: { 
               return new Fifo().getDistributionDescription();
            } 
            case DistributionNames.FAIRDISTRO: { 
               return new FairDistribution().getDistributionDescription();
            } 
            case DistributionNames.MANUEL: { 
                return new ManualDistribution().getDistributionDescription();
             }
            default: { 
               return 'There was no Description for this DistributionType';
            } 
         } 
    }



}

