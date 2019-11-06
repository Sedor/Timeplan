export class Meeting{

    public id: string;
    public title: string;
    public description: string;

    constructor(id:string, title:string, description:string){
        this.id = id;
        this.title = title;
        this.description = description
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