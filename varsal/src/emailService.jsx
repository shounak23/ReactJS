import { Toaster } from "react-hot-toast";

export default function ProposalSite() {
  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "16px",
          },
        }}
      />
      {/* rest of your app */}
    </>
  );
}
