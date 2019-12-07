import { DistributionNames } from "../data/Distributions/DistributionNames";
import { Fifo } from "../data/Distributions/Fifo/Fifo";
import { FairDistribution } from "../data/Distributions/FairDistribution/FairDistribution";
import { ManuelDistribution } from "../data/Distributions/ManuelDistribution/ManuelDistribution";

import { sp, ItemAddResult} from "@pnp/sp";
import { Priority } from "../data/Distributions/FairDistribution/Priority";

export class DistributionService {

  static readonly priorityListName: string = "PriorityList";
  static readonly chosenAppointmentListName: string = "ChosenAppointmentList";


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

  public static async getPriorityMapForAppointmentList(appointmantIdList: number[], userId: number) {
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

   //TODO needs Test
  public static async addChoiseOfInvitedUser(chosenAppointmentId:number, invitedUserId:number):Promise<ItemAddResult> {
    console.log("DistributionService.addChoiseOfInvitedUser()");
    return await sp.web.lists.getByTitle(this.chosenAppointmentListName).items.add({
          foreignInvitedUserId: invitedUserId,
          foreignAppointmentId: chosenAppointmentId
    });
  }

}
