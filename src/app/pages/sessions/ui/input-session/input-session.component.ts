import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SuggestionService } from 'src/app/core/suggestion.service';

@Component({
  selector: 'app-input-session',
  templateUrl: './input-session.component.html',
  styleUrls: ['./input-session.component.scss']
})
export class InputSessionComponent implements OnInit {

  @Output("nameChange") nameChange = new EventEmitter<string>();

  constructor(private suggestionService: SuggestionService) {
  }

  nameControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  nameControl$ = this.nameControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  ngOnInit(): void {
    const subscription = this.suggestionService.suggestSession().subscribe(suggestion => {
      this.nameControl.setValue(suggestion.name);
      subscription.unsubscribe();
    });
  }
}
