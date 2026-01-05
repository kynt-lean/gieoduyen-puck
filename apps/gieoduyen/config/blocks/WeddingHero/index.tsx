/* eslint-disable @next/next/no-img-element */
import { ComponentConfig } from "@measured/puck";
import { getClassNameFactory } from "@measured/puck/lib";
import { Section } from "../../components/Section";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("WeddingHero", styles);

export type WeddingHeroProps = {
  subtitle: string;
  title: string;
  images: {
    concept: {
      url: string;
      label: string;
    };
    decoration: {
      url: string;
      label: string;
    };
    ceremony: {
      url: string;
      label: string;
    };
  };
  padding: string;
};

export const WeddingHero: ComponentConfig<WeddingHeroProps> = {
  fields: {
    subtitle: {
      type: "text",
      label: "Subtitle",
    },
    title: {
      type: "text",
      label: "Title",
    },
    images: {
      type: "object",
      label: "Images",
      objectFields: {
        concept: {
          type: "object",
          objectFields: {
            url: {
              type: "text",
              label: "Concept Image URL",
            },
            label: {
              type: "text",
              label: "Concept Label",
            },
          },
        },
        decoration: {
          type: "object",
          objectFields: {
            url: {
              type: "text",
              label: "Decoration Image URL",
            },
            label: {
              type: "text",
              label: "Decoration Label",
            },
          },
        },
        ceremony: {
          type: "object",
          objectFields: {
            url: {
              type: "text",
              label: "Ceremony Image URL",
            },
            label: {
              type: "text",
              label: "Ceremony Label",
            },
          },
        },
      },
    },
    padding: {
      type: "select",
      label: "Padding",
      options: [
        { label: "64px", value: "64px" },
        { label: "96px", value: "96px" },
        { label: "128px", value: "128px" },
      ],
    },
  },
  defaultProps: {
    subtitle: "THERE IS SOMEONE FOR EVERYONE",
    title: "WELCOME TO OUR WEDDING PLANNING SERVICE",
    images: {
      concept: {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
        label: "CONCEPT",
      },
      decoration: {
        url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400",
        label: "DECORATION",
      },
      ceremony: {
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
        label: "CEREMONY",
      },
    },
    padding: "128px",
  },
  render: ({ subtitle, title, images, padding }) => {
    return (
      <Section
        className={getClassName()}
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        <div className={getClassName("inner")}>
          <div className={getClassName("header")}>
            <p className={getClassName("subtitle")}>{subtitle}</p>
            <h1 className={getClassName("title")}>{title}</h1>
          </div>
          <div className={getClassName("images")}>
            <div className={getClassName("imageItem")}>
              <div className={getClassName("imageWrapper")}>
                <img
                  src={images.concept.url}
                  alt={images.concept.label}
                  className={getClassName("image")}
                />
              </div>
              <p className={getClassName("imageLabel")}>
                {images.concept.label}
              </p>
            </div>
            <div className={getClassName("imageItem")}>
              <div className={getClassName("imageWrapper")}>
                <img
                  src={images.decoration.url}
                  alt={images.decoration.label}
                  className={getClassName("image")}
                />
              </div>
              <p className={getClassName("imageLabel")}>
                {images.decoration.label}
              </p>
            </div>
            <div className={getClassName("imageItem")}>
              <div className={getClassName("imageWrapper")}>
                <img
                  src={images.ceremony.url}
                  alt={images.ceremony.label}
                  className={getClassName("image")}
                />
              </div>
              <p className={getClassName("imageLabel")}>
                {images.ceremony.label}
              </p>
            </div>
          </div>
        </div>
      </Section>
    );
  },
};

export default WeddingHero;

