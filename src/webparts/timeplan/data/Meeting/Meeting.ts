import { IDistribution } from "../Distributions/IDistribution";

export class Meeting{

    public id: string;
    public title: string;
    public description: string;
    public distribution: IDistribution;

    constructor(id:string, title:string, description:string){
        this.id = id;
        this.title = title;
        this.description = description
    }

    public setDistribution(distribution:IDistribution){
        this.distribution = distribution;
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