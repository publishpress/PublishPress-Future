import { useLayoutedElements as elkUseLayoutedElements } from './elk';
import { useAutoLayout as useAutoLayoutHook } from './hooks';
import { default as AutoLayoutComponent } from './auto-layout';

export const useLayoutedElements = elkUseLayoutedElements;
export const useAutoLayout = useAutoLayoutHook;
export const AutoLayout = AutoLayoutComponent;
