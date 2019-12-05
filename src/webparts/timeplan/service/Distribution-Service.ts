import { DistributionNames } from "../data/Distributions/DistributionNames";
import { Fifo } from "../data/Distributions/Fifo";
import { FairDistribution } from "../data/Distributions/FairDistribution";
import { ManualDistribution } from "../data/Distributions/ManualDistribution";

import { sp, ItemAddResult} from "@pnp/sp";

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
        return new ManualDistribution().getDistributionDescription();
      }
      default: {
        return "There was no Description for this DistributionType";
      }
    }
  }

  // PriorityList
  // foreignUserId
  // foreignAppointmentId
  // priority

  //TODO this works maybe
  //TODO needs handling
  //TODO maybe use Promise.all
  public static async getPriorityMapForAppointmentList(appointmantIdList: number[], userId: number) {
    console.log("DistributionService.getPriorityMapForAppointmentList()");
    let prioMap: Map<number, number> = new Map<number, number>();
    await appointmantIdList.forEach((appointmantID: number) => {
      console.log(`UserId ${userId}, AppointmentID ${appointmantID}`);
      sp.web.lists.getByTitle(this.priorityListName).items.filter( 
          `foreignUserId eq ${userId} and foreignAppointmentId eq ${appointmantID}`
        ).get().then((prio:any) => {
          console.log(prio);
          if(prio.length>0){
            console.log(`UserId ${userId}, AppointmentID ${appointmantID} there prio ${prio[0].priority}`);
            prioMap.set(appointmantID, prio[0].priority);
          }
        });
    });
    console.log('returning prioMap');
    console.log(prioMap);
    return prioMap;
  }


  //TODO needs Test
  public static async addPriorityMapForInvitedUserId(prioMap: Map<number, number>, invitedUserId:number) {
    console.log("DistributionService.addPriorityMapForUserId()");
    let batch = sp.web.createBatch();
    prioMap.forEach((value: number, key: number) => {
        sp.web.lists
          .getByTitle(this.priorityListName)
          .items.inBatch(batch)
          .add({
              foreignUserId: invitedUserId,
              foreignAppointmentId: key,
              priority: value
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
