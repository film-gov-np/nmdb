import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import QRCode from "react-qr-code";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toJpeg } from "html-to-image";
import { Circle, QrCode } from "lucide-react";
import { extractInitials } from "@/lib/utils";

const QrCodeGenerator = ({
  celebrity: { id, name, email, designations, profilePhotoUrl },
  showTrigger = true,
  ...props
}) => {
  const qrBlockRef = useRef(null);
  const downloadQRCode = () => {
    toJpeg(qrBlockRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = name + ".jpeg";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const url = "http://localhost:5173/celebrities/" + id;
  return (
    <Dialog {...props}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="p-2">
            <QrCode className="h-6 w-6 rounded-lg" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="justify-center sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Celebrity Card</DialogTitle>
        </DialogHeader>
        <div className="my-4 overflow-hidden">
          <div
            className="w-[22rem] h-[36.5rem] border border-input bg-gradient-to-b from-cyan-100 to-red-100 p-6 text-stone-800"
            ref={qrBlockRef}
          >
            <div className="grid grid-flow-row h-full justify-center content-between">
              <div className="flex flex-col items-center justify-center">
                <img src="/nmdb-logo.png" className="w-[90%] h-auto" alt="" />
              </div>
              <div className="flex justify-center">
                <div className="h-[8rem] max-w-[8rem]  rounded-lg bg-white p-2">
                  <QRCode
                    value={url}
                    size={256}
                    className="aspect-square h-auto w-full"
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2 justify-center">
                <h4 className="text-center font-mono text-3xl leading-none font-bold">
                  {name}
                </h4>
                <div className="flex flex-row flex-wrap justify-center space-x-3 font-medium">
                  {designations &&
                    designations.length > 0 &&
                    designations.map((designation) => (
                        <span className="">{designation}</span>
                    ))}
                </div>
                <span className="text-center text-muted">{email}</span>
              </div>
              <div className="flex justify-center">
                <Avatar className=" h-[10rem]  w-[10rem] border-8 border-cyan-100">
                  <AvatarImage src={profilePhotoUrl} alt="Avatar" />
                  <AvatarFallback>{extractInitials(name)}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={downloadQRCode}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeGenerator;
