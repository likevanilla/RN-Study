import { requireNativeView } from 'expo';
import * as React from 'react';

import { BackgroundUploaderViewProps } from './BackgroundUploader.types';

const NativeView: React.ComponentType<BackgroundUploaderViewProps> =
  requireNativeView('BackgroundUploader');

export default function BackgroundUploaderView(props: BackgroundUploaderViewProps) {
  return <NativeView {...props} />;
}
