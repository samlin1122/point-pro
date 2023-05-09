import { IMenuCategory } from "../../types";
import { ChangeEvent, CSSProperties, ReactNode } from "react";

interface ITabsProps {
  value: string;
  tabs: IMenuCategory[];
  onChange: (event: ChangeEvent<{}>, newValue: string) => void;
  sx?: CSSProperties;
}

interface ITabsItemProps {
  children: ReactNode;
  index: number;
  value: number;
}

export { ITabsProps, ITabsItemProps };
