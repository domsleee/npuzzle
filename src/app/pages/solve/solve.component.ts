import { Component, OnInit } from '@angular/core';
import { Solver } from 'src/app/utils/solver';

@Component({
  selector: 'app-solve',
  templateUrl: './solve.component.html',
  styleUrls: ['./solve.component.scss']
})
export class SolveComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const solver = new Solver(3);
    const res = solver.getAllPaths([
      [1,2,3],
      [4,5,6],
      [7,0,8]
    ]);
    console.log(res);
  }

}
