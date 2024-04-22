import QrCodeGenerator from "@/components/common/QrCodeGenerator";
import { useLocation, useParams } from "react-router-dom";

const CelebritiesDetails = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  return (
    <div>
      <QrCodeGenerator url={pathname} />
    </div>
  );
};

export default CelebritiesDetails;
