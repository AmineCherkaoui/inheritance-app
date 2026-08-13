import React from 'react';
import { motion } from 'motion/react';
import { ScrollText } from 'lucide-react';
import WillsForm from './WillsForm';
import MandatoryBequestForm from './MandatoryBequestForm';
import StepHeader from '../StepHeader';

export default function MiniStepWills({
  wills = [],
  addWill,
  updateWill,
  removeWill,
  heirsApprovedExcess,
  setHeirsApprovedExcess,
  checkWillsExceedThird,
  hasMandatoryBequest,
  handleSetHasMandatoryBequest,
  mandatoryBequests = [],
  setMandatoryBequests,
  errors = {}
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.22 }}
      className="w-full flex flex-col gap-6"
    >
      <StepHeader
        title="الوصايا والوصية الواجبة"
        icon={ScrollText}
        subtitle="تنفيذ وصايا المتوفى في حدود الثلث الشرعي والوصية الواجبة للأحفاد"
      />

      <div className="flex flex-col gap-6">
        <WillsForm
          wills={wills}
          addWill={addWill}
          updateWill={updateWill}
          removeWill={removeWill}
          heirsApprovedExcess={heirsApprovedExcess}
          setHeirsApprovedExcess={setHeirsApprovedExcess}
          checkWillsExceedThird={checkWillsExceedThird}
          errors={errors}
        />

        <MandatoryBequestForm
          hasMandatoryBequest={hasMandatoryBequest}
          setHasMandatoryBequest={handleSetHasMandatoryBequest}
          mandatoryBequests={mandatoryBequests}
          setMandatoryBequests={setMandatoryBequests}
          errors={errors}
        />
      </div>
    </motion.div>
  );
}
