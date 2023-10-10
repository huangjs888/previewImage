/*
 * @Author: Huangjs
 * @Date: 2022-05-11 17:49:45
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-10-10 16:06:10
 * @Description: ******
 */

import Gallery from './gallery';
import Image from './image';
import { type ISPBox } from '../core';

export * from '../core';

export * from './gallery';

export * from './image';

export { Gallery, Image };

export default function previewImage({
  urls = [],
  current = '',
  showMenu,
  thumbnail,
}: {
  urls?: string[];
  current?: string;
  showMenu?: () => void;
  thumbnail?: ISPBox;
} = {}) {
  const index = urls.indexOf(current);
  const gallery = new Gallery({
    current: index,
    imageUrls: urls,
    thumbnail,
    destroyOnClose: true,
    enableSwipeClose: true,
    onPopupMenu: showMenu,
    onClose: () => {
      gallery.close();
    },
  });
  gallery.open();
}