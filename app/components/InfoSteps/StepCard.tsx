import React from "react";
import { IconType } from "react-icons";

type StepCardProps = {
  icon: IconType;
  title: string;
  description: string;
};

const StepCard: React.FC<StepCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center flex flex-col items-center">
      {/* Icon container with flexbox to center content */}
      <div className="text-amber-500 text-5xl mb-6">
        <Icon />
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default StepCard;