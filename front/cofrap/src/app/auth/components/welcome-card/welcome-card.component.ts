import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-card',
  imports: [],
  templateUrl: './welcome-card.component.html',
  styleUrl: './welcome-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeCardComponent {
    @Input() title: string = 'Bienvenue sur COFRAP!';
    @Input() subtitle: string = '';
    @Input() color: string = '';
}
