import ImageAbout1 from "../../public/img/about-us/img.svg";
import ImageAbout2 from "../../public/img/about-us/img_1.svg";
import {PageHeader} from "@components/PageHeader";
import Image from "next/image";

export function AboutUs(): JSX.Element {
  return (
    <div className="w-full bg-white">
      <PageHeader
        title="Chúng tôi là ai?"
        subtitle="Nơi nghệ thuật chạm đến cuộc sống"
        backgroundImage="/img/about-us.svg"
      />
      <div className="max-w-[1200px] mx-auto px-6 py-10 md:py-[120px]">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-16">
          <div className="flex items-center gap-6">
            <Image
              className="h-[151px] w-[151px] md:w-[260px] md:h-[260px] rounded-2xl"
              height={260}
              width={260}
              src={ImageAbout1}
              alt="hehe"
            />
            <Image
              className="h-[227px] w-[151px] md:w-[260px] md:h-[390px] rounded-2xl "
              height={390}
              width={260}
              src={ImageAbout2}
              alt="hehe2"
            />
          </div>
          <div>
            <div className="text-3xl font-semibold">Về Chúng Tôi</div>
            <div className="w-full lg:max-w-[600px] text-[#637381] my-4">
              Chúng tôi là một thương hiệu tranh nghệ thuật thủ công, ra đời từ
              tình yêu với vẻ đẹp của hội họa và mong muốn lan tỏa những giá trị
              tốt đẹp đến cộng đồng. Mỗi tác phẩm không chỉ được tạo nên từ
              nguyên liệu chất lượng cao, bền vững, mà còn mang trong mình một
              sứ mệnh: kết nối yêu thương và truyền cảm hứng. Với mỗi bức tranh
              được chọn, một phần doanh thu sẽ được trích để đóng góp vào các
              hoạt động từ thiện – từ hỗ trợ trẻ em có hoàn cảnh khó khăn đến
              các chương trình bảo vệ môi trường. Chúng tôi tin rằng, sự ấm áp
              của nghệ thuật có thể lan tỏa chỉ từ những điều giản dị nhất.
            </div>
          </div>
        </div>
        <iframe
          className="w-full md:h-[500px] h-[200px] rounded-3xl mt-12"
          src="https://www.youtube.com/embed/Jaw6RefCKpo?si=bsZ095HZZI4Vm0IC"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
        <div className="text-center mt-10 text-2xl font-bold">
          Tầm nhìn của chúng tôi trở thành thương hiệu tranh nghệ thuật được yêu
          thích, <br />
          nơi mỗi sản phẩm không chỉ mang vẻ đẹp nghệ thuật mà còn góp phần{" "}
          <br />
          lan tỏa yêu thương qua các hoạt động từ thiện ý nghĩa.
        </div>
      </div>
    </div>
  );
}
