import React, { useState, CSSProperties } from "react";

interface SlideContainerProps {
  index: number;
  children: React.ReactNode[];
  updateHeight?: boolean;
}

const SlideContainer: React.FC<SlideContainerProps> = (props) => {
  const [height, setHeight] = useState(0);

  const updateHeight = props.updateHeight !== false;

  const setActiveSlide = (node: HTMLDivElement) => {
    if (updateHeight !== false && node && node.children && node.children.length > 0) {
      const child = node.children[0] as HTMLElement;
      if (child && child.offsetHeight && height !== child.offsetHeight) {
        setHeight(child.offsetHeight);
      }
    }
  }

  let outerStyle: CSSProperties = {
    overflowX: "hidden"
  };

  let innerStyle: CSSProperties = {
    flexDirection: "row",
    transition: "transform 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s",
    direction: "ltr",
    display: "flex",
    willChange: "transform",
    transform: `translate(${props.index * -100}%, 0px)`,
  }

  const slideStyle: CSSProperties = {
    width: "100%",
    flexShrink: 0,
    overflow: "auto hidden",
  }

  if (updateHeight) {
    innerStyle.height = height;
    innerStyle.transition = `${innerStyle.transition}, height 0.35s cubic-bezier(0.15, 0.3, 0.25, 1) 0s`;
  } else {
    outerStyle.height = "100%";
    innerStyle.height = "100%";
  }

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        {props.children.map((child, index) =>{
          let ref;
          let hidden = true;

          if (index === props.index) {
            hidden = false;
            ref = setActiveSlide;
          }

          return (
          <div key={index}
               ref={ref}
               style={slideStyle}
               aria-hidden={hidden}>
            {child}
          </div>
          );
        })}
      </div>
    </div>
  );
}

export default SlideContainer;