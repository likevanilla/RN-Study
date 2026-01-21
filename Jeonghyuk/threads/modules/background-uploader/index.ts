// Reexport the native module. On web, it will be resolved to BackgroundUploaderModule.web.ts
// and on native platforms to BackgroundUploaderModule.ts
export { default } from './src/BackgroundUploaderModule';
export { default as BackgroundUploaderView } from './src/BackgroundUploaderView';
export * from  './src/BackgroundUploader.types';
