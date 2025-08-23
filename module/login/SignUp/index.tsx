import GlobalButton from "@app/components/GlobalButton";
import {logo} from "@app/config/images";
import FormGlobal from "@components/Form/FormGlobal";
import TextInputForm from "@components/Form/TextInputForm";
// eslint-disable-next-line import/named
import {
  // eslint-disable-next-line import/named
  ISignUpForm,
  getValidationSignUpSchema,
} from "@module/login/SignUp/form-config";
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

export function SignUp({changeTab}: ISignInProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleNextScreen = async (value: ISignUpForm) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register", {
        email: value.email,
        password: value.password,
        fullName: value.fullName,
      });

      if (response.data.success && response.data.data) {
        dispatch(loginUser(response.data.data));

        notification.success({
          message: "Đăng ký thành công!",
        });

        router.push("/"); // Redirect to home page
      } else {
        notification.error({
          message: response.data.error || "Đăng ký thất bại",
        });
      }
    } catch (error: any) {
      notification.error({
        message: error.response?.data?.error || "Đăng ký thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormGlobal<ISignUpForm>
      resolver={getValidationSignUpSchema()}
      onSubmit={handleNextScreen}
      render={({handleSubmitForm, watch}) => {
        const disabledButton =
          watch().email && watch().password && watch().fullName;

        return (
          <div className="flex flex-col justify-center items-center md:w-[400px]">
            <Image src={logo} alt="logo" className="w-[168px] h-[18px] mb-6" />
            <div className="text-[#212B36] font-semibold text-2xl mb-4">
              Đăng ký
            </div>
            <div className="flex gap-2 mb-6">
              <div className="text-[#212B36] text-base">
                Bạn đã có tài khoản?
              </div>
              <div
                role="presentation"
                onClick={() => changeTab("signIn")}
                className="text-[#0EC1AF] text-base cursor-pointer"
              >
                Đăng nhập
              </div>
            </div>
            <TextInputForm
              className="mb-2"
              placeholder="Họ tên"
              name="fullName"
              onPressEnter={handleSubmitForm}
            />
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
            <GlobalButton
              disabled={!disabledButton || isLoading}
              onClick={handleSubmitForm}
              className="mt-6 primary"
            >
              {isLoading ? "Đang đăng ký..." : "Đăng ký"}
            </GlobalButton>
            <div className="text-[#637381] mt-4 mb-2">
              Bằng cách đăng ký, tôi đồng ý với
            </div>
            <span>
              Điều khoản sử dụng <span className="text-[#637381]">và</span>{" "}
              Chính sách bảo mật.
            </span>
          </div>
        );
      }}
    />
  );
}
