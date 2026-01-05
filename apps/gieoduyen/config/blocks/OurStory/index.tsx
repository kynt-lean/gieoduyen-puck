/* eslint-disable @next/next/no-img-element */
import { ComponentConfig } from "@measured/puck";
import { getClassNameFactory } from "@measured/puck/lib";
import { Section } from "../../components/Section";
import styles from "./styles.module.css";

const getClassName = getClassNameFactory("OurStory", styles);

export type OurStoryProps = {
  title: string;
  milestones: {
    number: string;
    title: string;
    description?: string;
    images: {
      url: string;
      alt?: string;
    }[];
  }[];
  padding: string;
};

export const OurStory: ComponentConfig<OurStoryProps> = {
  fields: {
    title: {
      type: "text",
      label: "Section Title",
    },
    milestones: {
      type: "array",
      label: "Milestones",
      arrayFields: {
        number: {
          type: "text",
          label: "Number",
        },
        title: {
          type: "text",
          label: "Title",
        },
        description: {
          type: "textarea",
          label: "Description",
        },
        images: {
          type: "array",
          label: "Images",
          arrayFields: {
            url: {
              type: "text",
              label: "Image URL",
            },
            alt: {
              type: "text",
              label: "Alt Text",
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
    title: "KHÁM PHÁ CÂU CHUYỆN CỦA CHÚNG TÔI",
    milestones: [
      {
        number: "01",
        title: "CHÚNG TỚ VỪA QUEN",
        images: [
          {
            url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
            alt: "First meeting",
          },
          {
            url: "https://images.unsplash.com/photo-1518568814500-bf0f8e125f46?w=400",
            alt: "First date",
          },
        ],
      },
      {
        number: "02",
        title: "NĂM TAY NÈ",
        images: [
          {
            url: "https://images.unsplash.com/photo-1518568814500-bf0f8e125f46?w=400",
            alt: "Holding hands",
          },
        ],
      },
    ],
    padding: "96px",
  },
  render: ({ title, milestones, padding }) => {
    return (
      <Section
        className={getClassName()}
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        <div className={getClassName("inner")}>
          <h2 className={getClassName("title")}>{title}</h2>
          <div className={getClassName("milestones")}>
            {milestones.map((milestone, index) => (
              <div key={index} className={getClassName("milestone")}>
                <div className={getClassName("milestoneHeader")}>
                  <span className={getClassName("milestoneNumber")}>
                    {milestone.number}
                  </span>
                  <h3 className={getClassName("milestoneTitle")}>
                    {milestone.title}
                  </h3>
                </div>
                {milestone.description && (
                  <p className={getClassName("milestoneDescription")}>
                    {milestone.description}
                  </p>
                )}
                <div className={getClassName("milestoneImages")}>
                  {milestone.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className={getClassName("milestoneImageWrapper")}
                    >
                      <img
                        src={image.url}
                        alt={image.alt || ""}
                        className={getClassName("milestoneImage")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>
    );
  },
};

export default OurStory;

