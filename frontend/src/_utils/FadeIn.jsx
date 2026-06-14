import { useEffect, useState } from 'react';

// Remplacement leger de react-fade-in (non maintenu, incompatible React 19).
// Applique un fondu d'apparition au contenu lors de son montage.
const FadeIn = ({ children, className, transitionDuration = 400, style, ...rest }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FadeIn;
