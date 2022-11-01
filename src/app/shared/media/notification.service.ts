import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class NotificationService {
    constructor(private snackBar: MatSnackBar) {
    }

    display(message: string) {
        this.snackBar.open(message, undefined, {
            duration: 2000
        });
    }
}