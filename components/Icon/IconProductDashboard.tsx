import * as React from "react";
import {SVGProps} from "react";

function IconProductDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      fill="none"
      {...props}
    >
      <path
        fill="#212B36"
        d="M28.333 29.332H3.666c-.547 0-1-.453-1-1 0-.547.453-1 1-1h24.667c.546 0 1 .453 1 1 0 .547-.454 1-1 1Z"
      />
      <path
        fill="#212B36"
        d="m27.453 18.266-9.64 9.64a4.825 4.825 0 0 1-6.826.014L4.84 21.773l16.48-16.48 6.146 6.147a4.825 4.825 0 0 1-.013 6.826Z"
        opacity={0.4}
      />
      <path
        fill="#212B36"
        d="M21.32 5.292 4.825 21.772l-1.214-1.214a4.824 4.824 0 0 1 .014-6.826l9.64-9.64a4.824 4.824 0 0 1 6.826-.014l1.227 1.214ZM17.186 23.468l-1.8 1.8a.95.95 0 0 1-1.346 0 .95.95 0 0 1 0-1.346l1.8-1.8a.95.95 0 0 1 1.346 0 .95.95 0 0 1 0 1.346ZM23.027 17.627l-3.587 3.586a.95.95 0 0 1-1.347 0 .95.95 0 0 1 0-1.346l3.587-3.587a.95.95 0 0 1 1.347 0c.36.373.36.973 0 1.347Z"
      />
    </svg>
  );
}
export default IconProductDashboard;
