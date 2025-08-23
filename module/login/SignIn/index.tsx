import GlobalButton from "@app/components/GlobalButton";
import Config from "@app/config";
import {logo} from "@app/config/images";
import FormGlobal from "@components/Form/FormGlobal";
import TextInputForm from "@components/Form/TextInputForm";
import {
  ISignInForm,
  getValidationSignInSchema,
} from "@module/login/SignIn/form-config";
import {loginUser} from "@slices/UserSlice";
import {notification} from "antd";
import axios from "axios";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {useDispatch} from "react-redux";

export interface ISignInProps {
  changeTab: (tab: string) => void;
}

export function SignIn({changeTab}: ISignInProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleNextScreen = async (value: ISignInForm) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email: value.email,
        password: value.password,
      });

      if (response.data.success && response.data.data) {
        dispatch(loginUser(response.data.data));

        notification.success({
          message: "Đăng nhập thành công!",
        });
        if (
          response.data?.data?.user?.role &&
          response.data?.data?.user?.role === "admin"
        ) {
          router.push(Config.PATHNAME.DASHBOARD);
        } else {
          router.push(Config.PATHNAME.HOME);
        }
      } else {
        notification.error({
          message: response.data.error || "Đăng nhập thất bại",
        });
      }
    } catch (error: any) {
      notification.error({
        message: error.response?.data?.error || "Đăng nhập thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormGlobal<ISignInForm>
      resolver={getValidationSignInSchema()}
      onSubmit={handleNextScreen}
      render={({handleSubmitForm, watch}) => {
        const disabledButton = watch().email && watch().password;

        return (
          <div className="flex flex-col justify-center items-center md:w-[400px]">
            <Image src={logo} alt="logo" className="w-[168px] h-[18px] mb-6" />
            <div className="text-[#212B36] font-semibold text-2xl mb-4">
              Đăng nhập
            </div>
            <div className="flex gap-2 mb-6">
              <div className="text-[#212B36] text-base">
                Bạn chưa có tài khoản?
              </div>
              <div
                role="presentation"
                className="text-[#0EC1AF] text-base cursor-pointer"
                onClick={() => changeTab("signUp")}
              >
                Đăng ký
              </div>
            </div>
            <TextInputForm
              className="mb-2"
              placeholder="Nhập email"
              name="email"
              onPressEnter={handleSubmitForm}
            />
            <TextInputForm
              placeholder="Nhập mật khẩu"
              name="password"
              type="password"
              onPressEnter={handleSubmitForm}
            />
            {/* <div className="flex justify-end items-end w-full"> */}
            {/*  <div className="underline mt-4 text-xs cursor-pointer"> */}
            {/*    Quên mật khẩu? */}
            {/*  </div> */}
            {/* </div> */}
            <GlobalButton
              disabled={!disabledButton || isLoading}
              onClick={handleSubmitForm}
              className="mt-6 primary"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </GlobalButton>
          </div>
        );
      }}
    />
  );
}
