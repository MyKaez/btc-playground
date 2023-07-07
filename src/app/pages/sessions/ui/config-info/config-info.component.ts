import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent implements OnInit {

  @Input("config") config!: any;

  keys: string[] = [];
  infos: ConfigInfo[] = [
    { property: 'secondsUntilBlock', editable: true },
  ];
  formGroup = new FormGroup<any>([]);

  isReadonly(property: string): boolean {
    return !(this.infos.find(info => info.property === property)?.editable ?? false);
  }

  observable(property: string): Observable<any> {
    const obs = this.infos.find(info => info.property === property)?.observable;
    if (obs) {
      return obs;
    }
    throw new Error("Observable not found");
  }

  ngOnInit(): void {
    this.keys = Object.keys(this.config);
    this.infos.filter(info => info.editable).forEach(info => {
      const control = new FormControl<number>(this.config[info.property]);
      this.formGroup.addControl(info.property, control);
      const observable = control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(value => alert(value))
      );
      info.observable = observable;
    });
  }
}

export interface ConfigInfo {
  property: string;
  editable: boolean;
  observable?: Observable<any>;
}