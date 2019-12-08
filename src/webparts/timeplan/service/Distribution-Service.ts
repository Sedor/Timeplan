import { DistributionNames } from "../data/Distributions/DistributionNames";
import { Fifo } from "../data/Distributions/Fifo/Fifo";
import { FairDistribution } from "../data/Distributions/FairDistribution/FairDistribution";
import { ManuelDistribution } from "../data/Distributions/ManuelDistribution/ManuelDistribution";

import { sp, ItemAddResult , ItemUpdateResult} from "@pnp/sp";
import { Priority } from "../data/Distributions/FairDistribution/Priority";
import { Choice } from "../data/Distributions/Choise";
import { User } from "../data/User/User";

export class DistributionService {

  static readonly priorityListName: string = "PriorityList";
  static readonly invitedUserChoiseListName: string = "ChoiceList";


  public static getDistributionDescription(distributionName: DistributionNames): string {
    switch (distributionName) {
      case DistributionNames.FIFO: {
        return new Fifo().getDistributionDescription();
      }
      case DistributionNames.FAIRDISTRO: {
        return new FairDistribution().getDistributionDescription();
      }
      case DistributionNames.MANUEL: {
        return new ManuelDistribution().getDistributionDescription();
      }
      default: {
        return "There was no Description for this DistributionType";
      }
    }
  }

  public static async getPriorityListForAppointmentList(appointmantIdList: number[], userId: number) {
    console.log("DistributionService.getPriorityMapForAppointmentList()");
    let promiseArray: Promise<Priority>[] = appointmantIdList.map((appointmentId: number) => {  
      return sp.web.lists.getByTitle(this.priorityListName).items
        .filter(`foreignUserId eq ${userId} and foreignAppointmentId eq ${appointmentId}`)
        .get().then((prio:any) => {
          if(prio.length>0){
            return new Priority({
              sharepointId: prio[0].Id,
              invitedUserSharepointId: userId,
              appointmentSharePointId: appointmentId,
              priorityNumber: prio[0].priority
            });
          }else {
            return new Priority({
              invitedUserSharepointId: userId,
              appointmentSharePointId: appointmentId,
              priorityNumber: 1
            });
          }
      });
    });
    return await Promise.all(promiseArray);
  }


  public static async updatePriorityListForInvitedUserId(prioList: Priority[]) {
    console.log('DistributionService.updatePriorityListForInvitedUserId');
    console.log(prioList);
    let batch = sp.web.createBatch();
    prioList.forEach(prio => {
      sp.web.lists.getByTitle(this.priorityListName).items.inBatch(batch).getById(prio.getSharepointId()).update({
        foreignUserId: prio.getInvitedUserSharepointid(),
        foreignAppointmentId: prio.getAppointmentSharePointId(),
        priority: prio.getPriorityNumber()
      })
    });
    return await batch.execute();
  }

  //working
  public static async addPriorityListForInvitedUserId(prioList: Priority[]) {
    console.log('DistributionService.addPriorityListForInvitedUserId()');
    let batch = sp.web.createBatch();
    prioList.forEach(prio => {
        sp.web.lists
          .getByTitle(this.priorityListName)
          .items.inBatch(batch)
          .add({
              foreignUserId: prio.getInvitedUserSharepointid(),
              foreignAppointmentId: prio.getAppointmentSharePointId(),
              priority: prio.getPriorityNumber()
          });
    });
    return await batch.execute();
  }


  public static async getChoiceListOfInvitedUserList(userList:User[]):Promise<Choice[]>{
    console.log('DistributionService.getChoiceOfInvitedUserList()');
    let promiseList:Promise<Choice>[] = userList.map((user:User) => {
      return sp.web.lists
        .getByTitle(this.invitedUserChoiseListName)
        .items.filter(`foreignInvitedUserId eq ${user.getSharepointId()}`).get().then( choice => {
          if(choice.length > 0){
            return new Choice({
              sharepointId: choice[0].Id,
              appointmentSharepointId: choice[0].foreignAppointmentId,
              invitedUserSharepointId:  choice[0].foreignInvitedUserId
            });
          }
        })
    });
    return await Promise.all(promiseList);
  }

  public static async getChoiceOfInvitedUser(userId:number):Promise<Choice>{
    console.log('DistributionService.addChoiseOfInvitedUser()');
    return await sp.web.lists.getByTitle(this.invitedUserChoiseListName).items.filter(`foreignInvitedUserId eq ${userId}`).get().then(choice => {
      if(choice.length === 1){
        return new Choice({
          sharepointId: choice[0].Id,
          appointmentSharepointId: choice[0].foreignAppointmentId,
          invitedUserSharepointId:  choice[0].foreignInvitedUserId
        });
      }
      return undefined;
    });
  }

  public static async updateChoiceOfInvitedUser(choice:Choice){
    console.log('DistributionService.updateChoiseOfInvitedUser()');
    //TODO also Check for uniquenes
    //TODO check if i can set the new 
    return await sp.web.lists.getByTitle(this.invitedUserChoiseListName).items.getById(choice.getSharepointId()).update({
      foreignInvitedUserId: choice.getInvitedUserSharepointId(),
      foreignAppointmentId: choice.getAppointmentSharepointId()
    });
  }

  public static async addChoiceOfInvitedUser(choice:Choice):Promise<ItemAddResult> {
    console.log('DistributionService.addChoiseOfInvitedUser()');
    //TODO check here for uniquenes
    //TODO check if i can set the new 
    return await sp.web.lists.getByTitle(this.invitedUserChoiseListName).items.add({
          foreignInvitedUserId: choice.getInvitedUserSharepointId(),
          foreignAppointmentId: choice.getAppointmentSharepointId()
    });
  }

}
