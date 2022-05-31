import React, { useEffect } from 'react';

const WindowFocusHandler = () => {
  useEffect(() => {
    document.addEventListener(
      'visibilitychange',
      function () {
        if (document.hidden) {
          alert('Hayo');
        } else {
          console.log('well back');
        }
      },
      false
    );
  }, []);

  return <></>;
};

export default WindowFocusHandler;
