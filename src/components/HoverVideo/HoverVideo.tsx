import React, { useState, useRef } from 'react';
import Image from 'next/image';

type HoverVideoProps = {
  imageSrc: string;
  videoSrc: string;
  alt: string;
  width: string;
  height: string;
};

const HoverVideo: React.FC<HoverVideoProps> = ({
  imageSrc,
  videoSrc,
  alt,
  width,
  height,
}: HoverVideoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }}
      onClick={handlePlay}
    >
      {/* Image */}
      <Image
        src={imageSrc}
        width={parseInt(width)}
        height={parseInt(height)}
        alt={alt}
        className={`transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Video Overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          width={parseInt(width)}
          height={parseInt(height)}
          className="w-full h-full object-cover rounded-lg"
          onEnded={handleVideoEnd}
          preload="metadata"
        />

        {/* Play/Pause Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-opacity-70 transition-all duration-200">
            {isPlaying ? (
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverVideo;
