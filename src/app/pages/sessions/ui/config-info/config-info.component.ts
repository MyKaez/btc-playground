import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { SessionService } from 'src/app/core/session.service';
import { SessionControlInfo, SessionInfo } from 'src/app/models/session';

@Component({
  selector: 'app-config-info',
  templateUrl: './config-info.component.html',
  styleUrls: ['./config-info.component.scss']
})
export class ConfigInfoComponent implements OnInit {

  @Input("config") config!: any;
  @Input("session") session!: SessionInfo;

  keys: string[] = [];
  infos: ConfigInfo[] = [
    { property: 'secondsUntilBlock', editable: true },
  ];
  formGroup = new FormGroup<any>([]);

  constructor(private sessionService: SessionService) { }

  get sessionControl(): SessionControlInfo | undefined {
    if ('controlId' in this.session) {
      return <SessionControlInfo>this.session;
    }
    return undefined;
  }

  isReadonly(property: string): boolean {
    if (!this.sessionControl) {
      return false;
    }
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
    this.keys = Object.keys(this.config).filter(key => key !== 'result');
    this.infos.filter(info => info.editable).forEach(info => {
      if (!this.sessionControl) {
        return;
      }
      const control = new FormControl<string>(this.config[info.property]);
      this.formGroup.addControl(info.property, control);
      const observable = control.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(value => {
          if (value) {
            if (Number.isNaN(value)) {
              this.config[info.property] = value;
            } else {
              this.config[info.property] = Number.parseFloat(value);
            }
          }
          this.sessionService.update(this.sessionControl!, this.config).subscribe();
        })
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