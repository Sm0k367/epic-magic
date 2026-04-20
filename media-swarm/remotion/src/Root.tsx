import {Composition} from 'remotion';
import {FloorburnerVisualizer} from './FloorburnerVisualizer';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FloorburnerVisualizer"
        component={FloorburnerVisualizer}
        durationInFrames={19200} // 8 minutes at 40fps (480 * 40)
        fps={40}
        width={1920}
        height={1080}
        defaultProps={{
          trackTitle: "FLOORBURNER",
        }}
      />
    </>
  );
};
