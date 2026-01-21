import { NativeModule, requireNativeModule } from 'expo';

import { BackgroundUploaderModuleEvents } from './BackgroundUploader.types';

declare class BackgroundUploaderModule extends NativeModule<BackgroundUploaderModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BackgroundUploaderModule>('BackgroundUploader');
