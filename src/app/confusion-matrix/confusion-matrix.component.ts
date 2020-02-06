import { Component, OnInit ,Input} from '@angular/core';

@Component({
  selector: 'app-confusion-matrix',
  templateUrl: './confusion-matrix.component.html',
  styleUrls: ['./confusion-matrix.component.css']
})
export class ConfusionMatrixComponent implements OnInit {

  constructor() { }
  @Input() TP;
  @Input() FP;
  @Input() TN;
  @Input() FN;

  ngOnInit() {

  }

}
