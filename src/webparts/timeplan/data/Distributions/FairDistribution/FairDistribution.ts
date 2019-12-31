import { IDistribution } from '../Distribution';
import { DistributionNames } from '../DistributionNames';
import { User } from '../../User/User';
import { Appointment } from '../../Appointment/Appointment';
import { Priority } from './Priority';
import { Choice } from '../Choise';

export class FairDistribution implements IDistribution {
    
    distributionName: DistributionNames;
    distributionDescription?: string;

    constructor(){
        this.distributionName = DistributionNames.FAIRDISTRO,
        this.distributionDescription = "This is FairDistribution" 
    }

    distribute = (userList:User[] , appointmentList:Appointment[], priorityList:[Priority[]]) => {
        console.log('FairDistribution.distribute()');
        let shuffeldUsers = this._shuffle(userList);
        let tmpUsers = shuffeldUsers.map( (user:User) => {return new User({
            sharepointId: user.getSharepointId(),
            eMail: user.getEMail(),
            name: user.getName()
        })})

        shuffeldUsers.forEach( (user:User) => {
            let userPrio = priorityList.filter(prio  => (prio[0].getInvitedUserSharepointid() === user.getSharepointId()))[0];

            userPrio = userPrio.sort((prio1:Priority, prio2:Priority) => {
                if (prio1.getPriorityNumber > prio2.getPriorityNumber) {
                    return 1;
                }
                if (prio1.getPriorityNumber < prio2.getPriorityNumber) {
                    return -1;
                }
                return 0;
            });
            let isChoosen:boolean = false;
            userPrio.forEach( (prio:Priority) => {
                if(!isChoosen){
                    let appointment = appointmentList.filter( (appointment:Appointment) => {
                        return (appointment.getSharepointId() === prio.getAppointmentSharePointId())
                    });
                    if (appointment[0].isSlotFree()){
                        appointment[0].addParticipant(user);
                        isChoosen = true;
                    }      
                }
            })
        })
        return this._generateChoiceList(appointmentList);
    };

    private _generateChoiceList(appointmentList: Appointment[]):Choice[]{
        console.log("MeetingStatus._generateChoiceList()");
        let newChoiceList:Choice[] = [];
        appointmentList.forEach( appointment => {
        newChoiceList = newChoiceList.concat(appointment.getParticipant().map( (user:User) => {
            return new Choice({
                appointmentSharepointId: appointment.getSharepointId(),
                invitedUserSharepointId: user.getSharepointId(),
            });
        }));
        });
        return newChoiceList;
    }


    private _shuffle(array: any[]) {
        let currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          console.log('swapping');
          console.log(currentIndex);
          console.log(randomIndex);
        
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
  
    getDistributionDescription():string{
        return this.distributionDescription
    }
  

}