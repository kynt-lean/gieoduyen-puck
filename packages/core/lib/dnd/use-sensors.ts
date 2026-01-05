import { PointerActivationConstraints } from "@dnd-kit/dom";
import { isElement } from "@dnd-kit/dom/utilities";
import { type Distance } from "@dnd-kit/geometry";
import { PointerSensor } from "@dnd-kit/react";
import { useState } from "react";

export interface DelayConstraint {
  value: number;
  tolerance: Distance;
}

export interface DistanceConstraint {
  value: Distance;
  tolerance?: Distance;
}

export interface ActivationConstraints {
  distance?: DistanceConstraint;
  delay?: DelayConstraint;
}

const touchDefault = { delay: { value: 200, tolerance: 10 } };
const otherDefault = {
  delay: { value: 200, tolerance: 10 },
  distance: { value: 5 },
};

// Convert object format to array format that @dnd-kit expects
const convertToConstraintArray = (
  constraints: ActivationConstraints
): any[] => {
  const result: any[] = [];

  if (constraints.delay) {
    result.push(
      new PointerActivationConstraints.Delay(constraints.delay as any)
    );
  }

  if (constraints.distance) {
    result.push(
      new PointerActivationConstraints.Distance(constraints.distance as any)
    );
  }

  return result;
};

export const useSensors = (
  {
    other = otherDefault,
    mouse,
    touch = touchDefault,
  }: {
    mouse?: ActivationConstraints;
    touch?: ActivationConstraints;
    other?: ActivationConstraints;
  } = {
    touch: touchDefault,
    other: otherDefault,
  }
) => {
  const [sensors] = useState(() => [
    PointerSensor.configure({
      activationConstraints(event, source): any {
        const { pointerType, target } = event;

        let constraints: ActivationConstraints;

        if (
          pointerType === "mouse" &&
          isElement(target) &&
          (source.handle === target || source.handle?.contains(target))
        ) {
          constraints = mouse ?? other;
        } else if (pointerType === "touch") {
          constraints = touch ?? other;
        } else {
          constraints = other;
        }

        // Convert object format to array format
        return convertToConstraintArray(constraints);
      },
    }) as any,
  ]);

  return sensors;
};
