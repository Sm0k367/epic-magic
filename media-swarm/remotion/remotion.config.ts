import {Config} from '@remotion/cli/config';
import {enableTailwind} from '@remotion/tailwind';

Config.setVideoCodec('h264');
Config.setCodec('h264');
Config.setCrf(18);
Config.setImageFormat('jpeg');
Config.setOverwriteOutput(true);

enableTailwind();
