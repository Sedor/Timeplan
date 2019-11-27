export interface IUser{    
    sharepointId?: number;
    name?: string;
    eMail?: string;
}


export class User{

    public sharepointId: number;
    public name: string;
    public eMail: string;

    constructor(obj: IUser ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    public getSharepointId():number {
        return this.sharepointId;
    }

    public getName():string {
        return this.name;
    }

    public getEMail():string {
        return this.eMail;
    }
}