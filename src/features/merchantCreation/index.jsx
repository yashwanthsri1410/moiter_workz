import MerchantHeader from "./merchantHeader";
import MerchantList from "./merchantList";
import { useRef, useState } from "react";
import GuidelinesCard from "../../components/reusable/guidelinesCard";
import { merchantGuidelines } from "../../constants/guidelines";
import MerchantForm from "./merchantForm";
const MerchantCreation = () => {
  const [formOpen, setFormOpen] = useState(false);
  const createMerchantRef = useRef(null);
  const scrollToTop = () => {
    if (createMerchantRef.current) {
      createMerchantRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <>
      {/* Header */}
      <div ref={createMerchantRef}>
        <MerchantHeader formOpen={formOpen} setFormOpen={setFormOpen} />
      </div>
      {formOpen && <MerchantForm />}
      <MerchantList scrollToTop={scrollToTop} setFormOpen={setFormOpen} />
      <GuidelinesCard
        title="Merchant Creation Guidelines"
        guidelines={merchantGuidelines}
      />
    </>
  );
};

export default MerchantCreation;
