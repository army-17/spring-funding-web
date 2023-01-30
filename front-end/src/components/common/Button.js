import classNames from "classnames";
import React from "react";
import "./Button.scss";

const Button = ({ children, size, color, wsize, outline, ...rest }) => {
  return (
    <button
      className={classNames("Button", size, color, wsize, { outline })}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  size: "medium",
  color: "blue",
  wsize: "basic",
};

export default Button;
