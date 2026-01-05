import { getClassNameFactory } from "@measured/puck/lib";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Header", styles);

const NavItem = ({ label, href }: { label: string; href: string }) => {
  const navPath =
    typeof window !== "undefined"
      ? window.location.pathname.replace("/edit", "") || "/"
      : "/";

  const isActive = navPath === (href.replace("/edit", "") || "/");

  const El = href ? "a" : "span";

  return (
    <El
      href={href || "/"}
      style={{
        textDecoration: "none",
        color: isActive
          ? "var(--puck-color-grey-02)"
          : "var(--puck-color-grey-06)",
        fontWeight: isActive ? "600" : "400",
      }}
    >
      {label}
    </El>
  );
};

const Header = ({ editMode }: { editMode: boolean }) => (
  <div className={getClassName()}>
    <header className={getClassName("inner")}>
      <div className={getClassName("logo")}>GIEO DUYEN</div>
      <nav className={getClassName("items")}>
        <NavItem label="Trang chủ" href={`${editMode ? "" : "/"}`} />
        <NavItem label="Thiết kế" href={editMode ? "" : "/design"} />
        <NavItem label="Về chúng tôi" href={editMode ? "" : "/about"} />
      </nav>
    </header>
  </div>
);

export { Header };

