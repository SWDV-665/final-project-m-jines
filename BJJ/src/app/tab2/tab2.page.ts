import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera,CameraSource, CameraResultType, Photo } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

interface JournalEntry {
  _id: string;
  date: string;
  techniques: string;
  notes: string;
  media: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public showSearchBar: boolean = false;
  wantToAddMedia: boolean =false;
  title = "Training Journal"
  filteredJournalEntries: JournalEntry[] = [];
  entries: JournalEntry[] = [];

  currentMedia: string = ''; 
  
  constructor(private changeDetector: ChangeDetectorRef, private http: HttpClient, public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.getJournalEntries().subscribe(
      (data: JournalEntry[]) => {
        this.entries = data;
        this.filteredJournalEntries = [...this.entries];
      },
    );
  }
 

  onSearchChange(event: any) {
    const searchTerm = event.detail.value;
  
    this.filteredJournalEntries = this.entries.filter(entry => {
      // Convert entry.date from ISO format to MM/DD/YYYY format
      const dateObj = new Date(entry.date);
      const formattedDate = ((dateObj.getMonth() + 1) + '').padStart(2, '0') + '/' +
                            (dateObj.getDate() + '').padStart(2, '0') + '/' +
                            dateObj.getFullYear();
  
      // Debug
      console.log(`Formatted Entry Date: ${formattedDate}, Search Term: ${searchTerm}`);
  
      // debug^
      if (formattedDate.includes(searchTerm)) {
        return true;
      }
      return entry.techniques.toLowerCase().includes(searchTerm.toLowerCase()) ||
             entry.notes.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
  
  
  
  
  
  toggleSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  getJournalEntries() {
    return this.http.get<JournalEntry[]>('http://localhost:8080/api/journalentries');
  }

  addJournalEntry(entry:any) {
    return this.http.post<JournalEntry>('http://localhost:8080/api/journalentries', entry);
  }

  updateJournalEntry(id: string, entry: any) {
    return this.http.put<JournalEntry>(`http://localhost:8080/api/journalentries/${id}`, entry);
  }

  deleteJournalEntry(id: string) {
    return this.http.delete(`http://localhost:8080/api/journalentries/${id}`);
  }
  
  

  async shareEntry(entry: any, index: any) {
    console.log("Sharing Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Sharing Entry: ' + entry.date,
      duration: 3000
    });
    (await toast).present();
    try {
      await Share.share({
        title: 'Sharing Journal Entry',
        text: 'Entry Date: ' + entry.date + ", Techniques: " + entry.techniques + ", Notes: "+entry.notes+ ", Entry Media: "+ entry.media
      });
    } catch (error) {
      console.error('Error sharing entry: ', error);
      
    }
    
  }

  async removeEntry(entry:any, index:any){
    console.log("Removing Item - ", entry, index);
    const toast = await this.toastCtrl.create({
      message: 'Entry for ' + entry.date +" deleted.",
      duration: 3000
    });
    (await toast).present();
    this.deleteJournalEntry(entry._id).subscribe(() => {
      console.log('Entry deleted');
      this.entries.splice(index,1);
      this.filteredJournalEntries = [...this.entries];
    });
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

  async captureMedia() {
    const actionSheet = await this.alertCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Select from Gallery',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture() {

    const image = await Camera.getPhoto({
      source: CameraSource.Camera,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    
    this.processImage(image);
  }

  async selectFromGallery() {
    const image = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri, 
      
    });

if (image.webPath) {
    try {
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        this.currentMedia = reader.result as string;
        this.changeDetector.detectChanges(); // fixing having to refresh to see updates /new entries
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error processing image:', error);
      this.currentMedia = '';
    }
  } else {
    console.error('No image path returned');
    this.currentMedia = '';
  }
}
  
  processImage(image: Photo) {
    if (image && image.webPath) {
      this.currentMedia = image.webPath;
    } else {
      console.error('No image path returned');
      this.currentMedia = '';
    }
  }

  async showAddEntryPrompt() {
    this.wantToAddMedia = false;
    const prompt = await this.alertCtrl.create({
      header: 'New Journal Entry',
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
          text: 'media',
          handler: () => {
            this.captureMedia();
            return false; // Prevent prompt from closing
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: newEntry => {
            console.log('Save Clicked', newEntry);
            newEntry.media = this.currentMedia;
        
            this.addJournalEntry(newEntry).subscribe(response => {
              console.log("Entry added", response);
        
              // fixing so I don't have to refresh to see new entry
              this.getJournalEntries().subscribe(entries => {
                this.entries = entries;
                this.filteredJournalEntries = [...this.entries]; // Update the filtered list
        
                this.changeDetector.detectChanges(); 
              }, error => {
                console.error('Error fetching entries:', error);
              });
        
              this.currentMedia = ''; 
            }, error => {
              console.error('Error adding entry:', error);
            });
          }
        }
      ]
    });
  
    await prompt.present();
  }
  
  async showEditEntryPrompt(entry: any, index: any) {
    this.currentMedia=entry.media;
    this.wantToAddMedia = false;
    const formattedDate = new Date(entry.date).toISOString().split('T')[0];
    const prompt = await this.alertCtrl.create({
      header: 'Edit Entry',
      cssClass: "large-prompt",
      message: "Please edit the entry: ",
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
          value: formattedDate,
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
          text: 'media',
          handler: () => {
            this.captureMedia();
            return false; 
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: editedEntry => {
            console.log('Save clicked', editedEntry);
            editedEntry.media = this.currentMedia;
  
            this.updateJournalEntry(entry._id, editedEntry).subscribe(response => {
              console.log("Entry Updated", response);
  
              // Update the entry in the array
              this.entries[index] = response;
              this.filteredJournalEntries = [...this.entries]; // updat filtered list
  
              this.currentMedia = ''; 
            }, error => {
              console.error('Error updating entry:', error);
            });
          }
        }
      ]
    });
  
    await prompt.present();
  }

  ionViewDidEnter() {
    this.getJournalEntries().subscribe(entries => {
      this.entries = entries;
    });
  }
  
  

}
