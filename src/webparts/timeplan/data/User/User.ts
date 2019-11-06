export class User{

    public id: string;
    public name: string;
    public eMail: string;

    constructor(id:string, name:string, eMail:string){
        this.id = id;
        this.name = name;
        this.eMail = eMail
    }

    public getId():string {
        return this.id;
    }

    public getName():string {
        return this.name;
    }

    public getEMail():string {
        return this.eMail;
    }
}