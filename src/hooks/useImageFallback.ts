import { useState, useEffect } from "react";

const useImageFallback = (primarySrc: string, fallbackSrc: string) => {
  const [imageSrc, setImageSrc] = useState(primarySrc);

  useEffect(() => {
    setImageSrc(primarySrc);
  }, [primarySrc]);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return {
    src: imageSrc,
    onError: handleError,
  };
};

export default useImageFallback;
