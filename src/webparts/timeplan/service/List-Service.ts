import { sp } from '@pnp/sp';

export class ListService {


    public static async createList() { 
        let testListName = 'TestList';
        await sp.web.customListTemplate.get().then( tmp => {
            console.log('customListTemplate');
            console.log(tmp);
        })
        await sp.web.lists.add(testListName, 'this is a description').then(tmp =>{console.log(tmp)});
        return null;
    }

}

