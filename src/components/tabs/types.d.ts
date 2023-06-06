import { ICategory } from "../../types";
import { ChangeEvent, CSSProperties, ReactNode } from "react";

interface ITabsProps {
  value: number | string;
  tabs: ICategory[];
  onChange: (event: ChangeEvent<{}>, newValue: string) => void;
  sx?: CSSProperties;
}

interface ITabsItemProps {
  children: ReactNode;
  index: number;
  value: number | string;
  sx?: CSSProperties;
}

export { ITabsProps, ITabsItemProps };
