import MerchantHeader from "./merchantHeader";
import MerchantList from "./merchantList";
import { useEffect, useRef, useState } from "react";
import GuidelinesCard from "../../components/reusable/guidelinesCard";
import { merchantGuidelines } from "../../constants/guidelines";
import MerchantForm from "./merchantForm";
import { useZustandStore } from "../../store/zustandStore";
const MerchantCreation = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { fetchMerchantData, merchantData } = useZustandStore();
  const createMerchantRef = useRef(null);
  const scrollToTop = () => {
    if (createMerchantRef.current) {
      createMerchantRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchMerchantData();
  }, []);
  return (
    <>
      {/* Header */}
      <div ref={createMerchantRef}>
        <MerchantHeader
          formOpen={formOpen}
          setFormOpen={setFormOpen}
          setIsEditing={setIsEditing}
        />
      </div>
      {formOpen && <MerchantForm formOpen={formOpen} isEditing={isEditing} />}
      <MerchantList
        scrollToTop={scrollToTop}
        setFormOpen={setFormOpen}
        setIsEditing={setIsEditing}
      />
      <GuidelinesCard
        title="Merchant Creation Guidelines"
        guidelines={merchantGuidelines}
      />
    </>
  );
};

export default MerchantCreation;
