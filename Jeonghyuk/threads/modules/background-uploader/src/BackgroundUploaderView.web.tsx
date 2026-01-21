import * as React from 'react';

import { BackgroundUploaderViewProps } from './BackgroundUploader.types';

export default function BackgroundUploaderView(props: BackgroundUploaderViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
