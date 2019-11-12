export interface IUser{    
    id?: string;
    name: string;
    eMail: string;
}


export class User{

    public id: string;
    public name: string;
    public eMail: string;

    constructor(obj: IUser ) {
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    public get Id():string {
        return this.id;
    }

    public get Name():string {
        return this.name;
    }

    public get EMail():string {
        return this.eMail;
    }
}