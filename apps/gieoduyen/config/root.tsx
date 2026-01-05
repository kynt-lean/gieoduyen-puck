import { DefaultRootProps, RootConfig } from "@measured/puck";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

export type RootProps = DefaultRootProps;

export const Root: RootConfig<{
  props: RootProps;
  fields: {
    userField: { type: "userField"; option: boolean };
  };
}> = {
  defaultProps: {
    title: "Gieo Duyên - Wedding / Invitation / Event",
  },
  render: ({ puck: { isEditing, renderDropZone: DropZone } }) => {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header editMode={isEditing} />
        <DropZone zone="default-zone" style={{ flexGrow: 1 }} />

        <Footer>
          <Footer.List title="Thông tin">
            <Footer.Link href="#">Về chúng tôi</Footer.Link>
            <Footer.Link href="#">Dịch vụ</Footer.Link>
            <Footer.Link href="#">Liên hệ</Footer.Link>
            <Footer.Link href="#">Hỗ trợ</Footer.Link>
          </Footer.List>
          <Footer.List title="Dịch vụ">
            <Footer.Link href="#">Thiết kế</Footer.Link>
            <Footer.Link href="#">Mẫu cưới</Footer.Link>
            <Footer.Link href="#">Thiệp mời</Footer.Link>
            <Footer.Link href="#">Sự kiện</Footer.Link>
          </Footer.List>
          <Footer.List title="Tài nguyên">
            <Footer.Link href="#">Hướng dẫn</Footer.Link>
            <Footer.Link href="#">Blog</Footer.Link>
            <Footer.Link href="#">FAQ</Footer.Link>
            <Footer.Link href="#">Tài liệu</Footer.Link>
          </Footer.List>
          <Footer.List title="Pháp lý">
            <Footer.Link href="#">Điều khoản</Footer.Link>
            <Footer.Link href="#">Chính sách</Footer.Link>
            <Footer.Link href="#">Bảo mật</Footer.Link>
            <Footer.Link href="#">Cookie</Footer.Link>
          </Footer.List>
        </Footer>
      </div>
    );
  },
};

export default Root;

