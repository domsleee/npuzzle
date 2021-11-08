import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private subs?: Subscription;

  constructor() { }

  startTimer(): Observable<number> {
    if (this.subs) {
      throw new Error('cannot start timer. it is already running');
    }
    const startTime = new Date().getTime();
    const subj = new BehaviorSubject(0);
    this.subs = timer(33, 33).subscribe(t => {
      subj.next(new Date().getTime() - startTime);
    });
    return subj;
  }

  stopTimer() {
    this.subs!.unsubscribe();
    this.subs = undefined;
  }

  isRunning() {
    return this.subs !== undefined;
  }
}
