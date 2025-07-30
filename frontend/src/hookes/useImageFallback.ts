import { useState, useEffect } from "react";

const useImageFallback = (primarySrc: string, fallbackSrc: string) => {
  const [imageSrc, setImageSrc] = useState(primarySrc);

  useEffect(() => {
    // We must reset the src whenever the primarySrc changes
    setImageSrc(primarySrc);
  }, [primarySrc]);

  const handleError = () => {
    // If an error occurs loading the primary image, switch to the fallback
    setImageSrc(fallbackSrc);
  };

  return {
    src: imageSrc,
    onError: handleError,
  };
};

export default useImageFallback;
