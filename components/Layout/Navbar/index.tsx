import "./index.scss";
import {logoutUser} from "@app/redux/slices/UserSlice";
import {notification} from "antd";
import {useRouter} from "next/router";
import React from "react";
import {useDispatch} from "react-redux";

/**
 *
 */
export default function Navbar(): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="navbar flex items-center justify-end gap-[10px]">
      <div className="group-user-info">
        <div className="cursor-pointer flex items-center">
          <button
            type="button"
            className="bg-[#E1BDA9] text-white px-3 py-1 rounded-lg"
            onClick={() => {
              dispatch(logoutUser());
              router.push("/");
              notification.success({
                message: "Đăng xuất thành công!",
              });
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
