import { Component } from '@angular/core';

@Component({
  selector: 'app-add-story',
  templateUrl: './add-story.component.html',
  styleUrls: ['./add-story.component.scss']
})
export class AddStoryComponent {
  backgroundColorIndex = 0;
  backgroundImage = "../../../assets//melachatbackground.png"
  backgroundColors = [
    '#8B4513', '#FFD700', '#008080', '#9932CC', '#00FF00', '#FF00FF', '#808080', '#FF4500', '#4B0082', '#00FFFF',
    '#F08080', '#7CFC00', '#A52A2A', '#B22222', '#8A2BE2', '#32CD32', '#20B2AA', '#FF69B4', '#800000', '#66CDAA',
    '#DC143C', '#00FA9A', '#000080', '#FF6347', '#9400D3', '#FFA07A', '#556B2F', '#2F4F4F', '#6B8E23', '#FF7F50',
    '#483D8B', '#00BFFF', '#87CEEB', '#00CED1', '#4682B4', '#9ACD32', '#DAA520', '#008000', '#A52A2A', '#8B008B',
    '#808000', '#F4A460', '#4B0082', '#CD5C5C', '#8B0000', '#2F4F4F', '#483D8B', '#000080', '#008080', '#556B2F'
  ];
  backgroundColor = this.backgroundColors[0]; // Default background color
  
  switchBackgroundColorPalette(): void {
    // Increment the background color index
    this.backgroundColorIndex = (this.backgroundColorIndex + 1) % this.backgroundColors.length;
  
    // Update the backgroundColor property
    this.backgroundColor = this.backgroundColors[this.backgroundColorIndex];
    
   
  }
 

  onInput(event: any): void {
    const editableDiv = document.getElementById('editable-div');
    const hintDiv = document.getElementById('hint');
  
    if (editableDiv && hintDiv) {
      editableDiv.style.height = 'auto';
      editableDiv.style.height = editableDiv.scrollHeight + 'px';
  
      // Show or hide the hint based on the content
      hintDiv.style.visibility = editableDiv.textContent?.trim() === '' ? 'visible' : 'hidden';
    }
  }
  
  onKeyDown(event: KeyboardEvent): void {
    const editableDiv = document.getElementById('editable-div');
    if (editableDiv && event.key === 'Enter' && editableDiv.textContent && editableDiv.textContent.length % 100 === 0) {
      document.execCommand('insertHTML', false, '<br>');
      event.preventDefault();
    }
  }
  
  
  
  // onKeyDown(event: KeyboardEvent): void {
  //   const editableDiv = document.getElementById('editable-div');
  //   if (editableDiv && event.key === 'Enter' && editableDiv.textContent.length % 100 === 0) {
  //     document.execCommand('insertHTML', false, '<br>');
  //     event.preventDefault();
  //   }
  // }
  // onInput(event: any): void {
  //   const editableDiv = document.getElementById('editable-div');
  //   if (editableDiv) {
  //     editableDiv.style.height = 'auto';
  //     editableDiv.style.height = editableDiv.scrollHeight + 'px';
  //   }
  // }
}
