import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FeaturesWidget } from '../../components/featureswidget';

@Component({
  selector: 'app-home',
  imports: [FeaturesWidget],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
