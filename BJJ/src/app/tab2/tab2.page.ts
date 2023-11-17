import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  title = "Training Journal"
  
  entries = [
    {
      date: "09/10/2023",
      techniques: "Single leg X, Ashi Garami",
      notes: "notes about training here"
    }
    ,{
      date: "09/12/2023",
      techniques: "Ashi Garami, Butterfly Ashi",
      notes: "notes here blah blah blah "
    }
  ];

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }
  async removeEntry(entry:any, index:any){
    console.log("Removing Item - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Entry for ' + entry.date +" deleted.",
      duration: 3000
    });
    (await toast).present();
    this.entries.splice(index,1);
  }

  async editEntry(entry: any, index: any) {
    console.log("Edit Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Entry from '+ entry.date,
      duration: 3000
    });
    (await toast).present();
    this.showEditEntryPrompt(entry,index);
  }

  async addEntry(){
    console.log("Adding Entry");
    this.showAddEntryPrompt();
  }

  async showAddEntryPrompt() {
    const prompt = await this.alertCtrl.create({
      header:'New Journal Entry',
      cssClass: "large-prompt",
      message: "Enter the info for your new journal entry: ",
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
        },
        {
          name: 'techniques',
          type: 'textarea',
          placeholder: "Techniques",
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: "Notes",
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: entry => {
            console.log('Save Clicked', entry);
            this.entries.push(entry);
          }
        }
      ]
    });
    await prompt.present();
  }

  async showEditEntryPrompt(entry:any, index:any) {
    const prompt = await this.alertCtrl.create({
      header:'Edit Entry',
      cssClass: "large-prompt",
      message: "Please edit the entry: ",
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
          value: entry.date,
        },
        {
          name: 'techniques',
          type: 'textarea',
          placeholder: "Techniques",
          value: entry.techniques,
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: "Notes",
          value: entry.notes,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: entry => {
            console.log('Save Clicked', entry);
            this.entries[index] = entry;
          }
        }
      ]
    });
    await prompt.present();
  }

}
