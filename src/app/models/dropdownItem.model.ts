import { DropsideItem } from './dropsideItem.model';

export interface DropdownItem {
  id: string;
  label: string;
  dropsideItems: DropsideItem[];
}
