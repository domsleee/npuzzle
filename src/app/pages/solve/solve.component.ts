import { Component, OnInit } from '@angular/core';
import { SolveService } from 'src/app/services/solve.service';
import { apparently1660, hardGrid } from 'src/app/utils/solver-cases';

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.scss']
})
export class SolveComponent implements OnInit {

  constructor(
    private solverService: SolveService
  ) { }

  ngOnInit(): void {
    const gridToUse = apparently1660;
    console.log(this.solverService.getShortestPath(gridToUse));
    if (gridToUse.length <= 3) console.log(this.solverService.getAllPaths(gridToUse));
  }
}
