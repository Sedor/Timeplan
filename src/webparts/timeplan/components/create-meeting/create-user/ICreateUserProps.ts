import { User } from '../../../data/User/User';

export interface ICreateUserProps{
    closeCreateUserModal: () => void;
    addUserToList: (appointment:User) => void;
}