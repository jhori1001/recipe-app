import React from 'react';
import { Composition } from 'remotion';
import { CM } from './CM';
import { FPS, timeline } from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition id="TorechaCM" component={CM} durationInFrames={timeline.total} fps={FPS} width={1920} height={1080} />
);
