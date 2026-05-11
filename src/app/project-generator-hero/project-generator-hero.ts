import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

type HeroState = 'idle' | 'burnout' | 'collapsed';

@Component({
  selector: 'app-project-generator-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-generator-hero.html',
  styleUrls: ['./project-generator-hero.css'],
  animations: [
    trigger('logoMotion', [
      state(
        'idle',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'burnout',
        style({
          transform: 'translateX(0)',
        })
      ),
      state(
        'collapsed',
        style({
          transform: 'translateX(-45%)',
        })
      ),
      transition('idle => burnout', [animate('300ms ease-out')]),
      transition('burnout => collapsed', [animate('760ms cubic-bezier(0.22, 1, 0.36, 1)')]),
    ]),
    trigger('buttonReveal', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateX(-18px)',
          pointerEvents: 'none',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateX(0)',
          pointerEvents: 'auto',
        })
      ),
      transition('hidden => visible', [animate('520ms cubic-bezier(0.16, 1, 0.3, 1)')]),
      transition('visible => hidden', [animate('240ms ease-in')]),
    ]),
  ],
})
export class ProjectGeneratorHeroComponent {
  @Output() generate = new EventEmitter<void>();

  state: HeroState = 'idle';
  buttonVisible = false;
  private animating = false;

  startSequence(): void {
    if (this.animating) return;

    if (this.state === 'collapsed') {
      this.generate.emit();
      return;
    }

    this.animating = true;
    this.state = 'burnout';
    this.buttonVisible = false;

    setTimeout(() => {
      this.state = 'collapsed';
      this.buttonVisible = true;
      this.animating = false;
    }, 900);
  }

  triggerGenerate(): void {
    this.generate.emit();
  }
}
