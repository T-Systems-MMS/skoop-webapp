import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { } from 'jasmine';

export const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}

export function advance(f: ComponentFixture<any>, time?: number): void {
  if (time) {
    tick(time);
  } else {
    tick();
  }
  f.detectChanges();
}

export function expectPathToBe(l: Location, path: string, expectationFailOutput?: any) {
  expect(l.path()).toEqual(path, expectationFailOutput || l.path());
}

export function expectPathToNotBe(l: Location, path: string, expectationFailOutput?: any) {
  expect(l.path()).not.toEqual(path, expectationFailOutput || l.path());
}
