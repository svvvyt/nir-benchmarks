import { Injectable } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { PerformanceLoggerService } from './performance-logger.service';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouterPerformanceService {
  constructor(
    private router: Router,
    private performanceLogger: PerformanceLoggerService
  ) {
    this.setupRouteTracking();
  }

  private setupRouteTracking() {
    let stop: (() => void) | null = null;
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationStart || event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          stop = this.performanceLogger.start('RouteTransitionSpeed');
        } else if (event instanceof NavigationEnd && stop) {
          stop();
          stop = null;
        }
      });
  }
}
