import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  title = "Technique Library"

  entries = [
    {
      name: "Tripod Sweep",
      description: "napsdjnapsdnaopsdnas",
      relatedTechniques: "Guard pull, collar sleeve, Single leg X, Ashi Garami",
      status: "Proficient"
    }
    , {
      name: "Lumbar Jack Sweep",
      description: "napsdjnapsdnaopsdnas",
      relatedTechniques: "Guard pull, collar sleeve, Single leg X, Ashi Garami",
      status: "Proficient"
    }
  ];

  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }
  async removeEntry(entry: any, index: any) {
    console.log("Removing Item - ", entry, index);
    const toast = this.toastCtrl.create({
      message: entry.name + " deleted.",
      duration: 3000
    });
    (await toast).present();
    this.entries.splice(index, 1);
  }

  async editEntry(entry: any, index: any) {
    console.log("Edit Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Entry for ' + entry.name,
      duration: 3000
    });
    (await toast).present();
    this.showEditEntryPrompt(entry, index);
  }

  async addEntry() {
    console.log("Adding Entry");
    this.showAddEntryPrompt();
  }

  async showAddEntryPrompt() {
    const prompt = await this.alertCtrl.create({
      header: 'New Technique Entry',
      cssClass: "large-prompt",
      message: "Enter the info for your new technique library entry: ",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: "Description",
        },
        {
          name: 'relatedTechniques',
          type: 'textarea',
          placeholder: "Related Techniques",
        },

        {
          name: 'status',
          type: 'textarea',
          placeholder: "Status",
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

  async showEditEntryPrompt(entry: any, index: any) {
    const prompt = await this.alertCtrl.create({
      header: 'Edit Entry',
      cssClass: "large-prompt",
      message: "Please edit the entry: ",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: "Description",
        },
        {
          name: 'relatedTechniques',
          type: 'textarea',
          placeholder: "Related Techniques",
        },
        {
          name: 'status',
          type: 'textarea',
          placeholder: "Status",
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
