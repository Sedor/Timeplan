import { DistributionNames } from "./DistributionNames";

export interface IDistribution{
    distributionName: DistributionNames,
    distributionDescription?: string,
    distribute: (text:string,aNumber:number) => boolean
}

export class Distribution{

    private distributionName: DistributionNames;
    private distributionDescription: string

    constructor(obj: IDistribution ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    getDescription(){
        return this.distributionDescription;
    }

}
