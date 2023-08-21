/*
 * @Author: Huangjs
 * @Date: 2023-07-28 09:57:17
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-01 16:21:03
 * @Description: ******
 */

import Gallery from '../gallery';
import type Picture from '../picture';

export default function singleTap(this: Gallery | Picture) {
  if (this._isClose) {
    return;
  }
  if (this instanceof Gallery) {
    if (this.isTransitioning()) {
      return;
    }
    const { entity } = (this._images && this._images[this._activeIndex]) || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._press === 'function') {
      this._press();
    }
  } else {
    const { entity } = this._image || {};
    if (entity && entity.isTransitioning()) {
      return;
    }
    if (typeof this._press === 'function') {
      this._press();
    }
  }
}
