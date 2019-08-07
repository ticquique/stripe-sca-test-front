import {
  animate,
  state,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
  keyframes,
} from '@angular/animations';

const animationBody = [
  // Note: The `enter` animation transitions to `transform: none`, because for some reason
  // specifying the transform explicitly, causes IE both to blur the dialog content and
  // decimate the animation performance. Leaving it as `none` solves both issues.
  state('void, exit, hidden', style({opacity: 0, transform: 'scaleY(0) translateY(-50%)', display: 'none'})),
  state('enter', style({opacity: 1, transform: 'none', display: 'block'})),
  transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', keyframes([
    style({display: 'block' , offset: 0}),
    style({transform: 'none', opacity: 1, offset: 1 })
  ]))),
  transition('* => void, * => exit, * => hidden',
      animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({opacity: 0}))),
];

/**
 * Animations used by AppDialog.
 * @docs-private
 */
export const appDropdownAnimations: {
  readonly dropdown: AnimationTriggerMetadata;
} = {
  /** Animation that is applied on the dialog container by defalt. */
  dropdown: trigger('dropdown', animationBody),
};
